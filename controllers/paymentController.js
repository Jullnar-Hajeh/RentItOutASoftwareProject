const con = require("../config/database"); // Ensure this path is correct
const { client } = require('../paypalConfig');

const paypal = require('@paypal/checkout-server-sdk');

// Get pending payments for the current user
exports.getPendingPayments = (req, res) => {
    const user_id = req.user.id;  
    const query = 'SELECT * FROM payment WHERE status = "pending" AND renter_id = ?';

    con.query(query, [user_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error retrieving pending payments', error });
        }
        return res.status(200).json(results);
    });
};



exports.getPendingFins = (req, res) => {
    const user_id = req.user.id;  
    const query = 'SELECT * FROM payment WHERE status = "pending" AND payment_type="fine" AND renter_id = ?';

    con.query(query, [user_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error retrieving pending fines', error });
        }
        return res.status(200).json(results);
    });
};

exports.executePayment = (req, res) => {
    const user_id = req.user.id;  
    const paymentId = req.body.paymentId;
    const paymentType = req.body.method;

    if (!paymentType || (paymentType !== 'paypal' && paymentType !== 'on_arrival')) {
        return res.status(400).json({ message: 'Invalid payment type. Must be "paypal" or "on_arrival".' });
    }

    // Query to retrieve payment details
    const query = 'SELECT * FROM payment WHERE payment_id = ? AND renter_id = ? AND status = "pending"';
    console.log("Executing SELECT query with paymentId:", paymentId, "and user_id:", user_id);

    con.query(query, [paymentId, user_id], (error, results) => {
        if (error) {
            console.error("Error retrieving payment:", error);
            return res.status(500).json({ message: 'Error retrieving payment', error });
        }

        if (results.length > 0) {
            const payment = results[0];
            const totalAmount = payment.amount;
            const ownerId = payment.owner_id;

            // Update the payment method and status based on the type
            const status = paymentType === 'on_arrival' ? 'completed' : 'pending';
            const updatePaymentQuery = 'UPDATE payment SET status = ?, method = ? WHERE payment_id = ?';
            console.log("Executing UPDATE query with paymentType:", paymentType, "and paymentId:", paymentId);

            con.query(updatePaymentQuery, [status, paymentType, paymentId], (updateError) => {
                if (updateError) {
                    console.error("Error updating payment status:", updateError);
                    return res.status(500).json({ message: 'Error updating payment status', error: updateError });
                }

                // If payment method is "paypal", just update the status and return response
                if (paymentType === 'paypal') {
                    return res.status(200).json({ message: 'Payment method set to PayPal and status pending.' });
                }



                const adminQuery = 'SELECT userID FROM users WHERE role = "Admin" LIMIT 1';


                con.query(adminQuery, (adminError, adminResults) => {
                    if (adminError) {
                        return res.status(500).json({ message: 'Error retrieving Admin user ID', error: adminError });
                    }

                    if (adminResults.length === 0) {
                        return res.status(404).json({ message: 'Admin user not found' });
                    }

                    const adminId = adminResults[0].userID;



                
                // If payment method is "on_arrival", insert the transactions
                const platformFee = (totalAmount * 0.05).toFixed(2);
                const ownerAmount = (totalAmount * 0.95).toFixed(2);

                const transferQuery = `
                    INSERT INTO transactions (amount, type, user_id, payment_id, created_at) VALUES
                    (?, 'platform_fee', ?, ?, NOW()),
                    (?, 'owner_payment', ?, ?, NOW())
                `;
                console.log("Executing INSERT into transactions with amounts:", platformFee, ownerAmount);

                con.query(transferQuery, [platformFee, adminId, paymentId, ownerAmount, ownerId, paymentId], (transferError) => {
                    if (transferError) {
                        console.error("Error recording transfers:", transferError);
                        return res.status(500).json({ message: 'Error recording transfers', error: transferError });
                    }
                    return res.status(200).json({ message: 'Payment completed successfully with on_arrival method' });
                });
            });
        });
        } else {
            console.log("No matching payment found or payment is not pending.");
            return res.status(404).json({ message: 'Payment not found or not pending' });
        }
    });
};



exports.getUserRevenue = (req, res) => {
    const user_id = req.user.id; // Get the user ID from the authenticated user

    // SQL query to get the total revenue for the user
    const query = `
        SELECT SUM(amount) AS total_revenue
        FROM transactions
        WHERE user_id = ? AND type = 'owner_payment'
    `;

    con.query(query, [user_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error retrieving revenue', error });
        }

        // Check if results are not empty and return the revenue
        const totalRevenue = results[0].total_revenue || 0; // Default to 0 if no revenue found
        return res.status(200).json({ totalRevenue });
    });
};

exports.getPlatformRevenue = (req, res) => {
    const user_id = req.user.id; // Get the user ID from the request (assuming it's stored in req.user)

    // First, check if the user is an admin
    const adminCheckQuery = `SELECT role FROM users WHERE userID = ?`;

    con.query(adminCheckQuery, [user_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error checking user role', error });
        }

        if (results.length > 0 && results[0].role === 'Admin') {
            // User is an admin, proceed to get the platform's revenue
            const platformRevenueQuery = `
                SELECT SUM(amount) AS total_revenue
                FROM transactions
                WHERE type = 'platform_fee'
            `;

            con.query(platformRevenueQuery, (revenueError, revenueResults) => {
                if (revenueError) {
                    return res.status(500).json({ message: 'Error retrieving platform revenue', error: revenueError });
                }

                const totalRevenue = revenueResults[0].total_revenue || 0; // Default to 0 if no revenue found
                return res.status(200).json({ totalRevenue });
            });
        } else {
            // User is not an admin
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    });
};

// Execute all pending payments for the current renter
exports.payAll = (req, res) => {
    const user_id = req.user.id; // Get the user ID from the request

    // Query to retrieve all pending payments for the current renter
    const query = 'SELECT * FROM payment WHERE renter_id = ? AND status = "pending"';
    
    con.query(query, [user_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error retrieving pending payments', error });
        }

        // If there are pending payments
        if (results.length > 0) {
            let completedPayments = [];
            let failedPayments = [];

            // Process each pending payment
            results.forEach((payment) => {
                const paymentId = payment.payment_id;
                const totalAmount = payment.amount;
                const ownerId = payment.owner_id;

                // Calculate platform fee and owner payment
                const platformFee = (totalAmount * 0.05).toFixed(2); // 5% fee
                const ownerAmount = (totalAmount * 0.95).toFixed(2); // 95% to owner

                // Update the payment status to "completed"
                const updatePaymentQuery = 'UPDATE payment SET status = "completed" WHERE payment_id = ?';
                con.query(updatePaymentQuery, [paymentId], (updateError) => {
                    if (updateError) {
                        failedPayments.push({ paymentId, error: updateError });
                        return; // Skip this payment if there's an error updating the status
                    }

                    // Insert the transaction records (platform fee and owner payment)
                    const transferQuery = `
                      INSERT INTO transactions (amount, type, user_id, payment_id) VALUES
                      (?, 'platform_fee', (SELECT userID FROM users WHERE role = 'admin'), ?),
                      (?, 'owner_payment', ?, ?)
                    `;
                    con.query(transferQuery, [platformFee, paymentId, ownerAmount, ownerId, paymentId], (transferError) => {
                        if (transferError) {
                            failedPayments.push({ paymentId, error: transferError });
                        } else {
                            completedPayments.push(paymentId);
                        }

                        // If this is the last payment being processed, respond with the results
                        if (completedPayments.length + failedPayments.length === results.length) {
                            return res.status(200).json({
                                message: 'Payments processed',
                                completedPayments,
                                failedPayments
                            });
                        }
                    });
                });
            });
        } else {
            return res.status(404).json({ message: 'No pending payments found' });
        }
    });
};

// Get all received payments for the current user (owner)
exports.getReceivedPayments = (req, res) => {
    const owner_id = req.user.id; // Get the current user ID (item owner)

    // SQL query to get all owner payments
    const query = `
        SELECT t.amount, t.type, t.payment_id, r.item_id, p.renter_id, r.end_date
        FROM transactions t
        JOIN payment p ON t.payment_id = p.payment_id
        JOIN rental r ON p.rental_id = r.id
        WHERE t.type = 'owner_payment' AND t.user_id = ?
        ORDER BY r.end_date DESC
    `;
    con.query(query, [owner_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error retrieving received payments', error });
        }

        // If transactions are found, return them
        if (results.length > 0) {
            return res.status(200).json({
                message: 'Received payments retrieved successfully',
                payments: results
            });
        } else {
            return res.status(404).json({ message: 'No received payments found' });
        }
    });
};



function queryDatabase(query, params = []) {
    return new Promise((resolve, reject) => {
        con.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

// Create PayPal payment
// exports.createPayment = async (req, res) => {
//     const { paymentId } = req.body;

//     // Fetch payment details from the `payment` table
//     const paymentQuery = 'SELECT amount FROM payment WHERE payment_id = ?';
//     try {
//         const rows = await queryDatabase(paymentQuery, [paymentId]);
        
//         if (rows.length === 0) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         const { amount } = rows[0];

//         // Create a new PayPal order
//         const request = new paypal.orders.OrdersCreateRequest();
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 amount: {
//                     currency_code: 'USD',
//                     value: amount.toFixed(2),
//                 },
//             }],
//         });

//         const order = await client().execute(request);
//         res.json({ orderId: order.result.id }); // Send order ID to client for approval
//     } catch (error) {
//         console.error("Error creating PayPal payment:", error);
//         res.status(500).send("Error creating PayPal payment");
//     }
// };


// exports.executePaymentt = async (req, res) => {
//     const { token } = req.query; // Get the PayPal token from query parameters

//     if (!token) {
//         return res.status(400).json({ message: 'Token is missing from the request.' });
//     }

//     const request = new paypal.orders.OrdersCaptureRequest(token); // Use the token to capture payment
//     request.requestBody({});

//     try {
//         const capture = await client().execute(request);
//         if (capture.result.status === 'COMPLETED') {
//             const orderId = capture.result.id; // Capture the Order ID from the response
//             return res.status(200).json({ message: `Payment successfully captured. Order ID: ${orderId}` });
//         } else {
//             return res.status(400).json({ message: 'Payment capture failed.' });
//         }
//     } catch (error) {
//         console.error("Error capturing payment:", error);
//         res.status(500).json({ error: "Error capturing PayPal payment" });
//     }
// };


exports.executePaymentt = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token is missing from the request.' });
    }

    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});

    try {
        const capture = await client().execute(request);
        if (capture.result.status === 'COMPLETED') {
            const orderId = capture.result.id;
            return res.status(200).json({ message: `Payment successfully captured. Order ID: ${orderId}` });
        } else {
            return res.status(400).json({ message: 'Payment capture failed.' });
        }
    } catch (error) {
        console.error("Error capturing payment:", error);
        res.status(500).json({ error: "Error capturing PayPal payment" });
    }
};


// exports.executePaymentt = async (req, res) => {
//     const { token } = req.query; // Get the PayPal token from query parameters

//     if (!token) {
//         return res.status(400).json({ message: 'Token is missing from the request.' });
//     }

//     const request = new paypal.orders.OrdersCaptureRequest(token); // Use the token to capture payment
//     request.requestBody({});

//     try {
//         const capture = await client().execute(request);
//         if (capture.result.status === 'COMPLETED') {
//             return res.status(200).json({ message: 'Payment successfully captured.' });
//         } else {
//             return res.status(400).json({ message: 'Payment capture failed.' });
//         }
//     } catch (error) {
//         console.error("Error capturing payment:", error);
//         res.status(500).json({ error: "Error capturing PayPal payment" });
//     }
// };

const paymentController = require('../controllers/paymentController');

// exports.executePaymentt = async (req, res) => {
//     const { token } = req.query; // Get the PayPal token from query parameters
//     const request = new paypal.orders.OrdersCaptureRequest(token);

//     try {
//         const capture = await client().execute(request);
//         if (capture.result.status === 'COMPLETED') {
//             const orderId = capture.result.id; // Capture ID from the response

//             // Call your capturePayment function here with orderId and paymentId
//             const paymentId = capture.result.purchase_units[0].payments.captures[0].id; // Adjust based on your schema
//             await paymentController.capturePayment({ body: { orderId, paymentId } }, res);
//         } else {
//             return res.status(400).json({ message: 'Payment capture failed.' });
//         }
//     } catch (error) {
//         console.error("Error capturing payment:", error);
//         res.status(500).json({ error: "Error capturing PayPal payment" });
//     }
// };


// exports.executePaymentt = async (req, res) => {
//     const { token } = req.query; // Get the PayPal token from query parameters
//     const { paymentId } = req.body; // Extract paymentId from request body

//     const request = new paypal.orders.OrdersCaptureRequest(token);

//     try {
//         const capture = await client().execute(request);
//         if (capture.result.status === 'COMPLETED') {
//             const orderId = capture.result.id; // Capture ID from the response
//             console.log("Order ID:", orderId);
//             console.log("Payment ID to capture:", paymentId); // Log the paymentId

//             // Call your capturePayment function here with orderId and paymentId
//             await paymentController.capturePayment({ body: { orderId, paymentId } }, res);
//         } else {
//             return res.status(400).json({ message: 'Payment capture failed.' });
//         }
//     } catch (error) {
//         console.error("Error capturing payment:", error);
//         res.status(500).json({ error: "Error capturing PayPal payment" });
//     }
// };







// exports.createPayment = async (req, res) => {
//     const { paymentId } = req.body;

//     // Fetch payment details from the `payment` table
//     const paymentQuery = 'SELECT amount FROM payment WHERE payment_id = ?';
//     try {
//         const rows = await queryDatabase(paymentQuery, [paymentId]);
        
//         if (rows.length === 0) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         const { amount } = rows[0];

//         // Create a new PayPal order
//         const request = new paypal.orders.OrdersCreateRequest();
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 amount: {
//                     currency_code: 'USD',
//                     value: amount.toFixed(2),
//                 },
//             }],
//             application_context: {
//                 return_url: "http://localhost:3000/api/payment/execute-payment", // Corrected URL
//             }
//         });

//         const order = await client().execute(request);

//         // Find the approval URL
//         const approvalLink = order.result.links.find(link => link.rel === 'approve');
        
//         if (!approvalLink) {
//             return res.status(500).json({ message: "Approval link not found" });
//         }

//         // Send approval link to client
//         res.json({ orderId: order.result.id, approvalUrl: approvalLink.href });
//     } catch (error) {
//         console.error("Error creating PayPal payment:", error);
//         res.status(500).send("Error creating PayPal payment");
//     }
// };





// exports.createPayment = async (req, res) => {
//     const { paymentId } = req.body;

//     const paymentQuery = 'SELECT amount FROM payment WHERE payment_id = ?';
//     try {
//         const rows = await queryDatabase(paymentQuery, [paymentId]);
        
//         if (rows.length === 0) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         const { amount } = rows[0];

//         const request = new paypal.orders.OrdersCreateRequest();
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 amount: {
//                     currency_code: 'USD',
//                     value: amount.toFixed(2),
//                 },
//             }],
//             application_context: {
//                 return_url: "http://localhost:3000/api/payment/execute-payment",
//             }
//         });

//         const order = await client().execute(request);
//         const approvalLink = order.result.links.find(link => link.rel === 'approve');
        
//         if (!approvalLink) {
//             return res.status(500).json({ message: "Approval link not found" });
//         }




        

//         res.json({ orderId: order.result.id, approvalUrl: approvalLink.href });
//     } catch (error) {
//         console.error("Error creating PayPal payment:", error);
//         res.status(500).send("Error creating PayPal payment");
//     }
// };

// exports.createPayment = async (req, res) => {
//     const { paymentId } = req.body;

//     // Query the amount from your database based on paymentId
//     const paymentQuery = 'SELECT amount FROM payment WHERE payment_id = ?';
//     con.query(paymentQuery, [paymentId], async (error, results) => {
//         if (error) {
//             console.error("Database error:", error);
//             return res.status(500).json({ message: "Database error" });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         const amount = results[0].amount;

//         // Set up PayPal order creation request
//         const request = new paypal.orders.OrdersCreateRequest();
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 amount: {
//                     currency_code: 'USD',
//                     value: amount.toFixed(2),
//                 },
//             }],
//             application_context: {
//                 brand_name: 'Rent It Out',
//                 landing_page: 'BILLING',
//                 user_action: 'PAY_NOW',
//                 return_url: `http://localhost:3000/api/payment/capture-payment`,
//                 cancel_url: 'http://localhost:3000/api/payment/cancel'
//             }
//         });

//         try {
//             // Execute PayPal order creation
//             const order = await client().execute(request);
//             const orderId = order.result.id;

//             // Get the approval link
//             const approveLink = order.result.links.find(link => link.rel === "approve");
//             if (!approveLink) {
//                 return res.status(500).json({ message: "Approval link not found" });
//             }

//             res.status(200).json({
//                 message: "Payment created. Please approve the payment.",
//                 approveUrl: approveLink.href,
//                 orderId
//             });
//         } catch (error) {
//             console.error("Error creating payment:", error);
//             res.status(500).json({ message: "Error creating payment" });
//         }
//     });
// };




//good
// exports.createPayment = async (req, res) => {
//     const { paymentId } = req.body;

//     const paymentQuery = 'SELECT amount FROM payment WHERE payment_id = ?';
//     con.query(paymentQuery, [paymentId], async (error, results) => {
//         if (error) {
//             console.error("Database error:", error);
//             return res.status(500).json({ message: "Database error" });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         const amount = results[0].amount;

//         const request = new paypal.orders.OrdersCreateRequest();
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 amount: {
//                     currency_code: 'USD',
//                     value: amount.toFixed(2),
//                 },
//             }],
//             application_context: {
//                 brand_name: 'Rent It Out',
//                 landing_page: 'BILLING',
//                 user_action: 'PAY_NOW',
//                 return_url: `http://localhost:3000/api/payment/capture-payment?orderId=PLACEHOLDER_ORDER_ID&paymentId=PLACEHOLDER_PAYMENT_ID`,
//                 cancel_url: 'http://localhost:3000/api/payment/cancel'
//             }
//         });

//         try {
//             const order = await client().execute(request);
//             const orderId = order.result.id;

//             const approveLink = order.result.links.find(link => link.rel === "approve").href;
//             const modifiedApproveLink = approveLink
//                 .replace("PLACEHOLDER_ORDER_ID", orderId)
//                 .replace("PLACEHOLDER_PAYMENT_ID", paymentId);

//             res.status(200).json({
//                 message: "Payment created. Please approve the payment.",
//                 approveUrl: modifiedApproveLink,
//                 orderId,
//                 paymentId
//             });
//         } catch (error) {
//             console.error("Error creating payment:", error);
//             res.status(500).json({ message: "Error creating payment" });
//         }
//     });
// };



// exports.createPayment = async (req, res) => {
//     const { paymentId } = req.body;

//     const paymentQuery = 'SELECT amount FROM payment WHERE payment_id = ?';
//     con.query(paymentQuery, [paymentId], async (error, results) => {
//         if (error) {
//             console.error("Database error:", error);
//             return res.status(500).json({ message: "Database error" });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         const amount = results[0].amount;

//         try {
//             const request = new paypal.orders.OrdersCreateRequest();
//             request.requestBody({
//                 intent: 'CAPTURE',
//                 purchase_units: [{
//                     amount: {
//                         currency_code: 'USD',
//                         value: amount.toFixed(2),
//                     },
//                 }],
//                 application_context: {
//                     brand_name: 'Rent It Out',
//                     landing_page: 'BILLING',
//                     user_action: 'PAY_NOW',
//                     return_url: 'http://localhost:3000/api/payment/capture-payment', // Temporary placeholder
//                     cancel_url: 'http://localhost:3000/api/payment/cancel'
//                 }
//             });

//             const order = await client().execute(request);
//             const orderId = order.result.id;

//             // Update the return_url to include the orderId and paymentId
//             const updatedReturnUrl = `http://localhost:3000/api/payment/capture-payment?orderId=${orderId}&paymentId=${paymentId}`;

//             // Since request.requestBody() does not allow direct modification after setting, we can send updated return_url in the response.
//             const approveLink = order.result.links.find(link => link.rel === "approve").href;

//             res.status(200).json({
//                 message: "Payment created. Please approve the payment.",
//                 approveUrl: approveLink,
//                 orderId,
//                 paymentId,
//                 captureUrlWithParams: updatedReturnUrl, // URL for Postman capture
//             });
//         } catch (error) {
//             console.error("Error creating payment:", error);
//             res.status(500).json({ message: "Error creating payment" });
//         }
//     });
// };



exports.createPayment = async (req, res) => {
    const { paymentId } = req.body;

    const paymentQuery = 'SELECT amount FROM payment WHERE payment_id = ? AND status = "pending" AND method = "paypal"';
    con.query(paymentQuery, [paymentId], async (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const amount = results[0].amount;

        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount.toFixed(2),
                },
            }],
            application_context: {
                brand_name: 'Rent It Out',
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                // Set return_url directly with placeholders to be filled later
                return_url: `http://localhost:3000/api/payment/capture-payment`, // Base return URL
                cancel_url: 'http://localhost:3000/api/payment/cancel'
            }
        });

        try {
            const order = await client().execute(request);
            const orderId = order.result.id; // Get the order ID from the response

            // Construct the full URL with orderId and paymentId
            const fullReturnUrl = `http://localhost:3000/api/payment/capture-payment?orderId=${orderId}&paymentId=${paymentId}`;

            // Instead of patching, inform the user to manually include the parameters in the return_url logic
            const approveLink = order.result.links.find(link => link.rel === "approve").href;

            res.status(200).json({
                message: "Payment created. Please approve the payment.",
                approveUrl: approveLink,
                orderId,
                paymentId,
                fullReturnUrl // Include this for debugging purposes if needed
            });
        } catch (error) {
            console.error("Error creating payment:", error);
            res.status(500).json({ message: "Error creating payment" });
        }
    });
};



// exports.createPayment = async (req, res) => {
//     const { paymentId } = req.body;

//     const paymentQuery ='SELECT * FROM payment WHERE status = "pending" AND method = "paypal"';

//     con.query(paymentQuery, [paymentId], async (error, results) => {
//         if (error) {
//             console.error("Database error:", error);
//             return res.status(500).json({ message: "Database error" });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         const amount = results[0].amount;

//         // Create the order request
//         const request = new paypal.orders.OrdersCreateRequest();

//         // Setting the request body first
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 amount: {
//                     currency_code: 'USD',
//                     value: amount.toFixed(2),
//                 },
//             }],
//             application_context: {
//                 brand_name: 'Rent It Out',
//                 landing_page: 'BILLING',
//                 user_action: 'PAY_NOW',
//                 return_url: 'http://localhost:3000/api/payment/capture-payment?paymentId=${paymentId}', 
//                 cancel_url: 'http://localhost:3000/api/payment/cancel'
//             }
//         });

//         try {
//             // Now execute the request to create the order
//             const order = await client().execute(request);
//             const orderId = order.result.id;

//             // Update the return_url with orderId now that we have it
//             const updatedReturnUrl = 'http://localhost:3000/api/payment/capture-payment?orderId=${orderId}&paymentId=${paymentId}';

//             // Find the "approve" link to respond to the client
//             const approveLink = order.result.links.find(link => link.rel === "approve").href;

//             // Respond with the approve link and the correct return_url
//             res.status(200).json({
//                 message: "Payment created. Please approve the payment.",
//                 approveUrl: approveLink,
//                 orderId,
//                 paymentId,
//                 returnUrl: updatedReturnUrl // Include the updated return URL in the response
//             });
//         } catch (error) {
//             console.error("Error creating payment:", error);
//             res.status(500).json({ message: "Error creating payment" });
//         }
//     });
// };

exports.capturePayment = async (req, res) => {
    const orderId = req.query.orderId || req.body.orderId;
    const paymentId = req.query.paymentId || req.body.paymentId;

    if (!orderId || !paymentId) {
        return res.status(400).json({ message: "Payment ID is not found" });
    }

    const adminQuery = 'SELECT userID FROM users WHERE role = "Admin" LIMIT 1';
    try {
        // Fetch Admin user ID
        const adminResults = await queryDatabase(adminQuery);
        if (adminResults.length === 0) {
            return res.status(404).json({ message: 'Admin user not found' });
        }
        const adminId = adminResults[0].userID;

        // Check if payment already exists and its status
        const paymentQuery = 'SELECT amount, owner_id, status FROM payment WHERE payment_id = ?';
        const rows = await queryDatabase(paymentQuery, [paymentId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const { amount, owner_id, status } = rows[0];

        if (status === 'completed') {
            return res.status(400).json({ message: "Payment already captured" });
        }

        // Retrieve the order details to confirm its current status
        const orderRequest = new paypal.orders.OrdersGetRequest(orderId);
        const orderDetails = await client().execute(orderRequest);

        if (orderDetails.result.status === 'COMPLETED') {
            return res.status(400).json({ message: "Order already captured" });
        }

        // Proceed with the payment capture
        const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
        captureRequest.requestBody({});

        const capture = await client().execute(captureRequest);

        if (capture.result.status === 'COMPLETED') {
            const platformFee = (amount * 0.05).toFixed(2);
            const ownerPayment = (amount * 0.95).toFixed(2);

            await queryDatabase('START TRANSACTION');

            const platformTransactionQuery = 'INSERT INTO transactions (payment_id, user_id, amount, type, created_at) VALUES (?, ?, ?, ?, NOW())';
            await queryDatabase(platformTransactionQuery, [paymentId, adminId, platformFee, 'platform_fee']);

            const ownerTransactionQuery = 'INSERT INTO transactions (payment_id, user_id, amount, type, created_at) VALUES (?, ?, ?, ?, NOW())';
            await queryDatabase(ownerTransactionQuery, [paymentId, owner_id, ownerPayment, 'owner_payment']);

            const updatePaymentStatusQuery = 'UPDATE payment SET status = ? WHERE payment_id = ?';
            await queryDatabase(updatePaymentStatusQuery, ['completed', paymentId]);

            await queryDatabase('COMMIT');

            res.json({ message: "Payment captured and updated successfully" });
        } else {
            res.status(400).json({ message: "Payment capture not completed" });
        }
    } catch (error) {
        await queryDatabase('ROLLBACK');
        console.error("Error capturing payment and updating records:", error);
        res.status(500).send("Error capturing payment and updating records");
    }
};

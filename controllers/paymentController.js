const con = require("../config/database"); // Ensure this path is correct

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

// Execute a payment and complete transactions
exports.executePayment = (req, res) => {
    const user_id = req.user.id;  
    const paymentId = req.body.paymentId; // Get paymentId from request body

    // Query to retrieve payment details
    const query = 'SELECT * FROM payment WHERE payment_id = ? AND renter_id = ? AND status = "pending"';
    
    con.query(query, [paymentId, user_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error retrieving payment', error });
        }

        // If payment is found
        if (results.length > 0) {
            const payment = results[0]; // Get the first payment
            const totalAmount = payment.amount;
            const ownerId = payment.owner_id;

            // Calculate the distribution amounts
            const platformFee = (totalAmount * 0.05).toFixed(2); // 5%
            const ownerAmount = (totalAmount * 0.95).toFixed(2); // 95%

            // Update payment status to completed
            const updatePaymentQuery = 'UPDATE payment SET status = "completed" WHERE payment_id = ?';
            con.query(updatePaymentQuery, [paymentId], (updateError) => {
                if (updateError) {
                    return res.status(500).json({ message: 'Error updating payment status', error: updateError });
                }

                // Insert records in the transactions table
                const transferQuery = `
                  INSERT INTO transactions (amount, type, user_id, payment_id) VALUES
                  (?, 'platform_fee', (SELECT userID FROM users WHERE userID = ?), ?),
                  (?, 'owner_payment', ?, ?)
                `;
                
                con.query(transferQuery, [platformFee, /* platform user ID */ 7, paymentId, ownerAmount, ownerId, paymentId], (transferError) => {
                    if (transferError) {
                        return res.status(500).json({ message: 'Error recording transfers', error: transferError });
                    }
                    return res.status(200).json({ message: 'Payment completed successfully' });
                });
            });
        } else {
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


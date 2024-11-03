const pool = require('../config/database'); // Adjust the path to your database configuration

// Function to get notifications for the owner
exports.getNotifications = (req, res) => {
    const ownerId = req.user.id; // Get the owner ID from the token

    // SQL query to retrieve notifications for the owner
    const notificationsQuery = `
        SELECT  message, created_at 
        FROM notifications 
        WHERE owner_id = ? 
        ORDER BY created_at DESC;
    `;

    pool.query(notificationsQuery, [ownerId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while retrieving notifications.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ msg: 'No notifications found.' });
        }

        // Format the response
        const notifications = results.map(notification => ({
            id: notification.id,
            message: notification.message,
            created_at: notification.created_at
        }));

        res.status(200).json({
            msg: 'Notifications retrieved successfully.',
            notifications: notifications
        });
    });
};


const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "4ce1d225",
  apiSecret: "6cE6rpp1xXSuhjSJ"
})





// Respond to Damage Report
exports.respondToDamageReport = (req, res) => {
    const { serial_number, response_price } = req.body;
    const owner_id = req.user.id; // Retrieve owner_id from token

    const updateQuery = `
        UPDATE damage_reports
        SET response_price = ?
        WHERE serial_number = ? AND owner_id = ?;
    `;

    pool.query(updateQuery, [response_price, serial_number, owner_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while responding to the damage report.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No damage report found or you are not authorized to respond to this report.' });
        }

        // Query to get the renter's name, telephone number, and renter_id
        const renterQuery = `
            SELECT u.telephone, u.name AS renter_name, u.userId AS renter_id
            FROM damage_reports d
            JOIN users u ON d.renter_id = u.userId
            WHERE d.serial_number = ?;
        `;

        pool.query(renterQuery, [serial_number], (err, renterResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'An error occurred while retrieving renter information.' });
            }

            if (renterResults.length === 0) {
                return res.status(404).json({ error: 'Renter not found.' });
            }

            const renterPhone = renterResults[0].telephone;
            const renterName = renterResults[0].renter_name;
            const renterId = renterResults[0].renter_id;

            // Retrieve the rental ID from the rental table using rental_serial_number in damage_reports
            const rentalIdQuery = `
                SELECT r.id AS rental_id
                FROM rental r
                JOIN damage_reports d ON r.serial_number = d.rental_serial_number
                WHERE d.serial_number = ?;
            `;

            pool.query(rentalIdQuery, [serial_number], (err, rentalResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'An error occurred while retrieving rental ID.' });
                }

                if (rentalResults.length === 0) {
                    return res.status(404).json({ error: 'Rental ID not found for the provided serial number.' });
                }

                const rentalId = rentalResults[0].rental_id;

                // Send SMS notification to renter
                vonage.sms.send({ 
                    to: renterPhone, 
                    from: "Rent It Out API", 
                    text: `Hi ${renterName}, for the damage report ${serial_number} you submitted, you must pay a fine of ${response_price}.` 
                })
                .then(response => {
                    console.log('Message sent successfully.', response);

                    // Insert a record into the payment table
                    const paymentQuery = `
                        INSERT INTO payment (amount, status, method, renter_id, owner_id, payment_type, rental_id)
                        VALUES (?, 'pending', 'paypal', ?, ?, 'fine', ?);
                    `;

                    pool.query(paymentQuery, [response_price, renterId, owner_id, rentalId], (err, paymentResult) => {
                        if (err) {
                            console.error('Failed to insert payment record.', err);
                            return res.status(500).json({ error: 'An error occurred while processing the payment record.' });
                        }

                        res.status(200).json({ 
                            message: 'Response submitted successfully, SMS sent to renter, and payment record created.' 
                        });
                    });
                })
                .catch(err => {
                    console.error('Failed to send SMS notification.', err);
                    res.status(500).json({ error: 'Failed to send SMS notification.' });
                });
            });
        });
    });
};

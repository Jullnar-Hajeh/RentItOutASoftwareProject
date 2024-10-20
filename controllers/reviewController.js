const db = require("../config/database");

exports.addReview = async (req, res) => {
    const { serial_number, description, rate } = req.body;
    const renter_id = req.user.id;

    try {
        console.log("Request body:", req.body); // Log incoming request data

        // Get the item ID based on the serial number
        const itemQuery = `SELECT id FROM item WHERE serial_number = ?`;
        
        // Await the query and destructure to get results
        db.query(itemQuery, [serial_number], (error, itemResult) => {
            if (error) {
                console.error("Database query error:", error);
                return res.status(500).json({ message: "Database query error." });
            }

            console.log("Item result:", itemResult); // Log item query result

            // Check if the item exists
            if (itemResult.length === 0) {
                return res.status(404).json({ message: "Item not found" });
            }

            const item = itemResult[0]; // Get the first item found

            // Check if the user has rented this item
            const rentalQuery = `SELECT * FROM rental WHERE item_id = ? AND renter_id = ?`;
            db.query(rentalQuery, [item.id, renter_id], (rentalError, rentalResult) => {
                if (rentalError) {
                    console.error("Rental query error:", rentalError);
                    return res.status(500).json({ message: "Database query error." });
                }

                console.log("Rental result:", rentalResult); // Log rental query result

                if (rentalResult.length === 0) {
                    return res.status(403).json({ message: "You cannot review an item you haven't rented." });
                }

                // Insert the review into the reviews table
                const reviewQuery = `INSERT INTO reviews (item_id, renter_id, description, rate) VALUES (?, ?, ?, ?)`;
                db.query(reviewQuery, [item.id, renter_id, description, rate], (insertError) => {
                    if (insertError) {
                        console.error("Insert review error:", insertError);
                        return res.status(500).json({ message: "Failed to add review." });
                    }

                    return res.status(201).json({ message: "Review added successfully!" });
                });
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error); // Log unexpected errors
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
};


exports.getReviewsBySerialNumber = (req, res) => {
    const { serial_number } = req.params;

    const query = `
        SELECT r.description, r.rate, i.name 
        FROM reviews r 
        JOIN item i ON r.item_id = i.id 
        WHERE i.serial_number = ?
    `;

    db.query(query, [serial_number], (error, results) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: "Database query error." });
        }

        // Check if any reviews exist
        if (results.length === 0) {
            return res.status(404).json({ message: "No reviews found for this item." });
        }

        // Send back the reviews with only name, description, and rate
        return res.status(200).json({ reviews: results });
    });
};



// router.get('/:serialNumber/availability', (req, res) => {
//     const { serialNumber } = req.params;

//     // Step 1: Get item_id from the item table based on serial number
//     const itemQuery = 'SELECT id FROM item WHERE serial_number = ?';
//     db.query(itemQuery, [serialNumber], (error, itemResults) => {
//         if (error) {
//             console.error("Error fetching item:", error);
//             return res.status(500).json({ message: "Error fetching item." });
//         }
        
//         if (itemResults.length === 0) {
//             return res.status(404).json({ message: "Item not found." });
//         }

//         const itemId = itemResults[0].id;

//         // Step 2: Fetch rental data for the item
//         const rentalQuery = `
//             SELECT start_date, end_date, status 
//             FROM rental 
//             WHERE item_id = ? AND (status = 'rented' OR status = 'active') 
//             ORDER BY start_date`;
        
//         db.query(rentalQuery, [itemId], (error, rentalResults) => {
//             if (error) {
//                 console.error("Error fetching rentals:", error);
//                 return res.status(500).json({ message: "Error fetching rentals." });
//             }

//             // Step 3: Format data for calendar
//             const events = rentalResults.map(rental => ({
//                 start: rental.start_date,
//                 end: rental.end_date,
//                 status: rental.status
//             }));

//             return res.status(200).json({ events });
//         });
//     });
// });
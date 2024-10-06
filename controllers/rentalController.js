const db = require("../config/database");
const asyncHandler = require("express-async-handler");

/**
 *  @desc    create a new rental
 *  @route   api/rental
 *  @method  POST
 *  @access  public
 */
exports.createRental = async (req, res) => {
    const { item_id, renter_id, rental_enddate } = req.body;

    try {
        // Check if item is available
        const item = await db.query(`
            SELECT * FROM Item 
            WHERE id = ?
              AND status = 'available' 
              AND (availible_from IS NULL OR availible_from <= CURDATE()) 
              AND (availible_until IS NULL OR availible_until >= ?);`, [item_id, rental_enddate]);
        if (!item.length) {  // Use .length to check if item exists
            return res.status(400).json({ message: 'Item is currently not available' });
        }

        // Automatically set the start date to today's date
        const start_date = new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD

        // Calculate the cost based on duration (e.g., per day, week, etc.)
        const days = Math.ceil((new Date(rental_enddate) - new Date(start_date)) / (1000 * 60 * 60 * 24));
        const cost = item[0].price_per_day * days; // Example: price per day times the number of days

        // Create the rental and set status to "on hold"
        const rental = await db.query(
            `INSERT INTO Rental (item_id, renter_id, start_date, end_date, status) 
            VALUES (?, ?, ?, ?, 'onhold')`,
            [item_id, renter_id, start_date, rental_enddate]
        );

        // Generate payment with status 'unpaid'
        // await db.query(
        //     `INSERT INTO Payment (rental_id, amount, status) 
        //     VALUES (?, ?, 'unpaid')`,
        //     [rental.insertId, cost]
        // );

        // Mark the item as unavailable
        await db.query(`UPDATE Item SET status = 'unavailable' WHERE id = ?`, [item_id]);
        return res.status(201).json({ message: 'Rental created and payment generated. \n You have an hour to cancel your rental if you desire', rentalId: rental.insertId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error. Could not create rental' });
    }
};


/**
 *  @desc    extend rental duration
 *  @route   api/rental/:id
 *  @method  PUT
 *  @access  public
 */
// Only item owner should be allowed to extend duration
exports.extendRentalDuration = asyncHandler(async (req, res) => {
    const { new_end_date } = req.body;  // Only takes the new end date from the request body
    const rental_id = req.params.id;  // The rental ID will be passed as a parameter
    try {
        // Check if the rental exists
        const rental = await db.query(`SELECT * FROM Rental WHERE id = ?`, [rental_id]);
        if (!rental.length) {
            return res.status(404).json({ message: "Rental not found" });
        }

        // Calculate the new duration
        const current_end_date = new Date(rental[0].end_date);
        const newEndDate = new Date(new_end_date);

        // Ensure the new end date is after the current end date
        if (newEndDate <= current_end_date) {
            return res.status(400).json({ message: "New end date must be later than the current end date" });
        }

        // Calculate the additional days for the extension
        const additionalDays = Math.ceil((newEndDate - current_end_date) / (1000 * 60 * 60 * 24)); // Time difference in days

        // Calculate the additional cost based on price per day
        const item = await db.query(`SELECT price_per_day FROM Item WHERE id = ?`, [rental[0].item_id]);
        const additionalCost = item[0].price_per_day * additionalDays;

        // Update the rental's end date
        await db.query(`UPDATE Rental SET end_date = ? WHERE id = ?`, [new_end_date, rental_id]);

        // // Optionally: Generate a new payment record for the extended duration
        // await db.query(
        //     `INSERT INTO Payment (rental_id, amount, status) 
        //     VALUES (?, ?, 'unpaid')`,
        //     [rental_id, additionalCost]
        // );

        return res.status(200).json({ message: "Rental duration extended", new_end_date, additionalCost });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error. Could not extend rental duration" });
    }
});


/**
 *  @desc    get all rentals for owner
 *  @route   api/rental/owner/:id
 *  @method  GET
 *  @access  public
 */
// Get all rentals for items owned by a user
exports.getAllRentalsForOwner = async (req, res) => {
    const ownerId = req.params.id; // Get the owner's ID from the URL

    try {
        // Query to get rentals for items owned by the user
        const rentals = await db.query(`
            SELECT r.*, i.name, i.price_per_day
            FROM Rental r
            JOIN Item i ON r.item_id = i.id
            WHERE i.user_id = ?
            ORDER BY CASE WHEN r.status = 'active' THEN 1 ELSE 2 END, r.start_date DESC;
        `, [ownerId]);

        return res.status(200).json(rentals);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Could not retrieve rentals' });
    }
};

/**
 *  @desc    get all rentals for renter
 *  @route   api/rental/renter/:id
 *  @method  GET
 *  @access  public
 */
// Get all rentals for items a user is renting
exports.getAllRentalsForRenter = async (req, res) => {
    const renterId = req.params.id; // Get the renter's ID from the URL

    try {
        // Query to get rentals for items the user is renting
        const rentals = await db.query(`
            SELECT r.*, i.name, i.price_per_day
            FROM Rental r
            JOIN Item i ON r.item_id = i.id
            WHERE r.renter_id = ?
            ORDER BY r.end_date ASC;
        `, [renterId]);

        return res.status(200).json(rentals);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Could not retrieve rentals' });
    }
};

/**
 *  @desc    get rental by id
 *  @route   api/rental/:id
 *  @method  GET
 *  @access  public
 */
// Get info on a specific rental by ID
exports.getRentalById = async (req, res) => {
    const rentalId = req.params.id; // Get the rental ID from the URL
    //const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., authMiddleware)

    try {
        // Query to get the rental info
        const rental = await db.query(`
            SELECT r.*, i.name AS item_name, i.price_per_day
            FROM Rental r
            JOIN Item i ON r.item_id = i.id
            WHERE r.id = ? 
        `, [rentalId]);

        if (rental.length === 0) {
            return res.status(404).json({ message: 'Rental not found or access denied' });
        }

        return res.status(200).json(rental[0]); // Return the rental info
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Could not retrieve rental info' });
    }
};


/**
 *  @desc    cancel rental by id
 *  @route   api/rental/:id
 *  @method  DELETE
 *  @access  public
 */
// Cancel a rental
exports.cancelRental = async (req, res) => {
    const rentalId = req.params.id; // Get the rental ID from the URL
    //const userId = req.user.id; // Assuming you have the user ID from middleware
    const currentTime = new Date();

    try {
        // Get the rental details to check the creation time and owner
        const rental = await db.query(`
            SELECT * FROM Rental
            WHERE id = ?
        `, [rentalId]); //AND (renter_id = ? OR item_id IN (SELECT id FROM Item WHERE user_id = ?))

        if (rental.length === 0) {
            return res.status(404).json({ message: 'Rental not found or access denied' });
        }

        const rentalCreatedAt = rental[0].created_at; // Assuming created_at is a field in your Rental table
        const oneHourLater = new Date(rentalCreatedAt);
        oneHourLater.setHours(oneHourLater.getHours() + 1);

        // Check if the rental can be canceled (within the first hour)
        if (currentTime > oneHourLater) {
            return res.status(403).json({ message: 'You can only cancel the rental within the first hour of creation' });
        }

        // Proceed to cancel the rental
        await db.query(`
            DELETE FROM Rental WHERE id = ?
        `, [rentalId]);

        return res.status(200).json({ message: 'Rental canceled successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Could not cancel the rental' });
    }
};


// Confirm a rental
exports.confirmRental = async (req, res) => {
    const rentalId = req.params.id; // Get the rental ID from the URL
    //const userId = req.user.id; // Assuming you have the user ID from middleware
    const currentTime = new Date();

    try {
        // Get the rental details to check the creation time and owner
        const rental = await db.query(`
            SELECT * FROM Rental
            WHERE id = ?
        `, [rentalId]);

        if (rental.length === 0) {
            return res.status(404).json({ message: 'Rental not found or access denied' });
        }

        const rentalCreatedAt = rental[0].created_at; // Assuming created_at is a field in your Rental table
        const oneHourLater = new Date(rentalCreatedAt);
        oneHourLater.setHours(oneHourLater.getHours() + 1);

        // Check if the rental can be confirmed (within the first hour)
        if (currentTime > oneHourLater) {
            // Automatically set the rental status to 'active'
            await db.query(`
                UPDATE Rental SET status = 'active' WHERE id = ?
            `, [rentalId]);
            return res.status(200).json({ message: 'Rental confirmed automatically as active' });
        }

        // Confirm the rental
        await db.query(`
            UPDATE Rental SET status = 'confirmed' WHERE id = ?
        `, [rentalId]);

        return res.status(200).json({ message: 'Rental confirmed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Could not confirm the rental' });
    }
};


// Return an item
exports.returnItem = async (req, res) => {
    const rentalId = req.params.id; // Get the rental ID from the URL
    //const userId = req.user.id; // Assuming you have the user ID from middleware

    try {
        // Get the rental details to check the renter
        const rental = await db.query(`
            SELECT * FROM Rental
            WHERE id = ?
        `, [rentalId]);

        if (rental.length === 0) {
            return res.status(404).json({ message: 'Rental not found or access denied' });
        }

        // Get current date
        const currentDate = new Date();

        // Update the rental status to 'completed' and set the end date to the current date
        await db.query(`
            UPDATE Rental 
            SET status = 'completed', end_date = ? 
            WHERE id = ?
        `, [currentDate, rentalId]);

        // Make the item available again
        await db.query(`
            UPDATE Item 
            SET status = 'available' 
            WHERE id = ?
        `, [rental[0].item_id]);

        return res.status(200).json({ message: 'Item returned successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Could not return the item' });
    }
};


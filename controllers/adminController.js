const con = require('../config/database');

// Get all users
exports.getAllUsers = (req, res) => {
    const requestingUserId = req.user.id; 

    const sql = 'SELECT name, email, telephone, address, role, loyalty_card, loyalty_card_expiry FROM users WHERE userID != ?'; 
    con.query(sql, [requestingUserId], (err, results) => {
        if (err) return res.status(500).json({ msg: "Error retrieving users", err });

        res.status(200).json({
            msg: "Users retrieved successfully",
            users: results 
        });
    });
};

// Search for a user by name
exports.searchUserByName = (req, res) => {
    const userName = req.params.name; 

    if (!userName) {
        return res.status(400).json({ msg: "Please provide a name to search" });
    }

    const sql = 'SELECT * FROM users WHERE name LIKE ?';
    con.query(sql, [`%${userName}%`], (err, results) => {
        if (err) return res.status(500).json({ msg: "Error searching for users", err });

        if (results.length === 0) {
            return res.status(404).json({ msg: "No users found with that name" });
        }

        res.status(200).json({
            msg: "Users retrieved successfully",
            users: results
        });
    });
};


//delete user
exports.deleteUser = (req, res) => {
    const userId = req.params.id; 

    // First, delete from favorites table
    con.query("DELETE FROM favorites WHERE item_id IN (SELECT id FROM item WHERE user_id = ?)", [userId], (err) => {
        if (err) {
            return res.status(500).json({ msg: "Error deleting associated favorites", err });
        }

        // Delete rentals associated with the user
        con.query("DELETE FROM rental WHERE owner_id = ?", [userId], (err) => {
            if (err) {
                return res.status(500).json({ msg: "Error deleting associated rentals", err });
            }

            // Delete rental requests
            con.query("DELETE FROM rental_request WHERE renter_id = ? OR owner_id = ?", [userId, userId], (err) => {
                if (err) {
                    return res.status(500).json({ msg: "Error deleting associated rental requests", err });
                }

                // Delete items associated with the user
                con.query("DELETE FROM item WHERE user_id = ?", [userId], (err) => {
                    if (err) {
                        return res.status(500).json({ msg: "Error deleting associated items", err });
                    }

                    // Finally, delete the user
                    con.query("DELETE FROM users WHERE userID = ?", [userId], (err) => {
                        if (err) {
                            return res.status(500).json({ msg: "Error deleting user", err });
                        }

                        res.status(200).json({ msg: "User deleted successfully" });
                    });
                });
            });
        });
    });
};

// Get all items
exports.getAllItems = (req, res) => {
    const sql = 'SELECT * FROM item'; // SQL query to retrieve all items

    con.query(sql, (err, results) => {
        if (err) return res.status(500).json({ msg: "Error retrieving items", err });

        res.status(200).json({
            msg: "Items retrieved successfully",
            items: results // Send the retrieved items in the response
        });
    });
};

// Delete an item
exports.deleteItem = (req, res) => {
    const itemId = req.params.id;
    const sql = 'DELETE FROM item WHERE id = ?'; 
    const checkSql = 'SELECT * FROM item WHERE id = ?';
    con.query(checkSql, [itemId], (err, results) => {
        if (err) return res.status(500).json({ msg: "Error checking item existence", err });

        if (results.length === 0) {
            return res.status(404).json({ msg: "Item not found" }); // Item does not exist
        }
        con.query(sql, [itemId], (err, result) => {
            if (err) {
                if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                    return res.status(400).json({ msg: "Cannot delete item. It is referenced by another record." });
                }
                return res.status(500).json({ msg: "Error deleting item", err });
            }

            res.status(200).json({
                msg: "Item deleted successfully"
            });
        });
    });
};

// Admin Dashboard
exports.dashboard = (req, res) => {
    const usersQuery = 'SELECT COUNT(*) AS totalUsers FROM users WHERE role = ?';
    const itemsQuery = 'SELECT COUNT(*) AS totalItems FROM item';
    const platformRevenueQuery = `
        SELECT SUM(amount) AS total_revenue
        FROM transactions
        WHERE type = 'platform_fee'
    `;
    const activeRentalsQuery = `
        SELECT COUNT(*) AS totalActiveRentals
        FROM rental
        WHERE start_date <= NOW() AND end_date >= NOW()
    `;

    // Get total users
    con.query(usersQuery, ['User'], (err, usersResult) => {
        if (err) return res.status(500).json({ msg: "Error retrieving user count", err });

        // Get total items
        con.query(itemsQuery, (err, itemsResult) => {
            if (err) return res.status(500).json({ msg: "Error retrieving item count", err });

            // Get platform revenue
            con.query(platformRevenueQuery, (revenueError, revenueResults) => {
                if (revenueError) {
                    return res.status(500).json({ message: 'Error retrieving platform revenue', error: revenueError });
                }

                const totalRevenue = revenueResults[0].total_revenue || 0; // Default to 0 if no revenue found

                // Get active rentals
                con.query(activeRentalsQuery, (rentalError, rentalResults) => {
                    if (rentalError) {
                        return res.status(500).json({ message: 'Error retrieving active rentals', error: rentalError });
                    }

                    const totalActiveRentals = rentalResults[0].totalActiveRentals || 0; // Default to 0 if no rentals found

                    // Send all data in response
                    res.status(200).json({
                        msg: "Dashboard data retrieved successfully",
                        totalUsers: usersResult[0].totalUsers,
                        totalItems: itemsResult[0].totalItems,
                        totalRevenue: totalRevenue, // Include platform revenue
                        totalActiveRentals: totalActiveRentals // Include active rentals count
                    });
                });
            });
        });
    });
};

const con = require("../config/database"); // Database connection

// Add item to favorites by item name
exports.addFavorite = (req, res) => {
    const userId = req.user.id; // Get the user ID from the request
    const itemSerialNumber = req.body.item_serial_number; // Get the item serial number from the request body

    // Check if item_serial_number is provided
    if (!itemSerialNumber) {
        return res.status(400).json({ msg: "Item serial number is required" });
    }

    // Query to find the item ID based on the item serial number
    const findItemSql = `SELECT id FROM item WHERE serial_number = ? LIMIT 1`;

    con.query(findItemSql, [itemSerialNumber], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: "Error retrieving item", err });
        }

        // Check if the item exists
        if (results.length === 0) {
            return res.status(404).json({ msg: `Item with serial number "${itemSerialNumber}" not found in the database.` });
        }

        const itemId = results[0].id; // Get the item ID from the results

        // Check if the item is already in favorites
        const checkFavoriteSql = `SELECT * FROM favorites WHERE user_id = ? AND item_id = ?`;
        
        con.query(checkFavoriteSql, [userId, itemId], (err, favoriteResults) => {
            if (err) {
                return res.status(500).json({ msg: "Error checking favorites", err });
            }

            // If the item is already in favorites, do not add it again
            if (favoriteResults.length > 0) {
                return res.status(409).json({ msg: "Item already in favorites" });
            }

            // Now insert into the favorites table
            const insertFavoriteSql = `INSERT INTO favorites (user_id, item_id) VALUES (?, ?)`;

            con.query(insertFavoriteSql, [userId, itemId], (err, result) => {
                if (err) {
                    return res.status(500).json({ msg: "Error adding to favorites", err });
                }

                res.status(201).json({ msg: "Item added to favorites"});
            });
        });
    });
};


exports.removeFavorite = (req, res) => {
    const userId = req.user.id; // Get the user ID from the request
    const itemSerialNumber = req.params.serial_number; // Get the item serial number from the request parameters

    // Check if item_serial_number is provided
    if (!itemSerialNumber) {
        return res.status(400).json({ msg: "Item serial number is required" });
    }

    // Query to find the item ID based on the item serial number
    const findItemSql = `SELECT id FROM item WHERE serial_number = ? LIMIT 1`;

    con.query(findItemSql, [itemSerialNumber], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: "Error retrieving item", err });
        }

        // Check if the item exists
        if (results.length === 0) {
            return res.status(404).json({ msg: `Item with serial number "${itemSerialNumber}" not found in the database.` });
        }

        const itemId = results[0].id; // Get the item ID from the results

        // Now remove from the favorites table
        const sql = `DELETE FROM favorites WHERE user_id = ? AND item_id = ?`;

        con.query(sql, [userId, itemId], (err, result) => {
            if (err) {
                return res.status(500).json({ msg: "Error removing from favorites", err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: "Favorite not found" });
            }

            res.status(200).json({ msg: "Item removed from favorites" });
        });
    });
};


// Get all favorites for the authenticated user
exports.getFavorites = (req, res) => {
    const userId = req.user.id; // Get the user ID from the request

    const sql = `
        SELECT item.id, item.name, item.description, item.category, 
               item.price_per_day, item.price_per_week, 
               item.price_per_month, item.price_per_year
        FROM favorites 
        JOIN item ON favorites.item_id = item.id 
        WHERE favorites.user_id = ?`;

    con.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ msg: "Error retrieving favorites", err });

        res.status(200).json({ 
            msg: "Favorites retrieved successfully", 
            favorites: results 
        });
    });
};

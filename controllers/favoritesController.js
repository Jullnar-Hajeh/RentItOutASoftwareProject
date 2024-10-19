const con = require("../config/database"); // Database connection

// Add item to favorites by item name
exports.addFavorite = (req, res) => {
    const userId = req.user.id; // Get the user ID from the request
    const itemName = req.body.item_name; // Get the item name from the request body

    // Check if item_name is provided
    if (!itemName) {
        return res.status(400).json({ msg: "Item name is required" });
    }

    // Query to find the item ID based on the item name
    const findItemSql = `SELECT id FROM item WHERE name = ? LIMIT 1`;

    con.query(findItemSql, [itemName], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: "Error retrieving item", err });
        }

        // Check if the item exists
        if (results.length === 0) {
            return res.status(404).json({ msg: `Item with name "${itemName}" not found in the database.` });
        }

        const itemId = results[0].id; // Get the item ID from the results

        // Now insert into the favorites table
        const insertFavoriteSql = `INSERT INTO favorites (user_id, item_id) VALUES (?, ?)`;

        con.query(insertFavoriteSql, [userId, itemId], (err, result) => {
            if (err) {
                // Check if the item already exists in favorites
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ msg: "Item already in favorites" });
                }
                return res.status(500).json({ msg: "Error adding to favorites", err });
            }

            res.status(201).json({ msg: "Item added to favorites", favoriteId: result.insertId });
        });
    });
};

// Remove item from favorites
exports.removeFavorite = (req, res) => {
    const userId = req.user.id; // Get the user ID from the request
    const itemId = req.params.id; // Get the item ID from the request parameters

    const sql = `DELETE FROM favorites WHERE user_id = ? AND item_id = ?`;

    con.query(sql, [userId, itemId], (err, result) => {
        if (err) return res.status(500).json({ msg: "Error removing from favorites", err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Favorite not found" });
        }

        res.status(200).json({ msg: "Item removed from favorites" });
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

const con = require("../config/database"); // Database connection

// Add a new item
exports.addItem = (req, res) => {
  const { name, description, category, price_per_day, price_per_week, price_per_month, price_per_year, available_from, available_until } = req.body;

  if (!name || !description || !category || !price_per_day) {
    return res.status(400).json({ msg: "Please fill in all required fields" });
  }

  const sql = `INSERT INTO item (user_id, name, description, category, price_per_day, price_per_week, price_per_month, price_per_year, available_from, available_until)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  con.query(sql, [
    req.user.id, 
    name, 
    description, 
    category, 
    price_per_day,
    price_per_week, 
    price_per_month, 
    price_per_year, 
    available_from, 
    available_until
  ], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error adding item", err });

    res.status(201).json({ msg: "Item added successfully", itemId: result.insertId });
  });
};

// Edit an item
exports.editItem = (req, res) => {
  const { name, description, category, price_per_day, price_per_week, price_per_month, price_per_year, available_from, available_until } = req.body;
  const itemId = req.params.id;

  const sql = `UPDATE item 
               SET name = ?, description = ?, category = ?, price_per_day = ?, price_per_week = ?, price_per_month = ?, price_per_year = ?, available_from = ?, available_until = ?
               WHERE id = ? AND user_id = ?`;

  con.query(sql, [
    name, 
    description, 
    category, 
    price_per_day, 
    price_per_week, 
    price_per_month, 
    price_per_year, 
    available_from, 
    available_until, 
    itemId, 
    req.user.id
  ], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error updating item", err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Item not found or you don't have permission to edit it" });
    }

    res.status(200).json({ msg: "Item updated successfully" });
  });
};

// Delete an item
exports.deleteItem = (req, res) => {
  const itemId = req.params.id;

  const sql = `DELETE FROM item WHERE id = ? AND user_id = ?`;

  con.query(sql, [itemId, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error deleting item", err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Item not found or you don't have permission to delete it" });
    }

    res.status(200).json({ msg: "Item deleted successfully" });
  });
};

exports.getAllItems = (req, res) => {
  const sql = `SELECT * FROM item`; // SQL query to retrieve all items

  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error retrieving items", err });

    res.status(200).json({
      msg: "Items retrieved successfully",
      items: results // Send the retrieved items in the response
    });
  });
};




// // Search and filter items
// exports.searchItems = (req, res) => {
//     const { search, category, min_price, max_price, available } = req.query;

//     // Base SQL query
//     let sql = `SELECT * FROM item WHERE 1=1`; // 1=1 is a common SQL trick to simplify appending WHERE clauses
//     const params = [];

//     // Search by name or description
//     if (search) {
//         sql += ` AND (name LIKE ? OR description LIKE ?)`;
//         params.push(`%${search}%`, `%${search}%`);
//     }

//     // Filter by category
//     if (category) {
//         sql += ` AND category = ?`;
//         params.push(category);
//     }

//     // Filter by price range
//     if (min_price) {
//         sql += ` AND price_per_day >= ?`;
//         params.push(min_price);
//     }
//     if (max_price) {
//         sql += ` AND price_per_day <= ?`;
//         params.push(max_price);
//     }

//     // Filter by availability (if available is passed, we will assume we want to show available items)
//     if (available === 'true') {
//         sql += ` AND available_from <= NOW() AND available_until >= NOW()`;
//     }

//     con.query(sql, params, (err, results) => {
//         if (err) return res.status(500).json({ msg: "Error retrieving items", err });

//         res.status(200).json({
//             msg: "Items retrieved successfully",
//             items: results
//         });
//     });
// };

// Search and filter items
exports.searchItems = (req, res) => {
  const { search, category, min_price, max_price, available, price_type } = req.query;

  // Base SQL query
  let sql = `SELECT * FROM item WHERE 1=1`; // 1=1 is a common SQL trick to simplify appending WHERE clauses
  const params = [];

  // Search by name or description
  if (search) {
      sql += ` AND (name LIKE ? OR description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
  }

  // Filter by category
  if (category) {
      sql += ` AND category = ?`;
      params.push(category);
  }

  // Filter by price range based on price_type
  if (price_type) {
      const priceColumn = `price_per_${price_type.toLowerCase()}`; // e.g., 'price_per_day'
      
      // Validate the price type against allowed values
      if (['day', 'week', 'month', 'year'].includes(price_type.toLowerCase())) {
          if (min_price) {
              sql += ` AND ${priceColumn} >= ?`;
              params.push(min_price);
          }
          if (max_price) {
              sql += ` AND ${priceColumn} <= ?`;
              params.push(max_price);
          }
      } else {
          return res.status(400).json({ msg: "Invalid price type specified. Use 'day', 'week', 'month', or 'year'." });
      }
  }

  // Filter by availability (if available is passed, we will assume we want to show available items)
  if (available === 'true') {
      sql += ` AND available_from <= NOW() AND available_until >= NOW()`;
  }

  con.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ msg: "Error retrieving items", err });

      res.status(200).json({
          msg: "Items retrieved successfully",
          items: results
      });
  });
};


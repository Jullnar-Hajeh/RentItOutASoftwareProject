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

    res.status(201).json({ msg: "Item added successfully" });
  });
};
// Edit an item
exports.editItem = (req, res) => {
  const { name, description, category, price_per_day, price_per_week, price_per_month, price_per_year, available_from, available_until } = req.body;
  const itemSerialNumber = req.params.serialNumber; // Expecting serial number instead of id

  const sql = `UPDATE item 
               SET name = ?, description = ?, category = ?, price_per_day = ?, price_per_week = ?, price_per_month = ?, price_per_year = ?, available_from = ?, available_until = ?
               WHERE serial_number = ? AND user_id = ?`;

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
    itemSerialNumber,   // Use serial number here
    req.user.id
  ], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error updating item", err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Item not found or you don't have permission to edit it" });
    }

    res.status(200).json({ msg: "Item updated successfully" });
  });
};




// Edit a specific field of an item by serial number
exports.editItemField = (req, res) => {
  const { value } = req.body;  // The new value for the field
  const field = req.params.field;  // The field to update (e.g., 'name', 'description', etc.)
  const serialNumber = req.params.serialNumber;  // The serial number of the item

  // List of allowed fields that can be updated
  const allowedFields = ["name", "description", "category", "price_per_day", "price_per_week", "price_per_month", "price_per_year", "available_from", "available_until"];

  // Check if the field to update is allowed
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ msg: "Invalid field for update" });
  }

  // Construct the SQL query dynamically
  const sql = `UPDATE item 
               SET ${field} = ? 
               WHERE serial_number = ? AND user_id = ?`;

  con.query(sql, [value, serialNumber, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error updating item", err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Item not found or you don't have permission to edit it" });
    }

    res.status(200).json({ msg: `${field} updated successfully` });
  });
};



// Delete an item
exports.deleteItem = (req, res) => {
  const serialNumber = req.params.serialNumber; 

  const sql = `DELETE FROM item WHERE serial_number = ? AND user_id = ?`;

  con.query(sql, [serialNumber, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error deleting item", err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Item not found or you don't have permission to delete it" });
    }

    res.status(200).json({ msg: "Item deleted successfully" });
  });
};

// Retrieve all items with specific fields, user name, and average rating
exports.getAllItems = (req, res) => {
  const sql = `
    SELECT 
      i.serial_number, 
      i.name, 
      i.description, 
      i.category, 
      i.price_per_day, 
      i.price_per_week, 
      i.price_per_month, 
      i.price_per_year, 
      i.available_from, 
      i.available_until, 
      u.name AS user_name, 
      COALESCE(AVG(r.rate), 0) AS average_rating  -- Calculate the average rating (if no reviews, return 0)
    FROM 
      item i 
    LEFT JOIN users u ON i.user_id = u.userID -- Join to get the user's name
    LEFT JOIN reviews r ON i.id = r.item_id -- Join to calculate average rating from reviews
    GROUP BY 
      i.serial_number, 
      i.name, 
      i.description, 
      i.category, 
      i.price_per_day, 
      i.price_per_week, 
      i.price_per_month, 
      i.price_per_year, 
      i.available_from, 
      i.available_until, 
      u.name
  `;

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
// exports.searchItems = (req, res) => {
//   const { search, category, min_price, max_price, available, price_type } = req.query;

//   // Base SQL query
//   let sql = `SELECT * FROM item WHERE 1=1`; // 1=1 is a common SQL trick to simplify appending WHERE clauses
//   const params = [];

//   // Search by name or description
//   if (search) {
//       sql += ` AND (name LIKE ? OR description LIKE ?)`;
//       params.push(`%${search}%`, `%${search}%`);
//   }

//   // Filter by category
//   if (category) {
//       sql += ` AND category = ?`;
//       params.push(category);
//   }

//   // Filter by price range based on price_type
//   if (price_type) {
//       const priceColumn = `price_per_${price_type.toLowerCase()}`; // e.g., 'price_per_day'
      
//       // Validate the price type against allowed values
//       if (['day', 'week', 'month', 'year'].includes(price_type.toLowerCase())) {
//           if (min_price) {
//               sql += ` AND ${priceColumn} >= ?`;
//               params.push(min_price);
//           }
//           if (max_price) {
//               sql += ` AND ${priceColumn} <= ?`;
//               params.push(max_price);
//           }
//       } else {
//           return res.status(400).json({ msg: "Invalid price type specified. Use 'day', 'week', 'month', or 'year'." });
//       }
//   }

//   // Filter by availability (if available is passed, we will assume we want to show available items)
//   if (available === 'true') {
//       sql += ` AND available_from <= NOW() AND available_until >= NOW()`;
//   }

//   con.query(sql, params, (err, results) => {
//       if (err) return res.status(500).json({ msg: "Error retrieving items", err });

//       res.status(200).json({
//           msg: "Items retrieved successfully",
//           items: results
//       });
//   });
// };


exports.searchItems = (req, res) => {
  const { search, category, min_price, max_price, available, price_type } = req.query;

  // Base SQL query
  let sql = `
    SELECT i.serial_number, i.name, i.description, i.category,
           i.price_per_day, i.price_per_week, i.price_per_month,
           i.price_per_year, i.available_from, i.available_until,
           u.name AS user_name,
           AVG(r.rate) AS average_rating
    FROM item i
    LEFT JOIN users u ON i.user_id = u.userID
    LEFT JOIN reviews r ON i.id = r.item_id
    WHERE 1=1`; // 1=1 is a common SQL trick to simplify appending WHERE clauses
    
  const params = [];

  // Search by name or description
  if (search) {
    sql += ` AND (i.name LIKE ? OR i.description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  // Filter by category
  if (category) {
    sql += ` AND i.category = ?`;
    params.push(category);
  }

  // Filter by price range based on price_type
  if (price_type) {
    const priceColumn = `i.price_per_${price_type.toLowerCase()}`; // e.g., 'i.price_per_day'
    
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
    sql += ` AND i.available_from <= NOW() AND i.available_until >= NOW()`;
  }

  // Group by item ID to calculate average rating
  sql += ` GROUP BY i.id`; 

  con.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error retrieving items", err });

    res.status(200).json({
      msg: "Items retrieved successfully",
      items: results
    });
  });
};


exports.getItemAvailability = (req, res) => {
  const { serialNumber } = req.params;

  const query = `
      SELECT start_date, end_date, status
      FROM rental
      WHERE item_id = (SELECT id FROM item WHERE serial_number = ?)`;

  con.query(query, [serialNumber], (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'Database query failed' });
      }

      // Format the results for the calendar
      const events = results.map(rental => ({
          start: rental.start_date,
          end: rental.end_date,
          status: rental.status
      }));

      res.json({ events });
  });
};



// Retrieve all reviews for an item by serial number
exports.getItemReviews = (req, res) => {
  const serialNumber = req.params.serialNumber;

  // First, get the item ID using the serial number
  const getItemIdQuery = `SELECT id FROM item WHERE serial_number = ?`;

  con.query(getItemIdQuery, [serialNumber], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error retrieving item", err });
    if (result.length === 0) return res.status(404).json({ msg: "Item not found" });

    const itemId = result[0].id;

    // Now, retrieve all reviews for this item using the item ID
    const getReviewsQuery = `SELECT description, rate FROM reviews WHERE item_id = ?`;

    con.query(getReviewsQuery, [itemId], (err, reviews) => {
      if (err) return res.status(500).json({ msg: "Error retrieving reviews", err });

      if (reviews.length === 0) {
        return res.status(404).json({ msg: "No reviews found for this item" });
      }

      res.status(200).json({
        msg: "Reviews retrieved successfully",
        reviews: reviews
      });
    });
  });
};


// Retrieve all reviews with a specific rating (e.g., 0) for an item by serial number
exports.getItemReviewsByRating = (req, res) => {
  const serialNumber = req.params.serialNumber;
  const rating = parseInt(req.params.rating); // Get the rating from the URL (e.g., 0)

  // First, get the item ID using the serial number
  const getItemIdQuery = `SELECT id FROM item WHERE serial_number = ?`;

  con.query(getItemIdQuery, [serialNumber], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error retrieving item", err });
    if (result.length === 0) return res.status(404).json({ msg: "Item not found" });

    const itemId = result[0].id;

    // Now, retrieve all reviews with the specified rating for this item
    const getReviewsQuery = `SELECT description, rate FROM reviews WHERE item_id = ? AND rate = ?`;

    con.query(getReviewsQuery, [itemId, rating], (err, reviews) => {
      if (err) return res.status(500).json({ msg: "Error retrieving reviews", err });

      if (reviews.length === 0) {
        return res.status(404).json({ msg: `No reviews found with rating ${rating} for this item` });
      }

      res.status(200).json({
        msg: `Reviews with rating ${rating} retrieved successfully`,
        reviews: reviews
      });
    });
  });
};

const con = require("../config/database"); // Database connection

// Add a new pickup point
exports.addPickupPoint = (req, res) => {
  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ msg: "Please provide a location in 'Country City Village' format" });
  }

  const sql = `INSERT INTO pickup_points (user_id, location)
               VALUES (?, ?)`;

  con.query(sql, [req.user.id, location], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error adding pickup point", err });

    res.status(201).json({ msg: "Pickup point added successfully", pickupPointId: result.insertId });
  });
};

// Edit an existing pickup point
exports.editPickupPoint = (req, res) => {
  const { location } = req.body;
  const pickupPointId = req.params.id;

  if (!location) {
    return res.status(400).json({ msg: "Please provide a location in 'Country City Village' format" });
  }

  const sql = `UPDATE pickup_points 
               SET location = ?
               WHERE id = ? AND user_id = ?`;

  con.query(sql, [location, pickupPointId, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error updating pickup point", err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Pickup point not found or you don't have permission to edit it" });
    }

    res.status(200).json({ msg: "Pickup point updated successfully" });
  });
};

// Delete an existing pickup point
exports.deletePickupPoint = (req, res) => {
  const pickupPointId = req.params.id;

  const sql = `DELETE FROM pickup_points 
               WHERE id = ? AND user_id = ?`;

  con.query(sql, [pickupPointId, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error deleting pickup point", err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Pickup point not found or you don't have permission to delete it" });
    }

    res.status(200).json({ msg: "Pickup point deleted successfully" });
  });
};

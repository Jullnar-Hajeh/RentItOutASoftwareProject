const con = require("../config/database"); // Database connection
const { calculateDistance } = require('../controllers/rentalController'); // Import calculateDistance function

exports.getPickupPointsByOwner = (req, res) => {
  const { user_id } = req.params; 
  const signedInUserId = req.user.id; // Retrieve the signed-in user’s ID from the request

  if (!user_id) {
    return res.status(400).json({ msg: "Please provide a valid user ID." });
  }

  // Step 1: Retrieve the signed-in user’s location from the users table
  const getUserLocationQuery = `SELECT address FROM users WHERE userID = ?`;

  con.query(getUserLocationQuery, [signedInUserId], (err, userResults) => {
    if (err) {
      return res.status(500).json({ msg: "Error retrieving user location.", err });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ msg: "Signed-in user location not found." });
    }

    // Extract latitude and longitude from the location field
    const userLocation = userResults[0].address;
    console.log(userResults[0]);
    const [userLat, userLon] = userLocation.match(/-?\d+\.\d+/g).map(Number);

    // Step 2: Retrieve pickup points for the specified owner
    const getPickupPointsQuery = `
      SELECT location, serial_number 
      FROM pickup_points 
      WHERE user_id = ?`;

    con.query(getPickupPointsQuery, [user_id], (err, pickupResults) => {
      if (err) {
        return res.status(500).json({ msg: "Error fetching pickup points.", err });
      }
      if (pickupResults.length === 0) {
        return res.status(404).json({ msg: "No pickup points found for this owner." });
      }

      // Step 3: Calculate distance from signed-in user location to each pickup point location
      const pickupPointsWithDistance = pickupResults.map(pickup => {
        const [pickupLat, pickupLon] = pickup.location.split(' ').map(Number); 
        const distance = calculateDistance(userLat, userLon, pickupLat, pickupLon);
        return {
          serial_number: pickup.serial_number,
          location: pickup.location,
          distance: `${distance.toFixed(2)} km` // Display distance rounded to two decimal places
        };
      });

      // Step 4: Send response
      res.status(200).json({ pickupPoints: pickupPointsWithDistance });
    });
  });
};



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

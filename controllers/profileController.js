const con = require("../config/database");
const bcrypt = require("bcryptjs");


const pool = require("../config/database");
exports.deleteProfile = (req, res) => {
  const userId = req.user.id;

  pool.getConnection((err, con) => {
    if (err) {
      return res.status(500).json({ msg: "Error getting database connection", err });
    }

    con.beginTransaction((err) => {
      if (err) {
        con.release();
        return res.status(500).json({ msg: "Transaction initiation failed", err });
      }

      // Delete associated favorites
      con.query("DELETE FROM favorites WHERE item_id IN (SELECT id FROM item WHERE user_id = ?)", [userId], (err) => {
        if (err) {
          return con.rollback(() => {
            con.release();
            res.status(500).json({ msg: "Error deleting associated favorites", err });
          });
        }

        // Delete associated rental requests
        con.query("DELETE FROM rental_request WHERE renter_id = ? OR owner_id = ?", [userId, userId], (err) => {
          if (err) {
            return con.rollback(() => {
              con.release();
              res.status(500).json({ msg: "Error deleting associated rental requests", err });
            });
          }

          // Delete associated transactions
          con.query("DELETE FROM transactions WHERE payment_id IN (SELECT payment_id FROM payment WHERE renter_id = ?)", [userId], (err) => {
            if (err) {
              return con.rollback(() => {
                con.release();
                res.status(500).json({ msg: "Error deleting associated transactions", err });
              });
            }

            // Delete associated payments
            con.query("DELETE FROM payment WHERE renter_id = ?", [userId], (err) => {
              if (err) {
                return con.rollback(() => {
                  con.release();
                  res.status(500).json({ msg: "Error deleting associated payments", err });
                });
              }

              // Delete associated rentals
              con.query("DELETE FROM rental WHERE renter_id = ? OR owner_id = ?", [userId, userId], (err) => {
                if (err) {
                  return con.rollback(() => {
                    con.release();
                    res.status(500).json({ msg: "Error deleting associated rentals", err });
                  });
                }

                // Delete associated items
                con.query("DELETE FROM item WHERE user_id = ?", [userId], (err) => {
                  if (err) {
                    return con.rollback(() => {
                      con.release();
                      res.status(500).json({ msg: "Error deleting associated items", err });
                    });
                  }

                  // Finally, delete the user
                  con.query("DELETE FROM users WHERE userID = ?", [userId], (err) => {
                    if (err) {
                      return con.rollback(() => {
                        con.release();
                        res.status(500).json({ msg: "Error deleting user", err });
                      });
                    }

                    con.commit((err) => {
                      con.release();
                      if (err) {
                        return res.status(500).json({ msg: "Transaction commit failed", err });
                      }
                      res.status(200).json({ msg: "User deleted successfully" });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};


// Search user by name
exports.searchUserByName = (req, res) => {
  const userName = req.params.name;
  const sql = "SELECT name,email,telephone,address FROM users WHERE name LIKE ?";
  con.query(sql, [`%${userName}%`], (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error", err });

    if (result.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    res.status(200).json(result);
  });
};


// Update password
exports.updatePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  if (!password) {
    return res.status(400).json({ msg: "Password is required" });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "UPDATE users SET password = ? WHERE userID = ?";
    con.query(sql, [hashedPassword, userId], (err, result) => {
      if (err) return res.status(500).json({ msg: "Error updating password", err });

      res.status(200).json({ msg: "Password updated successfully" });
    });
  } catch (err) {
    console.error("Error updating password: ", err);
    res.status(500).json({ msg: "Error updating password", err });
  }
};




// update Email:

exports.updateEmail = (req, res) => {
  const { email } = req.body;
  const userId = req.user.id; 

  if (!email) {
    return res.status(400).json({ msg: "email is required" });
  }

  const sql = "UPDATE users SET email = ? WHERE userID = ?";
  con.query(sql, [email, userId], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error updating email", err });

    res.status(200).json({ msg: "email updated successfully" });
  });
};

// Update user telephone
exports.updateTelephone = (req, res) => {
  const { telephone } = req.body;
  const userId = req.user.id; 

  if (!telephone) {
    return res.status(400).json({ msg: "Telephone number is required" });
  }

  const sql = "UPDATE users SET telephone = ? WHERE userID = ?";
  con.query(sql, [telephone, userId], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error updating telephone", err });

    res.status(200).json({ msg: "Telephone number updated successfully" });
  });
};

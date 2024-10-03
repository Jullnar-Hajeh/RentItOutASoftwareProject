const con = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "2003"; // Use a secure key

// User Sign-up
exports.signup = (req, res) => {
  const { name, email, password, telephone, address } = req.body;

  if (!name || !email || !password || !telephone || !address) {
    return res.status(400).json({ msg: "Please fill in all fields" });
  }

  // Check if the user already exists
  con.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error", err });

    if (result.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ msg: "Error hashing password" });

      // Insert user into database
      const sql = "INSERT INTO users (name, email, password, telephone, address) VALUES (?, ?, ?, ?, ?)";
      con.query(sql, [name, email, hashedPassword, telephone, address], (err, result) => {
        if (err) return res.status(500).json({ msg: "Error inserting user" });

        res.status(201).json({ msg: "User registered successfully" });
      });
    });
  });
};

// User Sign-in
exports.signin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please fill in all fields" });
  }

  // Find user in database
  con.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error", err });

    if (result.length === 0) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const user = result[0];

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ msg: "Error comparing passwords" });

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }

      // Generate JWT
      const token = jwt.sign({ id: user.userID, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({
        msg: "Sign-in successful",
        token,
      });
    });
  });
};

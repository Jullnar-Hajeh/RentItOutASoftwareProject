const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// User Sign-up
router.post("/signup", authController.signup);

// User Sign-in
router.post("/signin", authController.signin);

module.exports = router;

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController"); // Corrected the variable name
const authenticateJWT = require("../middleware/authMiddleware"); // Adjust the path as necessary

// Protect the rental request route with authentication middleware
router.post("/AddReview", authenticateJWT, reviewController.addReview);
router.get('/reviews/:serial_number', reviewController.getReviewsBySerialNumber);

module.exports = router;
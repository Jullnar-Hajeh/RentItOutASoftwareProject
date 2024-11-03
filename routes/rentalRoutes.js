const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const authenticateJWT = require("../middleware/authMiddleware"); // Adjust the path as necessary

// Protect the rental request route with authentication middleware
router.post("/request", authenticateJWT, rentalController.requestRental);
router.get("/requestAsrenter", authenticateJWT, rentalController.getRentalRequests);

router.get("/requestAsOwner", authenticateJWT, rentalController.getRentalRequestsAsOwner);
// Add this new route for approving or declining rental requests
router.post("/approveDeclineRequest", authenticateJWT, rentalController.approveDeclineRequest);

router.post("/ReturnItem", authenticateJWT, rentalController.returnItem);

router.get("/rented-items", authenticateJWT, rentalController.getRentedItems);
router.post("/report-damage", authenticateJWT,rentalController.damageReport);



module.exports = router;

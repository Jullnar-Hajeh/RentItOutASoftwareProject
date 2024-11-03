const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const verifyToken = require("../middleware/authMiddleware"); 

// Update user profile (location, telephone, password)
router.patch('/updatePassword',verifyToken,profileController.updatePassword);
router.patch('/updateEmail',verifyToken,profileController.updateEmail);
router.patch('/updateTelephone',verifyToken,profileController.updateTelephone);

// Delete user profile
router.delete("/delete", verifyToken, profileController.deleteProfile);

// Search for a user by name
router.get("/searchByName/:name", profileController.searchUserByName);

module.exports = router;

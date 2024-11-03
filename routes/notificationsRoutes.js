const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authenticateJWT = require("../middleware/authMiddleware"); // Adjust the path as necessary


router.get("/", authenticateJWT,notificationsController.getNotifications );
router.post("/response",authenticateJWT,notificationsController.respondToDamageReport);
module.exports = router;
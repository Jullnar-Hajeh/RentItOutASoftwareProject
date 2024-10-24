const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateJWT = require("../middleware/authMiddleware");
// Define the route to get all pending payments
router.get('/pendingPayments',authenticateJWT, paymentController.getPendingPayments);
router.post('/executePayment',authenticateJWT, paymentController.executePayment);
router.get('/userRevenue',authenticateJWT, paymentController.getUserRevenue);
router.get('/platformRevenue',authenticateJWT, paymentController.getPlatformRevenue);
router.post('/payAll',authenticateJWT, paymentController.payAll);
router.get('/receivedPayments',authenticateJWT, paymentController.getReceivedPayments);

module.exports = router;
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
router.post('/create-payment', paymentController.createPayment);
router.get('/pendingFines',authenticateJWT, paymentController.getPendingFins);

router.get('/execute-payment', paymentController.executePaymentt);

// Route to capture and finalize a PayPal payment
router.get('/capture-payment', paymentController.capturePayment);
router.post('/capture-payment', paymentController.capturePayment);
router.get('/cancel', (req, res) => {
    res.status(200).json({ message: "Payment canceled" });
});

module.exports = router;
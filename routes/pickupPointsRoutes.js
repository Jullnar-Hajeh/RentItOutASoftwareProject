const express = require('express');
const router = express.Router();
const pickupPointController = require('../controllers/pickupPointsController')
const authMiddleware = require('../middleware/authMiddleware'); 


router.post('/add', authMiddleware, pickupPointController.addPickupPoint);
router.put('/edit/:id', authMiddleware, pickupPointController.editPickupPoint);
router.delete('/delete/:id', authMiddleware, pickupPointController.deletePickupPoint);
router.get('/getPoints/:user_id', authMiddleware, pickupPointController.getPickupPointsByOwner);

module.exports = router;

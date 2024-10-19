const express = require('express');
const router = express.Router();
const pickupPointController = require('../controllers/pickupPointsController'); 
const authMiddleware = require('../middleware/authMiddleware'); 


router.get('/', authMiddleware, pickupPointController.getAllPickupPoints);
router.post('/add', authMiddleware, pickupPointController.addPickupPoint);
router.put('/edit/:id', authMiddleware, pickupPointController.editPickupPoint);
router.delete('/delete/:id', authMiddleware, pickupPointController.deletePickupPoint);

module.exports = router;

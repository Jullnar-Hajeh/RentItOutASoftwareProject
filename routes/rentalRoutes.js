const express = require('express');
const router = express.Router();
const rentalController = require("../controllers/rentalController");
//const authMiddleware = require('../middleware/authMiddleware')

// Route to create a rental (POST /rental)
router.post('/', rentalController.createRental);

// Route to extend duration of a rental (PUT /rental/:id)
router.put('/:id', rentalController.extendRentalDuration);

// Route to get all rentals for items owned by a user (GET /rental/owner/:id)
router.get('/owner/:id', rentalController.getAllRentalsForOwner);

// Route to get all rentals for items a user is renting (GET /rental/renter/:id)
router.get('/renter/:id', rentalController.getAllRentalsForRenter);

// Route to get info on a specific rental by ID (GET /rental/:id)
router.get('/:id', rentalController.getRentalById);

// Route to cancel a rental (DELETE /rental/:id)
router.delete('/:id', rentalController.cancelRental);

// Route to confirm a rental (PUT /rental/:id)
router.put('/confirm/:id', rentalController.confirmRental);

// Route to return an item (PUT /rental/return/:id)
router.put('/return/:id', rentalController.returnItem);

module.exports = router;
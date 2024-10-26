const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController'); // Import the favorites controller
const authMiddleware = require('../middleware/authMiddleware'); // Auth middleware

// Add to favorites
router.post('/', authMiddleware, favoritesController.addFavorite); // Route to add a favorite

// Remove from favorites
router.delete('/:serial_number', authMiddleware, favoritesController.removeFavorite); // Route to remove a favorite

// Get all favorites for the authenticated user
router.get('/', authMiddleware, favoritesController.getFavorites); // Route to get favorites

module.exports = router;

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController'); // Item controller
const authMiddleware = require('../middleware/authMiddleware'); // Auth middleware

// Get all items route
router.get('/', itemController.getAllItems); // New route to get all items
router.get('/search', itemController.searchItems);
// Add, edit, and delete item routes (user must be authenticated)
router.post('/add', authMiddleware, itemController.addItem);
router.put('/edit/:id', authMiddleware, itemController.editItem);
router.delete('/delete/:id', authMiddleware, itemController.deleteItem);

module.exports = router;

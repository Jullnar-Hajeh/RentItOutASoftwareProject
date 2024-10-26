const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController'); // Item controller
const authMiddleware = require('../middleware/authMiddleware'); // Auth middleware

// Get all items route
router.get('/', itemController.getAllItems); // New route to get all items
router.get('/search', itemController.searchItems);
// Add, edit, and delete item routes (user must be authenticated)
router.post('/add', authMiddleware, itemController.addItem);
router.put('/edit/:serialNumber', authMiddleware, itemController.editItem);
router.delete('/delete/:serialNumber', authMiddleware, itemController.deleteItem);
router.get('/:serialNumber/availability', authMiddleware, itemController.getItemAvailability);

router.put('/edit/:field/:serialNumber', authMiddleware,itemController.editItemField);

router.get('/review/:serialNumber', itemController.getItemReviews);

router.get('/review/:serialNumber/:rating', itemController.getItemReviewsByRating);


module.exports = router;

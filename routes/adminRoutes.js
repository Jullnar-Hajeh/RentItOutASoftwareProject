const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// Admin routes
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers); // Get all users
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUser); // Delete a user
router.get('/users/search/name/:name', verifyToken, isAdmin, adminController.searchUserByName);//search user by name
router.get('/items', verifyToken, isAdmin, adminController.getAllItems); // Get all items
router.delete('/items/:id', verifyToken, isAdmin, adminController.deleteItem); // Delete an item
router.get('/dashboard', verifyToken, isAdmin, adminController.dashboard); // Admin dashboard

module.exports = router;

// ===================================
// Main Routes Index
// ===================================

const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const restaurantRoutes = require('./restaurantRoutes');
const swipeRoutes = require('./swipeRoutes');
const userRoutes = require('./userRoutes');

// Mount routes
router.use('/health', healthRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/swipes', swipeRoutes);
router.use('/users', userRoutes);

module.exports = router;


// ===================================
// Restaurant Routes
// ===================================

const express = require('express');
const router = express.Router();
const { searchRestaurants, getRestaurantById } = require('../controllers/restaurantController');
const validateRequest = require('../middleware/validateRequest');
const { z } = require('zod');

// Import schemas
const { SearchRestaurantsRequestSchema } = require('../schemas');

// GET /api/restaurants/search
router.get(
  '/search',
  validateRequest({
    query: SearchRestaurantsRequestSchema,
  }),
  searchRestaurants
);

// GET /api/restaurants/:id
router.get(
  '/:id',
  validateRequest({
    params: z.object({
      id: z.string(),
    }),
  }),
  getRestaurantById
);

module.exports = router;


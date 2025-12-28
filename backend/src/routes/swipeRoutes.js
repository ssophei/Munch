// ===================================
// Swipe Routes
// ===================================

const express = require('express');
const router = express.Router();
const { createSwipe, getUserSwipes, getUserLikes } = require('../controllers/swipeController');
const validateRequest = require('../middleware/validateRequest');
const { z } = require('zod');

// Import schemas
const { SwipeRequestSchema, SwipeActionSchema } = require('../schemas');

// POST /api/swipes
router.post(
  '/',
  validateRequest({
    body: SwipeRequestSchema,
  }),
  createSwipe
);

// GET /api/swipes/:userId
router.get(
  '/:userId',
  validateRequest({
    params: z.object({
      userId: z.string(),
    }),
    query: z.object({
      action: SwipeActionSchema.optional(),
    }),
  }),
  getUserSwipes
);

// GET /api/swipes/:userId/likes
router.get(
  '/:userId/likes',
  validateRequest({
    params: z.object({
      userId: z.string(),
    }),
  }),
  getUserLikes
);

module.exports = router;


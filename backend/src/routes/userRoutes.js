// ===================================
// User Routes
// ===================================

const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserPreferences, getUserPreferences } = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');
const { z } = require('zod');

// Import schemas
const { UserPreferencesSchema } = require('../schemas');

// GET /api/users/:userId
router.get(
  '/:userId',
  validateRequest({
    params: z.object({
      userId: z.string(),
    }),
  }),
  getUserProfile
);

// GET /api/users/:userId/preferences
router.get(
  '/:userId/preferences',
  validateRequest({
    params: z.object({
      userId: z.string(),
    }),
  }),
  getUserPreferences
);

// PUT /api/users/:userId/preferences
router.put(
  '/:userId/preferences',
  validateRequest({
    params: z.object({
      userId: z.string(),
    }),
    body: UserPreferencesSchema,
  }),
  updateUserPreferences
);

module.exports = router;


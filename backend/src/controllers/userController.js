// ===================================
// User Controller
// ===================================

const firestoreService = require('../services/firestoreService');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get user profile
 * GET /api/users/:userId
 */
async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;

    const profile = await firestoreService.getUserProfile(userId);

    res.json({
      ok: true,
      data: profile,
      requestId: req.requestId,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Update user preferences
 * PUT /api/users/:userId/preferences
 */
async function updateUserPreferences(req, res) {
  try {
    const { userId } = req.params;
    const preferences = req.body;

    await firestoreService.saveUserPreferences(userId, preferences);

    res.json({
      ok: true,
      data: { success: true },
      requestId: req.requestId,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Get user preferences
 * GET /api/users/:userId/preferences
 */
async function getUserPreferences(req, res) {
  try {
    const { userId } = req.params;

    const preferences = await firestoreService.getUserPreferences(userId);

    res.json({
      ok: true,
      data: preferences || { cuisines: [], dietaryRestrictions: [] },
      requestId: req.requestId,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUserProfile,
  updateUserPreferences,
  getUserPreferences,
};


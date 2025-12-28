// ===================================
// Swipe Controller
// ===================================

const firestoreService = require('../services/firestoreService');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Save a swipe
 * POST /api/swipes
 */
async function createSwipe(req, res) {
  try {
    const { userId, restaurantId, action } = req.body;

    await firestoreService.saveSwipe(userId, restaurantId, action);

    res.status(201).json({
      ok: true,
      data: { success: true },
      requestId: req.requestId,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Get user's swipes
 * GET /api/swipes/:userId
 */
async function getUserSwipes(req, res) {
  try {
    const { userId } = req.params;
    const { action } = req.query; // optional filter

    const swipes = await firestoreService.getUserSwipes(userId, action);

    res.json({
      ok: true,
      data: swipes,
      requestId: req.requestId,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Get user's liked restaurants (matches)
 * GET /api/swipes/:userId/likes
 */
async function getUserLikes(req, res) {
  try {
    const { userId } = req.params;

    const likes = await firestoreService.getUserLikes(userId);

    res.json({
      ok: true,
      data: likes,
      requestId: req.requestId,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createSwipe,
  getUserSwipes,
  getUserLikes,
};


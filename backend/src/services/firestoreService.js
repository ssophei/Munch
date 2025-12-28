// ===================================
// Firestore Service
// ===================================

const { getFirestore, admin } = require('../config/firebase');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Firestore database service
 */
class FirestoreService {
  constructor() {
    this.db = null;
  }

  /**
   * Get Firestore instance (lazy initialization)
   */
  getDb() {
    if (!this.db) {
      this.db = getFirestore();
    }
    return this.db;
  }

  // ===================================
  // Swipes
  // ===================================

  /**
   * Save a user swipe (like or pass)
   * @param {string} userId - User ID
   * @param {string} restaurantId - Restaurant ID
   * @param {string} action - 'like' or 'pass'
   * @returns {Promise<Object>}
   */
  async saveSwipe(userId, restaurantId, action) {
    try {
      const db = this.getDb();
      const swipeRef = db
        .collection('users')
        .doc(userId)
        .collection('swipes')
        .doc(restaurantId);

      const swipeData = {
        userId,
        restaurantId,
        action,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await swipeRef.set(swipeData);

      console.log(`✅ Saved swipe: user=${userId}, restaurant=${restaurantId}, action=${action}`);

      return { success: true };
    } catch (error) {
      console.error('❌ Error saving swipe:', error);
      throw new ApiError(500, 'FIRESTORE_ERROR', 'Failed to save swipe', error.message);
    }
  }

  /**
   * Get user's swipes
   * @param {string} userId - User ID
   * @param {string} action - Optional filter by action ('like' or 'pass')
   * @returns {Promise<Array>}
   */
  async getUserSwipes(userId, action = null) {
    try {
      const db = this.getDb();
      let query = db
        .collection('users')
        .doc(userId)
        .collection('swipes');

      if (action) {
        query = query.where('action', '==', action);
      }

      const snapshot = await query.get();
      
      const swipes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));

      return swipes;
    } catch (error) {
      console.error('❌ Error fetching swipes:', error);
      throw new ApiError(500, 'FIRESTORE_ERROR', 'Failed to fetch swipes', error.message);
    }
  }

  /**
   * Get user's liked restaurants
   * @param {string} userId - User ID
   * @returns {Promise<Array>}
   */
  async getUserLikes(userId) {
    return this.getUserSwipes(userId, 'like');
  }

  // ===================================
  // User Preferences
  // ===================================

  /**
   * Save or update user preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - User preferences object
   * @returns {Promise<Object>}
   */
  async saveUserPreferences(userId, preferences) {
    try {
      const db = this.getDb();
      const userRef = db.collection('users').doc(userId);

      const userData = {
        preferences: preferences,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Use set with merge to create or update
      await userRef.set(userData, { merge: true });

      console.log(`✅ Saved preferences for user=${userId}`);

      return { success: true };
    } catch (error) {
      console.error('❌ Error saving preferences:', error);
      throw new ApiError(500, 'FIRESTORE_ERROR', 'Failed to save preferences', error.message);
    }
  }

  /**
   * Get user preferences
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>}
   */
  async getUserPreferences(userId) {
    try {
      const db = this.getDb();
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        return null;
      }

      const data = userDoc.data();
      return data.preferences || null;
    } catch (error) {
      console.error('❌ Error fetching preferences:', error);
      throw new ApiError(500, 'FIRESTORE_ERROR', 'Failed to fetch preferences', error.message);
    }
  }

  /**
   * Get or create user profile
   * @param {string} userId - User ID
   * @param {Object} defaultData - Default data if creating new user
   * @returns {Promise<Object>}
   */
  async getUserProfile(userId, defaultData = {}) {
    try {
      const db = this.getDb();
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        return {
          id: userDoc.id,
          ...userDoc.data(),
          createdAt: userDoc.data().createdAt?.toDate(),
          updatedAt: userDoc.data().updatedAt?.toDate(),
        };
      }

      // Create new user profile
      const newUser = {
        ...defaultData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await userRef.set(newUser);

      console.log(`✅ Created new user profile: ${userId}`);

      return {
        id: userId,
        ...newUser,
      };
    } catch (error) {
      console.error('❌ Error getting/creating user profile:', error);
      throw new ApiError(500, 'FIRESTORE_ERROR', 'Failed to get user profile', error.message);
    }
  }

  // ===================================
  // Restaurants Cache (optional)
  // ===================================

  /**
   * Cache restaurant data in Firestore
   * @param {Object} restaurant - Restaurant data
   * @returns {Promise<void>}
   */
  async cacheRestaurant(restaurant) {
    try {
      const db = this.getDb();
      const restaurantRef = db.collection('restaurants').doc(restaurant.id);

      await restaurantRef.set({
        ...restaurant,
        cachedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log(`✅ Cached restaurant: ${restaurant.id}`);
    } catch (error) {
      console.error('❌ Error caching restaurant:', error);
      // Don't throw - caching failures shouldn't break the app
    }
  }

  /**
   * Get cached restaurants
   * @param {Array<string>} ids - Restaurant IDs
   * @returns {Promise<Array>}
   */
  async getCachedRestaurants(ids) {
    try {
      const db = this.getDb();
      const restaurants = [];

      // Firestore 'in' queries limited to 10 items
      const chunks = [];
      for (let i = 0; i < ids.length; i += 10) {
        chunks.push(ids.slice(i, i + 10));
      }

      for (const chunk of chunks) {
        const snapshot = await db
          .collection('restaurants')
          .where(admin.firestore.FieldPath.documentId(), 'in', chunk)
          .get();

        snapshot.docs.forEach(doc => {
          restaurants.push({
            id: doc.id,
            ...doc.data(),
            cachedAt: doc.data().cachedAt?.toDate(),
          });
        });
      }

      return restaurants;
    } catch (error) {
      console.error('❌ Error fetching cached restaurants:', error);
      return [];
    }
  }
}

// Export singleton instance
module.exports = new FirestoreService();


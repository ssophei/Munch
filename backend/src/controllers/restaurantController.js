// ===================================
// Restaurant Controller
// ===================================

const yelpService = require('../services/yelpService');
const firestoreService = require('../services/firestoreService');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Search restaurants
 * GET /api/restaurants/search
 */
async function searchRestaurants(req, res) {
  try {
    const searchParams = req.query;

    // Try Yelp first
    let result = await yelpService.searchRestaurants(searchParams);

    // If Yelp is disabled or returns no results, fall back to Firestore cache
    if (result.restaurants.length === 0) {
      console.log('📥 Fetching restaurants from Firestore cache...');
      
      // Get all cached restaurants from Firestore
      const db = firestoreService.getDb();
      const snapshot = await db.collection('restaurants')
        .orderBy('rating', 'desc')
        .limit(searchParams.limit || 20)
        .get();
      
      const cachedRestaurants = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Normalize Firebase format to match frontend expectations
        return {
          id: doc.id,
          name: data.name,
          imageUrl: data.image_url || data.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image',
          rating: data.rating || 0,
          price: data.price || 'N/A',
          // Handle categories - can be array of strings or array of objects
          categories: Array.isArray(data.categories) 
            ? data.categories.map(cat => 
                typeof cat === 'string' 
                  ? { alias: cat.toLowerCase(), title: cat }
                  : cat
              )
            : [],
          coordinates: data.coordinates || { latitude: 0, longitude: 0 },
          location: {
            address1: data.location?.address1,
            city: data.location?.city || '',
            state: data.location?.state || '',
            zipCode: data.location?.zip_code || data.location?.zipCode,
            country: data.location?.country || 'US',
            displayAddress: data.location?.display_address || data.location?.displayAddress || [],
          },
          phone: data.phone,
          url: data.url,
          distance: data.distance || 0,
          reviewCount: data.review_count || data.reviewCount || 0,
          isClosed: data.is_closed || data.isClosed || false,
        };
      });
      
      console.log(`✅ Retrieved ${cachedRestaurants.length} restaurants from Firestore cache`);
      
      result = {
        restaurants: cachedRestaurants,
        total: cachedRestaurants.length,
      };
    } else {
      // Optionally cache Yelp results in Firestore (async, don't wait)
      if (result.restaurants.length > 0) {
        result.restaurants.forEach(restaurant => {
          firestoreService.cacheRestaurant(restaurant).catch(err => {
            console.error('Failed to cache restaurant:', err);
          });
        });
      }
    }

    // Return success response
    res.json({
      ok: true,
      data: result,
      requestId: req.requestId,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Get restaurant by ID
 * GET /api/restaurants/:id
 */
async function getRestaurantById(req, res) {
  try {
    const { id } = req.params;

    // First try to get from cache
    const cached = await firestoreService.getCachedRestaurants([id]);
    
    if (cached.length > 0) {
      console.log(`✅ Restaurant ${id} found in cache`);
      return res.json({
        ok: true,
        data: cached[0],
        requestId: req.requestId,
      });
    }

    // If not cached, fetch from Yelp
    const restaurant = await yelpService.getRestaurantById(id);

    // Cache it for future requests
    firestoreService.cacheRestaurant(restaurant).catch(err => {
      console.error('Failed to cache restaurant:', err);
    });

    res.json({
      ok: true,
      data: restaurant,
      requestId: req.requestId,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  searchRestaurants,
  getRestaurantById,
};


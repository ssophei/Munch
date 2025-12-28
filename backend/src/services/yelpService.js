// ===================================
// Yelp API Service
// ===================================

const axios = require('axios');
const { config } = require('../config/env');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Yelp API client
 */
class YelpService {
  constructor() {
    this.apiKey = config.yelp.apiKey;
    this.apiUrl = config.yelp.apiUrl;
    this.enabled = !!this.apiKey;
    
    if (this.enabled) {
      this.client = axios.create({
        baseURL: this.apiUrl,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
    } else {
      console.log('⚠️  Yelp API disabled - no API key provided');
    }
  }

  /**
   * Search for restaurants
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} Normalized restaurant data
   */
  async searchRestaurants(params) {
    if (!this.enabled) {
      console.log('⚠️  Yelp API disabled - returning empty results');
      return {
        restaurants: [],
        total: 0,
      };
    }
    
    try {
      console.log('🔍 Searching Yelp with params:', params);
      
      // Build Yelp API parameters
      const yelpParams = {
        term: params.term || 'restaurants',
        limit: params.limit || 20,
        offset: params.offset || 0,
      };
      
      // Location: either lat/lng or location string
      if (params.latitude && params.longitude) {
        yelpParams.latitude = params.latitude;
        yelpParams.longitude = params.longitude;
      } else if (params.location) {
        yelpParams.location = params.location;
      } else {
        throw new ApiError(400, 'MISSING_LOCATION', 'Either location or latitude/longitude is required');
      }
      
      // Optional filters
      if (params.categories) {
        yelpParams.categories = params.categories;
      }
      if (params.price) {
        yelpParams.price = params.price;
      }
      if (params.radius) {
        yelpParams.radius = Math.min(params.radius, 40000); // Max 40km
      }
      if (params.sort_by) {
        yelpParams.sort_by = params.sort_by;
      }
      
      const response = await this.client.get('/businesses/search', {
        params: yelpParams,
      });
      
      console.log(`✅ Yelp returned ${response.data.businesses?.length || 0} restaurants`);
      
      // Normalize the response
      const restaurants = this.normalizeRestaurants(response.data.businesses || []);
      
      return {
        restaurants,
        total: response.data.total || 0,
      };
      
    } catch (error) {
      return this.handleYelpError(error);
    }
  }

  /**
   * Get restaurant details by ID
   * @param {string} id - Yelp business ID
   * @returns {Promise<Object>} Normalized restaurant data
   */
  async getRestaurantById(id) {
    if (!this.enabled) {
      throw new ApiError(503, 'YELP_DISABLED', 'Yelp API is not configured');
    }
    
    try {
      console.log(`🔍 Fetching restaurant details for ID: ${id}`);
      
      const response = await this.client.get(`/businesses/${id}`);
      
      console.log(`✅ Retrieved restaurant: ${response.data.name}`);
      
      return this.normalizeRestaurant(response.data);
      
    } catch (error) {
      return this.handleYelpError(error);
    }
  }

  /**
   * Normalize a single restaurant from Yelp format to our format
   * @param {Object} business - Yelp business object
   * @returns {Object} Normalized restaurant
   */
  normalizeRestaurant(business) {
    return {
      id: business.id,
      name: business.name,
      imageUrl: business.image_url || 'https://via.placeholder.com/400x300?text=No+Image',
      rating: business.rating || 0,
      price: business.price || undefined,
      categories: (business.categories || []).map(cat => ({
        alias: cat.alias,
        title: cat.title,
      })),
      coordinates: {
        latitude: business.coordinates?.latitude || 0,
        longitude: business.coordinates?.longitude || 0,
      },
      location: {
        address1: business.location?.address1,
        city: business.location?.city || '',
        state: business.location?.state || '',
        zipCode: business.location?.zip_code,
        country: business.location?.country,
        displayAddress: business.location?.display_address || [],
      },
      phone: business.phone || business.display_phone,
      url: business.url,
      distance: business.distance, // in meters
      reviewCount: business.review_count,
      isClosed: business.is_closed || false,
    };
  }

  /**
   * Normalize multiple restaurants
   * @param {Array} businesses - Array of Yelp businesses
   * @returns {Array} Normalized restaurants
   */
  normalizeRestaurants(businesses) {
    return businesses.map(business => this.normalizeRestaurant(business));
  }

  /**
   * Handle Yelp API errors
   * @param {Error} error - Error from Axios/Yelp
   */
  handleYelpError(error) {
    console.error('❌ Yelp API Error:', error.message);
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      // Rate limit
      if (status === 429) {
        throw new ApiError(
          429,
          'YELP_RATE_LIMIT',
          'Yelp API rate limit exceeded. Please try again later.'
        );
      }
      
      // Invalid API key
      if (status === 401 || status === 403) {
        throw new ApiError(
          500,
          'YELP_AUTH_ERROR',
          'Yelp API authentication failed. Please check the API key.'
        );
      }
      
      // Bad request
      if (status === 400) {
        throw new ApiError(
          400,
          'YELP_BAD_REQUEST',
          data.error?.description || 'Invalid request to Yelp API',
          data.error
        );
      }
      
      // Other Yelp errors
      throw new ApiError(
        status,
        'YELP_ERROR',
        data.error?.description || 'Error communicating with Yelp API',
        data.error
      );
    }
    
    // Network or timeout error
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new ApiError(
        504,
        'YELP_TIMEOUT',
        'Yelp API request timed out'
      );
    }
    
    // Unknown error
    throw new ApiError(
      500,
      'YELP_UNKNOWN_ERROR',
      'An unexpected error occurred while communicating with Yelp API'
    );
  }

  /**
   * Check if Yelp API is healthy
   * @returns {Promise<boolean>}
   */
  async checkHealth() {
    if (!this.enabled) {
      return false;
    }
    
    try {
      // Try a simple search
      await this.client.get('/businesses/search', {
        params: {
          term: 'restaurant',
          location: 'San Francisco',
          limit: 1,
        },
      });
      return true;
    } catch (error) {
      console.error('Yelp health check failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new YelpService();


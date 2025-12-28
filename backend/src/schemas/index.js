// ===================================
// Zod Schemas for Backend Validation
// ===================================
// JavaScript version of shared types for Node.js backend

const { z } = require('zod');

// ===================================
// Restaurant Schemas
// ===================================

const CoordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const CategorySchema = z.object({
  alias: z.string(),
  title: z.string(),
});

const SearchRestaurantsRequestSchema = z.object({
  // Location (either term or lat/lng)
  term: z.string().optional(),
  location: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  
  // Filters
  categories: z.string().optional(), // comma-separated
  price: z.string().optional(), // "1,2,3,4"
  radius: z.coerce.number().optional(), // in meters, max 40000
  sort_by: z.enum(['best_match', 'rating', 'review_count', 'distance']).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
  offset: z.coerce.number().min(0).optional(),
});

// ===================================
// Swipe Schemas
// ===================================

const SwipeActionSchema = z.enum(['like', 'pass']);

const SwipeRequestSchema = z.object({
  userId: z.string(),
  restaurantId: z.string(),
  action: SwipeActionSchema,
});

// ===================================
// User Preferences Schemas
// ===================================

const UserPreferencesSchema = z.object({
  cuisines: z.array(z.string()),
  dietaryRestrictions: z.array(z.string()),
  priceRange: z.array(z.number().min(1).max(4)).optional(),
  maxDistance: z.number().optional(), // in miles
});

// ===================================
// Exports
// ===================================

module.exports = {
  CoordinatesSchema,
  CategorySchema,
  SearchRestaurantsRequestSchema,
  SwipeActionSchema,
  SwipeRequestSchema,
  UserPreferencesSchema,
};


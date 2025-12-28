// ===================================
// Shared Types for Munch App
// ===================================
// This file is used by both frontend and backend

import { z } from 'zod';

// ===================================
// API Response Envelope
// ===================================

export interface SuccessResponse<T = any> {
  ok: true;
  data: T;
  requestId: string;
}

export interface ErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  requestId: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// ===================================
// Restaurant Types
// ===================================

export const CoordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const CategorySchema = z.object({
  alias: z.string(),
  title: z.string(),
});

export const RestaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().url(),
  rating: z.number().min(0).max(5),
  price: z.string().optional(),
  categories: z.array(CategorySchema),
  coordinates: CoordinatesSchema,
  location: z.object({
    address1: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    displayAddress: z.array(z.string()).optional(),
  }),
  phone: z.string().optional(),
  url: z.string().url().optional(),
  distance: z.number().optional(), // in meters
  reviewCount: z.number().optional(),
  isClosed: z.boolean().optional(),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Restaurant = z.infer<typeof RestaurantSchema>;

// ===================================
// Search Request/Response
// ===================================

export const SearchRestaurantsRequestSchema = z.object({
  // Location (either term or lat/lng)
  term: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Filters
  categories: z.string().optional(), // comma-separated
  price: z.string().optional(), // "1,2,3,4"
  radius: z.number().optional(), // in meters, max 40000
  sort_by: z.enum(['best_match', 'rating', 'review_count', 'distance']).optional(),
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
});

export type SearchRestaurantsRequest = z.infer<typeof SearchRestaurantsRequestSchema>;

export const SearchRestaurantsResponseSchema = z.object({
  restaurants: z.array(RestaurantSchema),
  total: z.number(),
});

export type SearchRestaurantsResponse = z.infer<typeof SearchRestaurantsResponseSchema>;

// ===================================
// Swipe Types
// ===================================

export const SwipeActionSchema = z.enum(['like', 'pass']);

export const SwipeRequestSchema = z.object({
  userId: z.string(),
  restaurantId: z.string(),
  action: SwipeActionSchema,
});

export type SwipeAction = z.infer<typeof SwipeActionSchema>;
export type SwipeRequest = z.infer<typeof SwipeRequestSchema>;

export const SwipeSchema = z.object({
  userId: z.string(),
  restaurantId: z.string(),
  action: SwipeActionSchema,
  createdAt: z.date(),
});

export type Swipe = z.infer<typeof SwipeSchema>;

// ===================================
// User Preferences
// ===================================

export const UserPreferencesSchema = z.object({
  cuisines: z.array(z.string()),
  dietaryRestrictions: z.array(z.string()),
  priceRange: z.array(z.number().min(1).max(4)).optional(),
  maxDistance: z.number().optional(), // in miles
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const UpdatePreferencesRequestSchema = z.object({
  userId: z.string(),
  preferences: UserPreferencesSchema,
});

export type UpdatePreferencesRequest = z.infer<typeof UpdatePreferencesRequestSchema>;

// ===================================
// User Profile
// ===================================

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  preferences: UserPreferencesSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// ===================================
// Health Check
// ===================================

export const HealthCheckResponseSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error']),
  timestamp: z.string(),
  services: z.object({
    firebase: z.boolean(),
    yelp: z.boolean(),
  }),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;


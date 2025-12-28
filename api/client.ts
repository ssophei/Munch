// ===================================
// Munch API Client
// ===================================
// Centralized API client for all backend requests

import Constants from 'expo-constants';
import type { ApiResponse } from '../shared/types';

/**
 * API Client Configuration
 */
const getBaseUrl = (): string => {
  // Priority 1: Environment variable (can be overridden per environment)
  const envUrl = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Priority 2: Auto-detect based on platform (fallback)
  const { platform } = require('react-native').Platform;
  
  if (platform === 'ios') {
    // iOS Simulator can use localhost
    return 'http://localhost:3000';
  } else if (platform === 'android') {
    // Android Emulator needs special IP
    return 'http://10.0.2.2:3000';
  } else {
    // Web fallback
    return 'http://localhost:3000';
  }
};

const BASE_URL = getBaseUrl();
const DEFAULT_TIMEOUT = 15000; // 15 seconds

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any,
    public requestId?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Make an API request
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  // Default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse JSON response
    const data: ApiResponse<T> = await response.json();

    // Handle API envelope
    if (!data.ok) {
      const error = data.error || { code: 'UNKNOWN_ERROR', message: 'An error occurred' };
      throw new ApiError(
        response.status,
        error.code,
        error.message,
        error.details,
        data.requestId
      );
    }

    console.log(`✅ API Success: ${options.method || 'GET'} ${url}`);
    return data.data as T;

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle timeout
    if (error.name === 'AbortError') {
      console.error('❌ API Timeout:', url);
      throw new ApiError(
        408,
        'REQUEST_TIMEOUT',
        'Request timed out. Please check your connection.'
      );
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('❌ API Network Error:', error.message);
      throw new ApiError(
        0,
        'NETWORK_ERROR',
        'Network error. Please check your connection and ensure the backend is running.'
      );
    }

    // Re-throw ApiError
    if (error instanceof ApiError) {
      console.error(`❌ API Error: ${error.code} - ${error.message}`);
      throw error;
    }

    // Unknown error
    console.error('❌ Unknown API Error:', error);
    throw new ApiError(
      500,
      'UNKNOWN_ERROR',
      error.message || 'An unexpected error occurred'
    );
  }
}

/**
 * API Client Methods
 */
export const api = {
  // Generic methods
  get: <T = any>(endpoint: string, params?: Record<string, any>) => {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : '';
    return request<T>(endpoint + queryString, { method: 'GET' });
  },

  post: <T = any>(endpoint: string, body?: any) => {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put: <T = any>(endpoint: string, body?: any) => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete: <T = any>(endpoint: string) => {
    return request<T>(endpoint, { method: 'DELETE' });
  },

  // ===================================
  // Restaurants
  // ===================================
  
  restaurants: {
    search: (params: {
      term?: string;
      location?: string;
      latitude?: number;
      longitude?: number;
      categories?: string;
      price?: string;
      radius?: number;
      sort_by?: 'best_match' | 'rating' | 'review_count' | 'distance';
      limit?: number;
      offset?: number;
    }) => {
      return api.get<{ restaurants: any[]; total: number }>('/api/restaurants/search', params);
    },

    getById: (id: string) => {
      return api.get(`/api/restaurants/${id}`);
    },
  },

  // ===================================
  // Swipes
  // ===================================

  swipes: {
    create: (data: { userId: string; restaurantId: string; action: 'like' | 'pass' }) => {
      return api.post('/api/swipes', data);
    },

    getUserSwipes: (userId: string, action?: 'like' | 'pass') => {
      return api.get(`/api/swipes/${userId}`, action ? { action } : undefined);
    },

    getUserLikes: (userId: string) => {
      return api.get(`/api/swipes/${userId}/likes`);
    },
  },

  // ===================================
  // Users
  // ===================================

  users: {
    getProfile: (userId: string) => {
      return api.get(`/api/users/${userId}`);
    },

    getPreferences: (userId: string) => {
      return api.get(`/api/users/${userId}/preferences`);
    },

    updatePreferences: (
      userId: string,
      preferences: {
        cuisines: string[];
        dietaryRestrictions: string[];
        priceRange?: number[];
        maxDistance?: number;
      }
    ) => {
      return api.put(`/api/users/${userId}/preferences`, preferences);
    },
  },

  // ===================================
  // Health
  // ===================================

  health: {
    check: () => {
      return api.get('/health');
    },
  },
};

/**
 * Get the current base URL (useful for debugging)
 */
export const getApiBaseUrl = () => BASE_URL;

/**
 * Log the current API configuration (for debugging)
 */
export const logApiConfig = () => {
  console.log('📡 API Configuration:');
  console.log('   Base URL:', BASE_URL);
  console.log('   Timeout:', DEFAULT_TIMEOUT, 'ms');
};


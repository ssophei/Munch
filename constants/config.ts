// ===================================
// App Configuration
// ===================================

import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Get API base URL based on environment and platform
 */
export const getApiBaseUrl = (): string => {
  // Priority 1: Environment variable (can be overridden)
  const envUrl = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    console.log('📡 Using API URL from env:', envUrl);
    return envUrl;
  }

  // Priority 2: Auto-detect based on platform
  if (Platform.OS === 'ios') {
    // iOS Simulator can use localhost
    console.log('📱 iOS detected - using localhost:3000');
    return 'http://localhost:3000';
  } else if (Platform.OS === 'android') {
    // Android Emulator needs special IP
    console.log('🤖 Android detected - using 10.0.2.2:3000');
    return 'http://10.0.2.2:3000';
  } else {
    // Web fallback
    console.log('🌐 Web detected - using localhost:3000');
    return 'http://localhost:3000';
  }
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  timeout: 15000, // 15 seconds
};

/**
 * App Configuration
 */
export const APP_CONFIG = {
  // Default user ID for demo purposes
  // In production, this would come from Firebase Auth
  defaultUserId: 'demo-user',
  
  // Default search location
  defaultLocation: 'Berkeley, CA',
  
  // Default search radius (in meters)
  defaultRadius: 5000, // 5km
};

/**
 * Log current configuration (for debugging)
 */
export const logConfig = () => {
  console.log('⚙️  App Configuration:');
  console.log('   API Base URL:', API_CONFIG.baseUrl);
  console.log('   Platform:', Platform.OS);
  console.log('   Timeout:', API_CONFIG.timeout, 'ms');
  console.log('   Default User:', APP_CONFIG.defaultUserId);
  console.log('   Default Location:', APP_CONFIG.defaultLocation);
};


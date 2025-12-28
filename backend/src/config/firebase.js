// ===================================
// Firebase Admin Configuration
// ===================================

const admin = require('firebase-admin');

let firebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK
 * Supports two methods:
 * 1. GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account file
 * 2. FIREBASE_SERVICE_ACCOUNT_JSON env var with JSON string
 */
function initializeFirebase() {
  if (firebaseInitialized) {
    console.log('✅ Firebase already initialized');
    return admin;
  }

  try {
    let credential;

    // Method 1: Service account JSON string from env (deployment)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      console.log('🔑 Loading Firebase credentials from FIREBASE_SERVICE_ACCOUNT_JSON env var');
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      credential = admin.credential.cert(serviceAccount);
    }
    // Method 2: Service account file path (local dev)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log(`🔑 Loading Firebase credentials from ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
      const serviceAccount = require(`../../${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
      credential = admin.credential.cert(serviceAccount);
    }
    // Fallback: Try default location
    else {
      console.log('🔑 Attempting to load Firebase credentials from default location');
      const serviceAccount = require('../../serviceAccountKey.json');
      credential = admin.credential.cert(serviceAccount);
    }

    admin.initializeApp({
      credential: credential,
    });

    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized successfully');
    
    return admin;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:');
    console.error('   Error:', error.message);
    console.error('   Make sure you have either:');
    console.error('   1. serviceAccountKey.json in the backend folder, OR');
    console.error('   2. GOOGLE_APPLICATION_CREDENTIALS env var set, OR');
    console.error('   3. FIREBASE_SERVICE_ACCOUNT_JSON env var set');
    throw error;
  }
}

/**
 * Get Firestore instance
 */
function getFirestore() {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  return admin.firestore();
}

/**
 * Check if Firebase is healthy
 */
async function checkFirebaseHealth() {
  try {
    const db = getFirestore();
    // Try to access Firestore
    await db.collection('_health_check').limit(1).get();
    return true;
  } catch (error) {
    console.error('Firebase health check failed:', error.message);
    return false;
  }
}

module.exports = {
  initializeFirebase,
  getFirestore,
  checkFirebaseHealth,
  admin,
};


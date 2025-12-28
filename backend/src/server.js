// ===================================
// Munch Backend Server
// ===================================

const express = require('express');
const cors = require('cors');
const { config, validateEnv } = require('./config/env');
const { initializeFirebase } = require('./config/firebase');
const requestLogger = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

/**
 * Create and configure Express app
 */
function createApp() {
  const app = express();

  // ===================================
  // Middleware
  // ===================================

  // CORS - Allow all origins for development
  app.use(cors({
    origin: true, // Allow all origins for now
    credentials: true,
  }));

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use(requestLogger);

  // ===================================
  // Routes
  // ===================================

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      ok: true,
      data: {
        message: 'Munch API is running',
        version: '1.0.0',
        endpoints: {
          health: 'GET /health',
          restaurants: {
            search: 'GET /api/restaurants/search',
            details: 'GET /api/restaurants/:id',
          },
          swipes: {
            create: 'POST /api/swipes',
            getUserSwipes: 'GET /api/swipes/:userId',
            getUserLikes: 'GET /api/swipes/:userId/likes',
          },
          users: {
            profile: 'GET /api/users/:userId',
            preferences: 'GET /api/users/:userId/preferences',
            updatePreferences: 'PUT /api/users/:userId/preferences',
          },
        },
      },
      requestId: req.requestId,
    });
  });

  // API routes
  app.use('/api', routes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      ok: false,
      error: {
        code: 'NOT_FOUND',
        message: `Cannot ${req.method} ${req.url}`,
      },
      requestId: req.requestId,
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Start the server
 */
async function startServer() {
  console.log('🔵 Starting Munch backend...');
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Port: ${config.port}`);

  // Validate environment
  if (!validateEnv()) {
    console.error('❌ Environment validation failed. Exiting...');
    process.exit(1);
  }

  // Initialize Firebase
  try {
    initializeFirebase();
  } catch (error) {
    console.error('❌ Failed to initialize Firebase. Exiting...');
    process.exit(1);
  }

  // Create Express app
  const app = createApp();

  // Start listening
  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log('');
    console.log('✅ Server started successfully!');
    console.log(`   Local:    http://localhost:${config.port}`);
    console.log(`   Network:  http://<your-ip>:${config.port}`);
    console.log('');
    console.log('📡 Available endpoints:');
    console.log(`   Health:      GET  /health`);
    console.log(`   Restaurants: GET  /api/restaurants/search`);
    console.log(`   Restaurant:  GET  /api/restaurants/:id`);
    console.log(`   Swipes:      POST /api/swipes`);
    console.log(`   User Swipes: GET  /api/swipes/:userId`);
    console.log(`   User Likes:  GET  /api/swipes/:userId/likes`);
    console.log(`   Profile:     GET  /api/users/:userId`);
    console.log(`   Preferences: GET  /api/users/:userId/preferences`);
    console.log(`   Preferences: PUT  /api/users/:userId/preferences`);
    console.log('');
    console.log('🚀 Ready to accept connections!');
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('');
    console.log('⚠️  SIGTERM signal received. Closing server...');
    server.close(() => {
      console.log('✅ Server closed gracefully');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('');
    console.log('⚠️  SIGINT signal received. Closing server...');
    server.close(() => {
      console.log('✅ Server closed gracefully');
      process.exit(0);
    });
  });

  return server;
}

module.exports = {
  createApp,
  startServer,
};


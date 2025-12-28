// ===================================
// Munch Backend - Entry Point
// ===================================

const { startServer } = require('./src/server');

// Start the server
startServer().catch(error => {
  console.error('❌ Fatal error starting server:', error);
  process.exit(1);
});

const app = require('./app');
const config = require('./config');
const { testConnection } = require('./config/database');

async function startServer() {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // DON'T sync database - we're using existing tables from FastAPI
    // The tables already exist with the correct schema
    console.log('⚠️  Using existing database schema (no sync)');

    // Start server
    const port = config.app.port;
    app.listen(port, () => {
      console.log(`\n🚀 ${config.app.name} server running on port ${port}`);
      console.log(`📝 Environment: ${config.app.env}`);
      console.log(`🌍 API: http://localhost:${port}/api`);
      console.log(`📊 Health: http://localhost:${port}/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();

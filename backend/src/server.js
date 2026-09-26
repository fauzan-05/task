const { createApp } = require('./app');
const { connectDatabase, disconnectDatabase } = require('./config/database');
const { ENV } = require('./config/env');
const { seedDatabase } = require('./scripts/seed');

const startServer = async () => {
  try {
    // Initialize Database
    await connectDatabase();
    await seedDatabase();

    const app = createApp();

    const server = app.listen(ENV.PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Node.js Server running on port ${ENV.PORT}`);
      console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
      console.log(`🔗 API Base: http://localhost:${ENV.PORT}/api`);
      console.log(`=========================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${ENV.PORT} is already in use by another process. Please close existing processes on port ${ENV.PORT} and restart.`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });

    // Graceful Shutdown
    const handleShutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log('Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

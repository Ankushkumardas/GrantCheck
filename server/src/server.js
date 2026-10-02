const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/db');
const logger = require('./config/logger');

async function startServer() {
  try {
    // Connect to MongoDB (with in-memory fallback for local dev)
    await connectDB();

    app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`, {
        event: 'server_started',
        port: env.PORT,
        aiProvider: env.AI_PROVIDER
      });
      console.log(`\n======================================================`);
      console.log(`🚀 Grant Application Completeness Assistant API`);
      console.log(`📡 Server: http://localhost:${env.PORT}`);
      console.log(`🤖 AI Provider: ${env.AI_PROVIDER.toUpperCase()}`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };

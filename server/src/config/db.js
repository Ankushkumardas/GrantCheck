const mongoose = require('mongoose');
const env = require('./env');
const logger = require('./logger');

let memoryServer = null;

async function connectDB() {
  try {
    // Attempt standard connection first
    logger.info(`Attempting MongoDB connection to: ${env.MONGODB_URI}`);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    logger.info('Connected to MongoDB successfully', { event: 'db_connected', uri: env.MONGODB_URI });
  } catch (err) {
    logger.warn(`Could not connect to MongoDB at ${env.MONGODB_URI}: ${err.message}`);
    
    // In development or test, fallback to in-memory mongodb-memory-server
    if (env.NODE_ENV !== 'production') {
      try {
        logger.info('Starting fallback MongoDB In-Memory Server for frictionless local development/testing...', { event: 'db_in_memory_fallback' });
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        await mongoose.connect(memUri);
        logger.info('Connected to In-Memory MongoDB successfully!', { event: 'db_connected', uri: memUri });
      } catch (memErr) {
        logger.error('Failed to initialize In-Memory MongoDB', { error: memErr.message });
        throw memErr;
      }
    } else {
      throw err;
    }
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
  logger.info('MongoDB disconnected', { event: 'db_disconnected' });
}

module.exports = { connectDB, disconnectDB };

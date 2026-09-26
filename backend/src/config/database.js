const mongoose = require('mongoose');
const { ENV } = require('./env');

let memoryServer = null;

const connectDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);
    
    // First, attempt to connect to configured MongoDB URI with a short timeout
    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`Connected to MongoDB at ${ENV.MONGODB_URI}`);
  } catch (error) {
    console.warn(`Could not connect to external MongoDB at ${ENV.MONGODB_URI}. Starting MongoMemoryServer for development environment...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`Connected to in-memory MongoDB at ${memoryUri}`);
    } catch (memError) {
      console.error('Failed to initialize MongoDB connection:', memError);
      process.exit(1);
    }
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('MongoDB disconnected successfully.');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};

module.exports = { connectDatabase, disconnectDatabase };

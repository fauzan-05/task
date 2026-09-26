const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bettertask_ecommerce',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret_jwt_key_for_ecommerce_app_2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  JWT_EXPIRES_IN: '7d',
  COOKIE_MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000 // 7 days
};

module.exports = { ENV };

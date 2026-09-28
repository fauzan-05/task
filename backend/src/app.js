const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { ENV } = require('./config/env');
const { errorMiddleware } = require('./middleware/error.middleware');
const { ApiError } = require('./utils/ApiError');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

const createApp = () => {
  const app = express();

  // Secure HTTP Headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows cross-origin assets for development
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );

  // General API Rate Limiter
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  });
  app.use('/api', globalLimiter);

  // Strict Rate Limiter for Auth Endpoints (Brute-force protection)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 attempts per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many authentication attempts, please try again later.'
    }
  });

  // CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.) or any local development origin
        if (!origin || /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
        if (origin === ENV.CLIENT_URL) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in development
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  );

  // Body and Cookie Parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Basic Health Check Endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      environment: ENV.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  // Mount API Modules
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);

  // Catch-all 404 for undefined routes
  app.use((req, res, next) => {
    next(ApiError.notFound(`Cannot find route ${req.method} ${req.originalUrl}`));
  });

  // Centralized Error Handling Middleware
  app.use(errorMiddleware);

  return app;
};

module.exports = { createApp };

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ENV } = require('./config/env');
const { errorMiddleware } = require('./middleware/error.middleware');
const { ApiError } = require('./utils/ApiError');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

const createApp = () => {
  const app = express();

  // CORS Configuration
  app.use(
    cors({
      origin: [
        ENV.CLIENT_URL,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  );

  // Body and Cookie Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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
  app.use('/api/auth', authRoutes);
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

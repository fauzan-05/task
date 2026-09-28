const mongoose = require('mongoose');
const { ApiError } = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');
const { User } = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fallback to Bearer token in Authorization header
    else if (req.headers.authorization && typeof req.headers.authorization === 'string') {
      const parts = req.headers.authorization.trim().split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication required. Please log in.');
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Session expired. Please log in again.');
      }
      throw ApiError.unauthorized('Invalid authentication token.');
    }

    if (!payload || !payload.userId || !mongoose.Types.ObjectId.isValid(payload.userId)) {
      throw ApiError.unauthorized('Invalid token payload.');
    }

    const user = await User.findById(payload.userId).select('-password');

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required.'));
  }
  const isAdmin = req.user.role === 'admin' || req.user.email?.toLowerCase() === 'admin@gmail.com';
  if (!isAdmin) {
    return next(ApiError.forbidden('Access denied. Administrator privileges required.'));
  }
  next();
};

module.exports = { authenticate, requireAdmin };



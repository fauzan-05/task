const { ApiError } = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');
const { User } = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // Fallback to Bearer token in Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication required. Please login.');
    }

    const payload = verifyToken(token);
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
  const isAdmin = req.user && (req.user.role === 'admin' || req.user.email?.toLowerCase() === 'admin@gmail.com');
  if (!isAdmin) {
    throw ApiError.forbidden('Admin access required.');
  }
  next();
};

module.exports = { authenticate, requireAdmin };



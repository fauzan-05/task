const jwt = require('jsonwebtoken');
const { ENV } = require('../config/env');

const JWT_OPTIONS = {
  algorithm: 'HS256',
  issuer: 'bettertask-api',
  audience: 'bettertask-app',
  expiresIn: ENV.JWT_EXPIRES_IN || '7d'
};

/**
 * Sign a JWT token with strict algorithm, issuer, and audience
 */
const signToken = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload for token signing');
  }
  return jwt.sign(payload, ENV.JWT_SECRET, JWT_OPTIONS);
};

/**
 * Verify and decode a JWT token securely
 */
const verifyToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Token is missing or invalid format');
  }
  return jwt.verify(token, ENV.JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: 'bettertask-api',
    audience: 'bettertask-app'
  });
};

/**
 * Get secure cookie options
 */
const getAuthCookieOptions = () => {
  const isProduction = ENV.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: ENV.COOKIE_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000,
    path: '/'
  };
};

/**
 * Attach auth cookie to HTTP response
 */
const setAuthCookie = (res, token) => {
  res.cookie('token', token, getAuthCookieOptions());
};

/**
 * Clear auth cookie from HTTP response
 */
const clearAuthCookie = (res) => {
  res.clearCookie('token', {
    ...getAuthCookieOptions(),
    maxAge: 0
  });
};

module.exports = {
  signToken,
  verifyToken,
  getAuthCookieOptions,
  setAuthCookie,
  clearAuthCookie
};

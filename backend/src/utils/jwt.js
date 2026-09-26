const jwt = require('jsonwebtoken');
const { ENV } = require('../config/env');

const signToken = (payload) => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

const getAuthCookieOptions = () => {
  const isProduction = ENV.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: ENV.COOKIE_MAX_AGE_MS,
    path: '/'
  };
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, getAuthCookieOptions());
};

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

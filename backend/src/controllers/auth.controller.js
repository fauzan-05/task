const { AuthService } = require('../services/auth.service');
const { setAuthCookie, clearAuthCookie } = require('../utils/jwt');
const { asyncHandler } = require('../utils/asyncHandler');

class AuthController {
  static register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await AuthService.register({ name, email, password });

    setAuthCookie(res, result.token);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result
    });
  });

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });

    setAuthCookie(res, result.token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  });

  static logout = asyncHandler(async (req, res) => {
    clearAuthCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });

  static getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id.toString(),
          _id: req.user._id.toString(),
          name: req.user.name,
          email: req.user.email,
          role: req.user.role || (req.user.email?.toLowerCase() === 'admin@gmail.com' ? 'admin' : 'user'),
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt
        }
      }
    });
  });
}

module.exports = { AuthController };


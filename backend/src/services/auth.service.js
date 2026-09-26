const { User } = require('../models/User');
const { ApiError } = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');

class AuthService {
  static async register(data) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };
  }

  static async login(data) {
    const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }
}

module.exports = { AuthService };

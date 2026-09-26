const { CartService } = require('../services/cart.service');
const { asyncHandler } = require('../utils/asyncHandler');

class CartController {
  static getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    const cart = await CartService.getCart(userId);

    res.status(200).json({
      success: true,
      data: cart
    });
  });

  static addItem = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    const { productId, quantity } = req.body;
    const cart = await CartService.addItem(userId, productId, quantity);

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  });

  static updateItemQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await CartService.updateItemQuantity(userId, productId, quantity);

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  });

  static removeItem = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    const { productId } = req.params;
    const cart = await CartService.removeItem(userId, productId);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  });

  static clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    const cart = await CartService.clearCart(userId);

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  });
}

module.exports = { CartController };

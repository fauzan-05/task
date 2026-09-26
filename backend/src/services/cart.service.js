const mongoose = require('mongoose');
const { Cart } = require('../models/Cart');
const { Product } = require('../models/Product');
const { ApiError } = require('../utils/ApiError');

class CartService {
  /**
   * Helper to retrieve or create an active cart for a user.
   */
  static async getOrCreateCart(userId) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
  }

  /**
   * Formats cart and calculates live backend subtotals & totals
   */
  static formatCart(cart) {
    const formattedItems = [];
    let totalQuantity = 0;
    let totalAmount = 0;

    for (const item of cart.items || []) {
      const product = item.product;
      // Handle deleted or unpopulated product gracefully
      if (!product || !product._id) {
        continue;
      }

      const isAvailable = product.stock > 0;
      const validQuantity = Math.min(item.quantity, Math.max(product.stock, 1));
      const subtotal = product.price * validQuantity;

      formattedItems.push({
        product: {
          _id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          isAvailable
        },
        quantity: item.quantity,
        subtotal
      });

      totalQuantity += item.quantity;
      totalAmount += subtotal;
    }

    return {
      _id: cart._id.toString(),
      user: cart.user.toString(),
      items: formattedItems,
      totalQuantity,
      totalAmount: Number(totalAmount.toFixed(2))
    };
  }

  static async getCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    await cart.populate('items.product');
    return this.formatCart(cart);
  }

  static async addItem(userId, productId, quantity) {
    if (quantity < 1) {
      throw ApiError.badRequest('Quantity must be at least 1');
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw ApiError.badRequest('Invalid product ID');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (product.stock <= 0) {
      throw ApiError.badRequest('Product is currently out of stock');
    }

    const cart = await this.getOrCreateCart(userId);
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        throw ApiError.badRequest(
          `Cannot add ${quantity} more item(s). Only ${product.stock} available in stock (you already have ${cart.items[existingItemIndex].quantity} in cart).`
        );
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        throw ApiError.badRequest(`Requested quantity (${quantity}) exceeds available stock (${product.stock})`);
      }
      cart.items.push({
        product: product._id,
        quantity
      });
    }

    await cart.save();
    await cart.populate('items.product');
    return this.formatCart(cart);
  }

  static async updateItemQuantity(userId, productId, quantity) {
    if (quantity < 1) {
      throw ApiError.badRequest('Quantity must be at least 1');
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw ApiError.badRequest('Invalid product ID');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (quantity > product.stock) {
      throw ApiError.badRequest(`Requested quantity (${quantity}) exceeds available stock (${product.stock})`);
    }

    const cart = await this.getOrCreateCart(userId);
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex === -1) {
      throw ApiError.notFound('Product not found in cart');
    }

    cart.items[existingItemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    return this.formatCart(cart);
  }

  static async removeItem(userId, productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw ApiError.badRequest('Invalid product ID');
    }

    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');
    return this.formatCart(cart);
  }

  static async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    await cart.save();
    return this.formatCart(cart);
  }
}

module.exports = { CartService };

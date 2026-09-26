const mongoose = require('mongoose');
const { Order } = require('../models/Order');
const { Cart } = require('../models/Cart');
const { Product } = require('../models/Product');
const { ApiError } = require('../utils/ApiError');

class OrderService {
  static async createOrder(userId, shippingAddress) {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || !cart.items || cart.items.length === 0) {
      throw ApiError.badRequest('Cannot checkout with an empty cart');
    }

    const orderItems = [];
    let calculatedTotal = 0;

    // Step 1: Validate all items and current stock before modifying anything
    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product._id) {
        throw ApiError.badRequest(
          'One or more items in your cart are no longer available. Please update your cart.'
        );
      }

      // Re-fetch latest product state from database to prevent stale cache/race condition
      const freshProduct = await Product.findById(product._id);
      if (!freshProduct) {
        throw ApiError.badRequest(`Product "${product.name || 'Unknown'}" no longer exists.`);
      }

      if (freshProduct.stock < item.quantity) {
        if (freshProduct.stock === 0) {
          throw ApiError.badRequest(
            `Product "${freshProduct.name}" is currently out of stock.`
          );
        } else {
          throw ApiError.badRequest(
            `Insufficient stock for "${freshProduct.name}". Only ${freshProduct.stock} left in stock, but you requested ${item.quantity}.`
          );
        }
      }

      const itemSubtotal = Number((freshProduct.price * item.quantity).toFixed(2));
      calculatedTotal += itemSubtotal;

      orderItems.push({
        productId: freshProduct._id,
        productName: freshProduct.name,
        price: freshProduct.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        image: freshProduct.image
      });
    }

    // Step 2: Safely decrement stock using atomic operations
    const updatedProductIds = [];
    try {
      for (const orderItem of orderItems) {
        const updateResult = await Product.findOneAndUpdate(
          {
            _id: orderItem.productId,
            stock: { $gte: orderItem.quantity }
          },
          {
            $inc: { stock: -orderItem.quantity }
          },
          { new: true }
        );

        if (!updateResult) {
          throw ApiError.badRequest(
            `Could not reserve stock for "${orderItem.productName}". Please try again.`
          );
        }

        updatedProductIds.push({
          id: orderItem.productId.toString(),
          quantity: orderItem.quantity
        });
      }

      // Step 3: Create the Order
      const order = await Order.create({
        user: new mongoose.Types.ObjectId(userId),
        items: orderItems,
        shippingAddress,
        totalAmount: Number(calculatedTotal.toFixed(2)),
        status: 'Confirmed'
      });

      // Step 4: Clear the user's cart
      cart.items = [];
      await cart.save();

      return order;
    } catch (error) {
      // Rollback any successfully decremented stocks if order creation failed midway
      for (const updated of updatedProductIds) {
        await Product.findByIdAndUpdate(updated.id, {
          $inc: { stock: updated.quantity }
        }).catch((rollbackErr) => {
          console.error(`Rollback error for product ${updated.id}:`, rollbackErr);
        });
      }
      throw error;
    }
  }

  static async getOrderById(orderId, userId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw ApiError.badRequest('Invalid order ID format');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    // Ensure user can only view their own order
    if (order.user.toString() !== userId) {
      throw ApiError.forbidden('You are not authorized to view this order');
    }

    return order;
  }

  static async getUserOrders(userId) {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  static async getAllOrdersAdmin({ status, search } = {}) {
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { 'shippingAddress.fullName': regex },
        { 'shippingAddress.email': regex },
        { 'shippingAddress.phone': regex },
        { 'shippingAddress.city': regex },
        { 'items.productName': regex }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return orders;
  }

  static async getOrderStatsAdmin() {
    const totalOrders = await Order.countDocuments();
    const confirmedOrders = await Order.countDocuments({ status: 'Confirmed' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const totalItemsSoldAgg = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      { $group: { _id: null, totalQty: { $sum: '$items.quantity' } } }
    ]);
    const totalItemsSold = totalItemsSoldAgg[0]?.totalQty || 0;

    return {
      totalOrders,
      confirmedOrders,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalItemsSold
    };
  }

  static async updateOrderStatusAdmin(orderId, status) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw ApiError.badRequest('Invalid order ID');
    }

    const validStatuses = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }

  static async deleteOrderAdmin(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw ApiError.badRequest('Invalid order ID');
    }

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return { message: 'Order deleted successfully' };
  }
}

module.exports = { OrderService };


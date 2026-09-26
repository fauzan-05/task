const { OrderService } = require('../services/order.service');
const { asyncHandler } = require('../utils/asyncHandler');

class OrderController {
  static createOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    const { shippingAddress } = req.body;
    const order = await OrderService.createOrder(userId, shippingAddress);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order
      }
    });
  });

  static getOrderById = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    const { id } = req.params;
    const order = await OrderService.getOrderById(id, userId);

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  });

  static getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    const orders = await OrderService.getUserOrders(userId);

    res.status(200).json({
      success: true,
      data: {
        orders,
        count: orders.length
      }
    });
  });

  static getAllOrdersAdmin = asyncHandler(async (req, res) => {
    const { status, search } = req.query;
    const orders = await OrderService.getAllOrdersAdmin({ status, search });

    res.status(200).json({
      success: true,
      data: {
        orders,
        count: orders.length
      }
    });
  });

  static getOrderStatsAdmin = asyncHandler(async (req, res) => {
    const stats = await OrderService.getOrderStatsAdmin();

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });
  });

  static updateOrderStatusAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await OrderService.updateOrderStatusAdmin(id, status);

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: {
        order
      }
    });
  });

  static deleteOrderAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await OrderService.deleteOrderAdmin(id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });
}

module.exports = { OrderController };


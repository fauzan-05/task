const { Router } = require('express');
const { OrderController } = require('../controllers/order.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createOrderSchema, getOrderSchema } = require('../validators/order.validator');

const router = Router();

// All order endpoints are protected
router.use(authenticate);

// Admin Routes (placed above /:id to prevent routing collision)
router.get('/admin/all', requireAdmin, OrderController.getAllOrdersAdmin);
router.get('/admin/stats', requireAdmin, OrderController.getOrderStatsAdmin);
router.patch('/admin/:id/status', requireAdmin, OrderController.updateOrderStatusAdmin);
router.delete('/admin/:id', requireAdmin, OrderController.deleteOrderAdmin);

// Customer Routes
router.post('/', validate(createOrderSchema), OrderController.createOrder);
router.get('/', OrderController.getUserOrders);
router.get('/:id', validate(getOrderSchema), OrderController.getOrderById);

module.exports = router;


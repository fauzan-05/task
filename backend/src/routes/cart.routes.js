const { Router } = require('express');
const { CartController } = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema
} = require('../validators/cart.validator');

const router = Router();

// All cart endpoints are protected
router.use(authenticate);

router.get('/', CartController.getCart);
router.post('/items', validate(addCartItemSchema), CartController.addItem);
router.patch('/items/:productId', validate(updateCartItemSchema), CartController.updateItemQuantity);
router.delete('/items/:productId', validate(removeCartItemSchema), CartController.removeItem);
router.delete('/', CartController.clearCart);

module.exports = router;

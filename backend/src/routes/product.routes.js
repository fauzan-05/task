const { Router } = require('express');
const { ProductController } = require('../controllers/product.controller');

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/categories', ProductController.getCategories);
router.get('/:id', ProductController.getProductById);

module.exports = router;

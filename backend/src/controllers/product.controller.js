const { ProductService } = require('../services/product.service');
const { asyncHandler } = require('../utils/asyncHandler');

class ProductController {
  static getProducts = asyncHandler(async (req, res) => {
    const { category, search } = req.query;
    const products = await ProductService.getAllProducts({
      category: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined
    });

    res.status(200).json({
      success: true,
      data: {
        products,
        count: products.length
      }
    });
  });

  static getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await ProductService.getProductById(id);

    res.status(200).json({
      success: true,
      data: {
        product
      }
    });
  });

  static getCategories = asyncHandler(async (req, res) => {
    const categories = await ProductService.getCategories();

    res.status(200).json({
      success: true,
      data: {
        categories
      }
    });
  });
}

module.exports = { ProductController };

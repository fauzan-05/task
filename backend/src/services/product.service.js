const mongoose = require('mongoose');
const { Product } = require('../models/Product');
const { ApiError } = require('../utils/ApiError');

class ProductService {
  static async getAllProducts(query) {
    const filter = {};

    if (query?.category && query.category !== 'all') {
      filter.category = new RegExp(`^${query.category.trim()}$`, 'i');
    }

    if (query?.search && query.search.trim() !== '') {
      filter.$or = [
        { name: { $regex: query.search.trim(), $options: 'i' } },
        { description: { $regex: query.search.trim(), $options: 'i' } },
        { category: { $regex: query.search.trim(), $options: 'i' } }
      ];
    }

    return Product.find(filter).sort({ createdAt: -1 });
  }

  static async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid product ID format');
    }

    const product = await Product.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    return product;
  }

  static async getCategories() {
    return Product.distinct('category');
  }
}

module.exports = { ProductService };

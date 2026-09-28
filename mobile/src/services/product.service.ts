import { api } from './api';
import { Product } from '../types';

export interface GetProductsParams {
  category?: string;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

export const productService = {
  /**
   * Fetch list of products with optional category and search filters
   * GET /api/products
   */
  async getProducts(params?: GetProductsParams): Promise<{ products: Product[]; count: number }> {
    return api.get<{ products: Product[]; count: number }>('/products', { params });
  },

  /**
   * Fetch single product details by ID
   * GET /api/products/:id
   */
  async getProductById(id: string): Promise<{ product: Product }> {
    return api.get<{ product: Product }>(`/products/${id}`);
  },

  /**
   * Fetch list of distinct product categories
   * GET /api/products/categories
   */
  async getCategories(): Promise<{ categories: string[] }> {
    return api.get<{ categories: string[] }>('/products/categories');
  },
};

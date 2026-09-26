import { api } from '@/lib/api';
import { Product } from '@/types';

export interface GetProductsParams {
  category?: string;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

export const productService = {
  async getProducts(params?: GetProductsParams): Promise<{ products: Product[]; count: number }> {
    return api.get<{ products: Product[]; count: number }>('/products', { params });
  },

  async getProductById(id: string): Promise<{ product: Product }> {
    return api.get<{ product: Product }>(`/products/${id}`);
  },

  async getCategories(): Promise<{ categories: string[] }> {
    return api.get<{ categories: string[] }>('/products/categories');
  },
};

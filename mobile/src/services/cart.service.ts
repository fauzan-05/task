import { api } from './api';
import { Cart } from '../types';

export const cartService = {
  /**
   * Fetch active user's cart
   * GET /api/cart
   */
  async getCart(): Promise<Cart> {
    return api.get<Cart>('/cart');
  },

  /**
   * Add a product to cart with quantity
   * POST /api/cart/items
   */
  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    return api.post<Cart>('/cart/items', { productId, quantity });
  },

  /**
   * Update quantity of a cart item
   * PATCH /api/cart/items/:productId
   */
  async updateQuantity(productId: string, quantity: number): Promise<Cart> {
    return api.patch<Cart>(`/cart/items/${productId}`, { quantity });
  },

  /**
   * Remove an item from the cart
   * DELETE /api/cart/items/:productId
   */
  async removeFromCart(productId: string): Promise<Cart> {
    return api.delete<Cart>(`/cart/items/${productId}`);
  },

  /**
   * Clear all items from the cart
   * DELETE /api/cart
   */
  async clearCart(): Promise<Cart> {
    return api.delete<Cart>('/cart');
  },
};

import { api } from '@/lib/api';
import { Cart } from '@/types';

export const cartService = {
  async getCart(): Promise<Cart> {
    return api.get<Cart>('/cart');
  },

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    return api.post<Cart>('/cart/items', { productId, quantity });
  },

  async updateQuantity(productId: string, quantity: number): Promise<Cart> {
    return api.patch<Cart>(`/cart/items/${productId}`, { quantity });
  },

  async removeFromCart(productId: string): Promise<Cart> {
    return api.delete<Cart>(`/cart/items/${productId}`);
  },

  async clearCart(): Promise<Cart> {
    return api.delete<Cart>('/cart');
  },
};

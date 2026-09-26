import { api } from '@/lib/api';
import { Order, OrderStats, ShippingAddress } from '@/types';

export const orderService = {
  async createOrder(shippingAddress: ShippingAddress): Promise<{ order: Order }> {
    return api.post<{ order: Order }>('/orders', { shippingAddress });
  },

  async getOrderById(id: string): Promise<{ order: Order }> {
    return api.get<{ order: Order }>(`/orders/${id}`);
  },

  async getUserOrders(): Promise<{ orders: Order[]; count: number }> {
    return api.get<{ orders: Order[]; count: number }>('/orders');
  },

  // Admin Methods
  async getAllOrdersAdmin(params?: { status?: string; search?: string }): Promise<{ orders: Order[]; count: number }> {
    return api.get<{ orders: Order[]; count: number }>('/orders/admin/all', { params });
  },

  async getOrderStatsAdmin(): Promise<{ stats: OrderStats }> {
    return api.get<{ stats: OrderStats }>('/orders/admin/stats');
  },

  async updateOrderStatusAdmin(id: string, status: string): Promise<{ order: Order }> {
    return api.patch<{ order: Order }>(`/orders/admin/${id}/status`, { status });
  },

  async deleteOrderAdmin(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/orders/admin/${id}`);
  },
};


export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  badge?: string;
  colors?: string[];
  rating?: number;
  reviewsCount?: number;
  isBestseller?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isAvailable: boolean;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  stack?: string;
}

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart } from '@/types';
import { cartService } from '@/services/cart.service';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  totalAmount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      // User might be unauthenticated or cart empty
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
    if (!isAuthenticated) {
      showError('Please login to add items to your cart.');
      return false;
    }

    try {
      setIsLoading(true);
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCart(updatedCart);
      showSuccess(`Added to cart!`);
      return true;
    } catch (err: any) {
      showError(err.message || 'Failed to add item to cart.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      setCart(updatedCart);
      return true;
    } catch (err: any) {
      showError(err.message || 'Failed to update quantity.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
      showSuccess('Item removed from cart.');
      return true;
    } catch (err: any) {
      showError(err.message || 'Failed to remove item.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
      return true;
    } catch (err: any) {
      showError(err.message || 'Failed to clear cart.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalAmount = cart?.totalAmount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalAmount,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

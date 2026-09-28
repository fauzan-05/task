import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart } from '../types';
import { cartService } from '../services/cart.service';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  totalQuantity: number;
  totalAmount: number;
  isLoading: boolean;
  isUpdatingItemId: string | null;
  error: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateQuantity: (productId: string, quantity: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  removeFromCart: (productId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  clearCart: () => Promise<{ success: boolean; message?: string; error?: string }>;
  refreshCart: (silent?: boolean) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdatingItemId, setIsUpdatingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch active cart from backend
   */
  const fetchCart = useCallback(
    async (silent = false) => {
      if (!isAuthenticated) {
        setCart(null);
        setError(null);
        return;
      }

      try {
        if (!silent) setIsLoading(true);
        setError(null);
        const data = await cartService.getCart();
        setCart(data);
      } catch (err: any) {
        console.warn('[CartContext] fetchCart error:', err);
        if (err.statusCode === 401) {
          await logout();
        } else {
          setError(err.message || 'Unable to load cart. Please try again.');
        }
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [isAuthenticated, logout]
  );

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /**
   * Add Item to Cart
   */
  const addToCart = async (
    productId: string,
    quantity: number = 1
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required. Please login first.' };
    }

    try {
      setIsUpdatingItemId(productId);
      setError(null);
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCart(updatedCart);
      return { success: true, message: 'Item added to cart!' };
    } catch (err: any) {
      const msg = err.message || 'Failed to add item to cart.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsUpdatingItemId(null);
    }
  };

  /**
   * Update Item Quantity
   */
  const updateQuantity = async (
    productId: string,
    quantity: number
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required. Please login first.' };
    }

    try {
      setIsUpdatingItemId(productId);
      setError(null);
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      setCart(updatedCart);
      return { success: true, message: 'Cart updated.' };
    } catch (err: any) {
      const msg = err.message || 'Failed to update item quantity.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsUpdatingItemId(null);
    }
  };

  /**
   * Remove Item from Cart
   */
  const removeFromCart = async (
    productId: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required. Please login first.' };
    }

    try {
      setIsUpdatingItemId(productId);
      setError(null);
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
      return { success: true, message: 'Item removed from cart.' };
    } catch (err: any) {
      const msg = err.message || 'Failed to remove item from cart.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsUpdatingItemId(null);
    }
  };

  /**
   * Clear All Items in Cart
   */
  const clearCart = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required. Please login first.' };
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
      return { success: true, message: 'Cart cleared.' };
    } catch (err: any) {
      const msg = err.message || 'Failed to clear cart.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const totalQuantity = cart?.totalQuantity ?? 0;
  const totalAmount = cart?.totalAmount ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        totalQuantity,
        totalAmount,
        isLoading,
        isUpdatingItemId,
        error,
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

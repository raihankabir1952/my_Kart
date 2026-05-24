'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { CartItem } from '@/types/cart';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (productId: string, quantity: number) => Promise<void>;        // ← renamed
  addToCart: (productId: string, quantity: number) => Promise<void>;      // ← alias for backward compat
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get<CartItem[]>('/cart');
      setItems(res.data);
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Main add function
  const addItem = async (productId: string, quantity: number) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    try {
      await api.post('/cart', { productId, quantity });
      await refresh();
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add');
    }
  };

  // Alias for backward compatibility
  const addToCart = addItem;

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await api.patch(`/cart/${itemId}`, { quantity });
      await refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await refresh();
      toast.success('Item removed');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Remove failed');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setItems([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Clear failed');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        totalItems,
        subtotal,
        addItem,        // ← new
        addToCart,      // ← alias
        updateQuantity,
        removeItem,
        clearCart,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
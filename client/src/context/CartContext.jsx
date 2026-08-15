import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const getSessionId = () => {
    let sid = localStorage.getItem('nexora_session_id');
    if (!sid) {
      sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      localStorage.setItem('nexora_session_id', sid);
    }
    return sid;
  };

  const fetchCart = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      const res = await api.get('/cart', { params: { sessionId } });
      if (res.success && res.data.cart) {
        setCartItems(res.data.cart.items || []);
      } else {
        const local = JSON.parse(localStorage.getItem('nexora_guest_cart') || '[]');
        setCartItems(local);
      }
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('nexora_guest_cart') || '[]');
      setCartItems(local);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    try {
      const sessionId = getSessionId();
      const res = await api.post('/cart/add', {
        productId: product.id,
        quantity,
        sessionId
      });

      if (res.success) {
        showToast(`Added ${product.name} to your cart`, 'success');
        fetchCart();
        setIsDrawerOpen(true);
      }
    } catch (err) {
      // Guest localStorage fallback
      const current = JSON.parse(localStorage.getItem('nexora_guest_cart') || '[]');
      const existing = current.find(item => item.product.id === product.id);

      let updated;
      if (existing) {
        updated = current.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...current, { id: 'local_' + Date.now(), product, quantity, price: product.salePrice || product.price }];
      }

      localStorage.setItem('nexora_guest_cart', JSON.stringify(updated));
      setCartItems(updated);
      showToast(`Added ${product.name} to cart`, 'success');
      setIsDrawerOpen(true);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(itemId);
    }
    try {
      if (typeof itemId === 'string' && itemId.startsWith('local_')) {
        const current = JSON.parse(localStorage.getItem('nexora_guest_cart') || '[]');
        const updated = current.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item);
        localStorage.setItem('nexora_guest_cart', JSON.stringify(updated));
        setCartItems(updated);
        return;
      }

      const res = await api.put(`/cart/item/${itemId}`, { quantity: newQuantity });
      if (res.success) {
        fetchCart();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (typeof itemId === 'string' && itemId.startsWith('local_')) {
        const current = JSON.parse(localStorage.getItem('nexora_guest_cart') || '[]');
        const updated = current.filter(item => item.id !== itemId);
        localStorage.setItem('nexora_guest_cart', JSON.stringify(updated));
        setCartItems(updated);
        showToast('Item removed from cart', 'info');
        return;
      }

      const res = await api.delete(`/cart/item/${itemId}`);
      if (res.success) {
        showToast('Item removed from cart', 'info');
        fetchCart();
      }
    } catch (err) {
      showToast('Failed to remove item', 'error');
    }
  };

  const clearCart = () => {
    localStorage.removeItem('nexora_guest_cart');
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price || item.product?.salePrice || item.product?.price || 0);
    return acc + (price * item.quantity);
  }, 0);

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      itemCount,
      isDrawerOpen,
      setIsDrawerOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

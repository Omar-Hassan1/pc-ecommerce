import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      const local = JSON.parse(localStorage.getItem('nexora_guest_wishlist') || '[]');
      setWishlistItems(local);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.success && res.data.items) {
        setWishlistItems(res.data.items.map(item => item.product || item));
      }
    } catch (err) {
      console.warn('Failed to fetch wishlist');
    }
  };

  const toggleWishlist = async (product) => {
    if (user) {
      try {
        const res = await api.post('/wishlist/toggle', { productId: product.id });
        if (res.success) {
          showToast(res.message, 'info');
          fetchWishlist();
        }
      } catch (err) {
        showToast('Failed to update wishlist', 'error');
      }
    } else {
      const current = JSON.parse(localStorage.getItem('nexora_guest_wishlist') || '[]');
      const exists = current.some(p => p.id === product.id);

      let updated;
      if (exists) {
        updated = current.filter(p => p.id !== product.id);
        showToast('Product removed from wishlist', 'info');
      } else {
        updated = [...current, product];
        showToast('Product saved to wishlist', 'success');
      }

      localStorage.setItem('nexora_guest_wishlist', JSON.stringify(updated));
      setWishlistItems(updated);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId || item.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

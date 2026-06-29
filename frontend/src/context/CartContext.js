'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('syncgifts_cart');
    const savedWishlist = localStorage.getItem('syncgifts_wishlist');
    const savedSearches = localStorage.getItem('syncgifts_searches');
    const savedViewed = localStorage.getItem('syncgifts_viewed');

    Promise.resolve().then(() => {
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
      }
      if (savedWishlist) {
        try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { console.error(e); }
      }
      if (savedSearches) {
        try { setRecentSearches(JSON.parse(savedSearches)); } catch (e) { console.error(e); }
      }
      if (savedViewed) {
        try { setRecentlyViewed(JSON.parse(savedViewed)); } catch (e) { console.error(e); }
      }
    });
  }, []);

  // Sync state helpers
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('syncgifts_cart', JSON.stringify(newCart));
  };

  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('syncgifts_wishlist', JSON.stringify(newWishlist));
  };

  const saveSearches = (newSearches) => {
    setRecentSearches(newSearches);
    localStorage.setItem('syncgifts_searches', JSON.stringify(newSearches));
  };

  const saveViewed = (newViewed) => {
    setRecentlyViewed(newViewed);
    localStorage.setItem('syncgifts_viewed', JSON.stringify(newViewed));
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    const newCart = [...cart];
    const idx = newCart.findIndex(item => item.id === product.id);
    if (idx !== -1) {
      // Check stock limit
      const targetQty = newCart[idx].quantity + quantity;
      newCart[idx].quantity = Math.min(targetQty, product.quantity || Infinity);
    } else {
      newCart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: Math.min(quantity, product.quantity || Infinity)
      });
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    const isExist = wishlist.some(item => item.id === product.id);
    let newWishlist;
    if (isExist) {
      newWishlist = wishlist.filter(item => item.id !== product.id);
    } else {
      newWishlist = [...wishlist, {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
        rating: product.rating,
        quantity: product.quantity
      }];
    }
    saveWishlist(newWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Recent searches tracking
  const addRecentSearch = (query) => {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();
    const filtered = recentSearches.filter(q => q.toLowerCase() !== cleanQuery.toLowerCase());
    const newSearches = [cleanQuery, ...filtered].slice(0, 8); // Keep last 8 searches
    saveSearches(newSearches);
  };

  const clearRecentSearches = () => {
    saveSearches([]);
  };

  // Recently Viewed products
  const addRecentlyViewed = (product) => {
    if (!product || !product.id) return;
    const filtered = recentlyViewed.filter(p => p.id !== product.id);
    const newViewed = [{
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl,
      rating: product.rating
    }, ...filtered].slice(0, 6); // Keep last 6 products
    saveViewed(newViewed);
  };

  // Summary stats
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      recentSearches,
      recentlyViewed,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      addRecentSearch,
      clearRecentSearches,
      addRecentlyViewed,
      cartCount,
      cartSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

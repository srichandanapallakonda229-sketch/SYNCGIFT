'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  ShoppingBag, 
  Star, 
  ArrowUpDown, 
  RefreshCw, 
  Trash2,
  Bookmark
} from 'lucide-react';

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist, addRecentSearch, recentSearches, clearRecentSearches } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState('1999');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState('All');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popularity');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
    'All',
    'Birthday Gifts',
    'Wedding Gifts',
    'Anniversary Gifts',
    'Baby Shower',
    'Housewarming',
    'Festivals',
    'Corporate Gifts',
    'Spiritual Gifts'
  ];

  const [filterBestSeller, setFilterBestSeller] = useState(false);
  const [filterPersonalized, setFilterPersonalized] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Construct query parameters
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (minRating && minRating !== 'All') params.append('rating', minRating);
      if (sortBy) params.append('sortBy', sortBy);

      const data = await api.get(`/products?${params.toString()}`);
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products from Express backend:", err.message);
      // Fallback is handled inside backend, but if backend is completely offline:
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, minRating, sortBy]);

  // Reload products whenever filters or sorts change
  useEffect(() => {
    Promise.resolve().then(() => {
      loadProducts();
    });
  }, [loadProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      addRecentSearch(search);
      
      // Update URL query parameters
      const params = new URLSearchParams();
      params.append('search', search);
      params.append('category', 'All');
      if (sortBy) params.append('sortBy', sortBy);
      router.push(`/catalog?${params.toString()}`);
      
      if (category !== 'All') {
        setCategory('All');
        return; // The category state change will trigger loadProducts via useEffect
      }
    }
    loadProducts();
  };

  const handleRecentSearchClick = (q) => {
    setSearch(q);
    setCategory('All');
    
    // Update URL query parameters
    const params = new URLSearchParams();
    if (q) params.append('search', q);
    params.append('category', 'All');
    if (sortBy) params.append('sortBy', sortBy);
    router.push(`/catalog?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('1999');
    setMaxPrice(10000);
    setMinRating('All');
    setSortBy('popularity');
    // Clear URL params
    router.push('/catalog');
    // Reload
    setLoading(true);
    api.get('/products?minPrice=1999&maxPrice=10000').then(data => {
      setProducts(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleBuyNow = (product) => {
    router.push(`/checkout?productId=${product.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      {/* Header Title */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Our Collection</span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">SyncGifts Shelf</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Find a premium selection of smart and luxury gifts for all memorable occasions.</p>
      </div>

      {/* Search and Sort panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS (Desktop) */}
        <div className="hidden lg:block space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h3>
              <button 
                onClick={clearAllFilters}
                className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Categories filter */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold text-zinc-100 dark:text-zinc-100">Category</h4>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`block w-full text-left text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                      category === cat 
                        ? 'bg-sky-500/25 text-sky-400 border border-sky-500/20' 
                        : 'text-zinc-300 hover:bg-zinc-800/40 hover:text-white dark:text-zinc-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter (Range Slider) */}
            <div className="space-y-3.5 pt-2 border-t border-zinc-200/30 dark:border-zinc-800/30">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-zinc-100 dark:text-zinc-100">Price Budget</h4>
                <span className="text-xxs font-bold text-sky-400">Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1999"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-xxs font-bold text-zinc-400">
                <span>₹1,999</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-200/30 dark:border-zinc-800/30">
              <h4 className="text-xs font-extrabold text-zinc-100 dark:text-zinc-100">Minimum Rating</h4>
              <div className="flex flex-wrap gap-1.5">
                {['All', '4.5', '4.0', '3.5'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`text-xxs font-bold px-2.5 py-1.5 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                      minRating === r 
                        ? 'border-violet-600 bg-violet-600/10 text-violet-600 dark:border-violet-400 dark:bg-violet-500/15 dark:text-violet-400' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{r === 'All' ? 'All' : `${r}+`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Best Seller & Personalized Quick Filters */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-200/30 dark:border-zinc-800/30">
              <h4 className="text-xs font-extrabold text-zinc-100 dark:text-zinc-100">Special Filters</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setFilterBestSeller(!filterBestSeller)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    filterBestSeller
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'text-zinc-300 hover:bg-zinc-800/40 border border-transparent'
                  }`}
                >
                  🔥 Best Sellers Only
                </button>
                <button
                  onClick={() => setFilterPersonalized(!filterPersonalized)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    filterPersonalized
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-zinc-300 hover:bg-zinc-800/40 border border-transparent'
                  }`}
                >
                  ✏️ Personalizable Only
                </button>
              </div>
            </div>
          </div>

          {/* Recent Searches (cached client side) */}
          {recentSearches.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200/30 dark:border-zinc-800/30">
                <h4 className="text-xs font-extrabold text-zinc-800 dark:text-zinc-300 flex items-center gap-1">
                  <Bookmark className="h-3.5 w-3.5 text-fuchsia-500" /> Recents
                </h4>
                <button onClick={clearRecentSearches} className="text-zinc-400 hover:text-rose-500 cursor-pointer">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentSearchClick(term)}
                    className="text-xxs font-semibold px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-850 hover:bg-violet-500/15 hover:text-violet-500 dark:hover:text-violet-400 cursor-pointer transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PRODUCTS VIEWPORT */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search gifts, categories, templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 text-sm shadow-sm transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3.5 py-1.5 text-xxs font-bold text-white shadow-sm"
              >
                Go
              </button>
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-4 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filter
              </button>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-zinc-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs p-2.5 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                >
                  <option value="popularity">Sort by Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="latest">Latest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid list */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
              <p className="text-xs text-zinc-500 animate-pulse">Scanning inventory shelves...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel text-center py-20 px-8 rounded-3xl space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 mx-auto">
                <ShoppingBag className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">No items found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                We couldn&apos;t find any gifts matching your selection. Try clearing filters or try searching for keywords like &ldquo;vinyl&rdquo;, &ldquo;rose&rdquo;, or &ldquo;projector&rdquo;.
              </p>
              <button
                onClick={clearAllFilters}
                className="py-2.5 px-6 bg-violet-600 text-white rounded-full text-xs font-bold hover:bg-violet-700 transition-all cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {products
                  .filter(p => !filterBestSeller || p.isBestSeller)
                  .filter(p => !filterPersonalized || p.isPersonalized)
                  .map((p) => {
                  const isWish = isInWishlist(p.id);
                  const isOutOfStock = p.quantity <= 0;
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="glass-card flex flex-col justify-between rounded-3xl overflow-hidden group"
                    >
                      {/* Product Image and badges */}
                      <div className="relative h-56 w-full overflow-hidden bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-full w-full object-cover group-hover:scale-108 transition-all duration-500 ease-out"
                        />
                        {/* Out of Stock banner */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        {/* Best Seller Badge */}
                        {p.isBestSeller && (
                          <span className="absolute top-4 left-4 rounded-full bg-orange-500 px-2.5 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wide shadow-md">
                            🔥 Best Seller
                          </span>
                        )}
                        {/* Personalized Badge */}
                        {p.isPersonalized && (
                          <span className="absolute top-4 left-4 mt-6 rounded-full bg-purple-600 px-2.5 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wide shadow-md" style={{top: p.isBestSeller ? '42px' : '16px'}}>
                            ✏️ Personalizable
                          </span>
                        )}
                        <button
                          onClick={() => toggleWishlist(p)}
                          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur-md text-zinc-700 hover:text-rose-500 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:text-rose-400 transition-colors shadow-sm cursor-pointer z-10"
                        >
                          <Heart className={`h-4.5 w-4.5 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <span className="absolute bottom-4 left-4 rounded-lg bg-zinc-950/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                          {p.category}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-extrabold text-sm text-zinc-100 dark:text-white line-clamp-1 group-hover:text-sky-400 transition-colors">
                              {p.name}
                            </h3>
                            <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold shrink-0">
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              <span>{p.rating}</span>
                            </div>
                          </div>
                          <p className="text-xxs text-zinc-300 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                          <div className="flex gap-4 mt-3">
                            <span className="text-[10px] text-zinc-400 font-medium">
                              Qty Available: <strong className="text-zinc-200 dark:text-zinc-200">{p.quantity}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-extrabold text-zinc-100 dark:text-white">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            <span className={`text-[10px] font-bold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {isOutOfStock ? 'Unavailable' : 'In Stock'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => addToCart(p, 1)}
                              disabled={isOutOfStock}
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 border border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white disabled:border-zinc-300 disabled:text-zinc-400 disabled:hover:bg-transparent dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-500 dark:hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" /> Cart
                            </button>
                            <button
                              onClick={() => handleBuyNow(p)}
                              disabled={isOutOfStock}
                              className="w-full py-2.5 px-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white disabled:from-zinc-300 disabled:to-zinc-300 disabled:text-zinc-400 rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 cursor-pointer"
                            >
                              Order Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS DRAWER (Modal overlay) */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs p-0 lg:hidden animate-in fade-in duration-200">
          <div className="w-80 h-full bg-white dark:bg-zinc-950 p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-600"
                >
                  Close
                </button>
              </div>

              {/* Category */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold text-zinc-800 dark:text-zinc-300">Category</h4>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-xxs px-2.5 py-1.5 rounded-lg border font-medium cursor-pointer transition-all ${
                        category === cat 
                          ? 'border-violet-600 bg-violet-600/10 text-violet-600 dark:border-violet-400 dark:bg-violet-500/15 dark:text-violet-400' 
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

               {/* Budget Slider Mobile */}
               <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                 <div className="flex justify-between items-center">
                   <h4 className="text-xs font-extrabold text-zinc-800 dark:text-zinc-300">Price Budget</h4>
                   <span className="text-xxs font-bold text-violet-650 dark:text-violet-400">Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
                 </div>
                 <input
                   type="range"
                   min="1999"
                   max="10000"
                   step="100"
                   value={maxPrice}
                   onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                   className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-violet-600"
                 />
                 <div className="flex justify-between text-xxs font-bold text-zinc-400 dark:text-zinc-500">
                   <span>₹1,999</span>
                   <span>₹10,000</span>
                 </div>
               </div>

              {/* Ratings */}
              <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="text-xs font-extrabold text-zinc-800 dark:text-zinc-300">Minimum Rating</h4>
                <div className="flex gap-1.5">
                  {['All', '4.5', '4.0', '3.5'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`text-xxs font-bold px-2.5 py-1.5 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                        minRating === r 
                          ? 'border-violet-600 bg-violet-600/10 text-violet-600 dark:border-violet-400 dark:bg-violet-500/15 dark:text-violet-400' 
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{r === 'All' ? 'All' : `${r}+`}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-6">
              <button
                onClick={() => {
                  loadProducts();
                  setShowMobileFilters(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-xs text-zinc-500">Loading catalog viewport...</p>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}

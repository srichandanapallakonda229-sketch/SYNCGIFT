'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  Lock, 
  Mail, 
  Calendar,
  CheckCircle,
  Truck,
  Bookmark,
  LogOut,
  ChevronRight,
  Shield,
  Sparkles,
  Search,
  Settings,
  RefreshCw,
  Trash2
} from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout, loginMock } = useAuth();
  const { wishlist, toggleWishlist, addToCart, recentSearches, clearRecentSearches } = useCart();
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'wishlist', 'settings'
  const [usernameInput, setUsernameInput] = useState('');

  const loadUserOrders = useCallback(async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const history = await api.get(`/orders/user/${user.id}`);
      setOrders(history || []);
    } catch (err) {
      console.error("Failed to load user order history:", err.message);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      Promise.resolve().then(() => {
        setUsernameInput(user.name);
        loadUserOrders();
      });
    }
  }, [user, loadUserOrders]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert("Profile details updated successfully (Mock State Updated)!");
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 text-center space-y-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 mx-auto">
          <UserIcon className="h-8 w-8" />
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Dashboard Locked</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Please log in to review your profile settings, recent searches, wishlist items, and order history.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={() => loginMock('user')}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer"
          >
            Simulate Customer Sign In
          </button>
          <button
            onClick={() => loginMock('admin')}
            className="w-full py-3.5 border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 rounded-2xl text-xs font-bold cursor-pointer"
          >
            Simulate Admin Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow">
      {/* Dashboard Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
            alt={user.name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-violet-500 shadow-inner"
          />
          <div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-violet-600/10 text-violet-600 border border-violet-600/20'}`}>
                {user.role}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5 justify-center md:justify-start">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {user.role === 'admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="py-2.5 px-5 rounded-full text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
            >
              Admin Board
            </button>
          )}
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="py-2.5 px-5 rounded-full text-xs font-bold text-rose-600 bg-rose-500/10 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* NAV TABS (Sidebar) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-4 rounded-3xl space-y-1.5">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex w-full items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5" /> Order History
              </span>
              <span className="text-[10px] font-black opacity-80">{orders.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex w-full items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart className="h-4.5 w-4.5" /> Saved Wishlist
              </span>
              <span className="text-[10px] font-black opacity-80">{wishlist.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex w-full items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="h-4.5 w-4.5" /> Account Settings
              </span>
            </button>
          </div>

          {/* Recent Searches cache block */}
          {recentSearches.length > 0 && (
            <div className="glass-panel p-5 rounded-3xl space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200/50 dark:border-zinc-850">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4 text-fuchsia-500" /> Recents
                </h4>
                <button 
                  onClick={clearRecentSearches}
                  className="text-[10px] font-bold text-zinc-400 hover:text-rose-500 cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(`/catalog?search=${encodeURIComponent(term)}`)}
                    className="flex items-center gap-1.5 text-xxs font-bold text-zinc-600 dark:text-zinc-400 hover:text-violet-500 hover:translate-x-1 transition-all text-left"
                  >
                    <Search className="h-3 w-3 text-zinc-400" /> {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DETAILS CONTAINER */}
        <div className="lg:col-span-3">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">Order Tracking</h2>
                <button 
                  onClick={loadUserOrders}
                  className="text-xxs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" /> Refresh Logs
                </button>
              </div>

              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <RefreshCw className="h-6 w-6 text-violet-500 animate-spin" />
                  <p className="text-xxs text-zinc-500">Querying transaction blocks...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="glass-panel text-center py-16 px-6 rounded-3xl space-y-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 mx-auto">
                    <ShoppingBag className="h-5 w-5" />
                  </span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">No orders yet</h3>
                  <p className="text-xxs text-zinc-500 max-w-xs mx-auto">
                    Any packages you buy will show up here with active statuses and WhatsApp notification loggers.
                  </p>
                  <button
                    onClick={() => router.push('/catalog')}
                    className="py-2 px-5 bg-violet-600 text-white rounded-full text-[10px] font-bold"
                  >
                    Browse Gifts Shop
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });
                    
                    let statusColor = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
                    if (order.status === 'Pending') statusColor = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
                    if (order.status === 'Processing') statusColor = 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
                    if (order.status === 'Shipped') statusColor = 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
                    if (order.status === 'Delivered') statusColor = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
                    if (order.status === 'Cancelled') statusColor = 'bg-rose-500/10 text-rose-500 border border-rose-500/20';

                    return (
                      <div 
                        key={order.id}
                        className="glass-panel p-5 rounded-3xl space-y-4"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
                          <div>
                            <span className="text-[10px] font-bold text-zinc-400">Order ID: <strong className="text-zinc-700 dark:text-zinc-300">{order.id}</strong></span>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                              <span className="text-xxs font-semibold text-zinc-500">{orderDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-xxs font-bold uppercase tracking-wider ${statusColor}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order items */}
                        <div className="space-y-3">
                          {order.products.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="h-10 w-10 rounded-lg object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate">
                                    {item.name}
                                  </h4>
                                  <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-zinc-900 dark:text-white shrink-0">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer summary */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-zinc-200/30 dark:border-zinc-800/30 gap-3">
                          <div className="text-[10px] text-zinc-400 leading-normal">
                            <p><strong>Ship to:</strong> {order.shippingAddress}</p>
                            <p><strong>Phone:</strong> {order.contactPhone}</p>
                          </div>
                          
                          <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-4 self-end">
                            <span className="text-xxs font-bold text-zinc-400">Total Charged:</span>
                            <span className="text-base font-black text-violet-600 dark:text-violet-400">
                              ₹{order.totalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">Saved Wishlist</h2>

              {wishlist.length === 0 ? (
                <div className="glass-panel text-center py-16 px-6 rounded-3xl space-y-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 mx-auto">
                    <Heart className="h-5 w-5" />
                  </span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">Your wishlist is empty</h3>
                  <p className="text-xxs text-zinc-500 max-w-xs mx-auto">
                    Save products that you love here to easily grab them later or add them to your cart.
                  </p>
                  <button
                    onClick={() => router.push('/catalog')}
                    className="py-2 px-5 bg-violet-600 text-white rounded-full text-[10px] font-bold"
                  >
                    Go to Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div 
                      key={item.id}
                      className="glass-panel p-4 rounded-3xl flex justify-between items-center gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-14 w-14 rounded-2xl object-cover border border-zinc-200/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <p className="text-xxs font-extrabold text-violet-600 dark:text-violet-400 mt-0.5">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            addToCart(item, 1);
                            alert(`Added ${item.name} to cart!`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-750 text-white text-[10px] font-bold cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-rose-500 dark:hover:bg-zinc-900 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">Account Settings</h2>

              <div className="glass-panel p-6 sm:p-8 rounded-3xl">
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Display Name</label>
                    <input
                      type="text"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-400 font-semibold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Access Role</label>
                    <div className="flex items-center gap-2 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-xs font-semibold">
                      <Shield className="h-4.5 w-4.5 text-violet-500" />
                      <span className="capitalize">{user.role} Authorization Status</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="py-3 px-6 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

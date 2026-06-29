'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  User as UserIcon, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  ShieldAlert,
  Moon, 
  Sun,
  MapPin,
  Lock
} from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  const pathname = usePathname();
  const { user, loginMock, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Gift Catalog', path: '/catalog' },
    { name: 'AI Gift Assistant', path: '/chat', icon: Sparkles },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const handleSimulatedLogin = async (role) => {
    try {
      await loginMock(role);
      setShowAuthModal(false);
    } catch (e) {
      alert('Mock login failed: ' + e.message);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/70 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-md">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </span>
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 bg-clip-text text-xl font-bold tracking-wider text-transparent dark:from-violet-400 dark:to-cyan-300">
                  SyncGifts
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-violet-600/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400' 
                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900/60'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 text-fuchsia-500" />}
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Utilities / Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              {/* Wishlist */}
              <Link
                href="/dashboard"
                className="relative p-2 text-zinc-600 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] font-bold text-white shadow-sm shadow-violet-500">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account / Profile */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 rounded-full border border-zinc-200/80 p-1 pr-3 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-all cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover shadow-inner"
                    />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-zinc-200/50 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/95 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10 transition-colors"
                        >
                          <ShieldAlert className="h-4 w-4" />
                          Admin Console
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        My Dashboard
                      </Link>
                      <hr className="my-1 border-zinc-100 dark:border-zinc-800" />
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileDropdown(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="neon-btn rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-violet-500/20 hover:shadow-violet-500/35 cursor-pointer"
                >
                  Join / Sign In
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="flex md:hidden items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-950 transition-all rounded-lg"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-medium ${
                  pathname === link.path 
                    ? 'bg-violet-600/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400' 
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-zinc-200 dark:border-zinc-800" />
            
            <div className="flex items-center justify-around py-2">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <Heart className="h-5 w-5 text-rose-500" /> Wishlist ({wishlist.length})
              </Link>
              <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <ShoppingBag className="h-5 w-5 text-violet-600" /> Cart ({cartCount})
              </Link>
            </div>
            
            <hr className="border-zinc-200 dark:border-zinc-800" />

            {user ? (
              <div className="space-y-1 pt-1">
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10"
                  >
                    <ShieldAlert className="h-5 w-5" /> Admin Console
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <LayoutDashboard className="h-5 w-5" /> My Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 text-left"
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-violet-500/15"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-250">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200/50 bg-white p-8 shadow-2xl dark:border-zinc-800/50 dark:bg-zinc-900 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">SyncGifts Portal</span>
              </div>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Welcome Back</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Log in to sync your wishlist, cart items, track orders, and utilize our smart AI Assistant.
              </p>
            </div>

            <div className="space-y-4">
              {/* Google Login (Disabled in local demo unless Firebase keys provided) */}
              <button
                onClick={() => alert("To use real Google Authentication, configure Firebase environment variables in frontend/.env.local first. For now, use the simulated login choices below!")}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
              >
                {/* Google SVG Icon */}
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-2.2 2.2l3.4 2.64c2-1.84 3.16-4.55 3.16-7.69z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.4-2.64c-.95.63-2.16 1.02-3.53 1.02-2.71 0-5.01-1.83-5.83-4.29H1.15v2.73C3.13 21.82 7.28 24 12 24z"/>
                  <path fill="#FBBC05" d="M6.17 15.18c-.21-.63-.33-1.3-.33-2s.12-1.37.33-2V8.45H1.15C.42 9.87 0 11.48 0 13s.42 3.13 1.15 4.55l5.02-3.37z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.93 1.19 15.24 0 12 0 7.28 0 3.13 4.18 1.15 8.45l5.02 3.37c.82-2.46 3.12-4.07 5.83-4.07z"/>
                </svg>
                Sign in with Google
              </button>

              <div className="flex items-center my-6">
                <hr className="flex-grow border-zinc-200 dark:border-zinc-800" />
                <span className="px-3 text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase">Demo Simulation Mode</span>
                <hr className="flex-grow border-zinc-200 dark:border-zinc-800" />
              </div>

              {/* Simulated Logins */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSimulatedLogin('user')}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-500/40 p-4 hover:bg-violet-600/5 hover:border-violet-500 transition-all text-left cursor-pointer"
                >
                  <UserIcon className="h-6 w-6 text-violet-500" />
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">As Customer</span>
                  <span className="text-[10px] text-zinc-500 text-center">Test cart, dashboard, and chat</span>
                </button>
                <button
                  onClick={() => handleSimulatedLogin('admin')}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-amber-500/40 p-4 hover:bg-amber-600/5 hover:border-amber-500 transition-all text-left cursor-pointer"
                >
                  <Lock className="h-6 w-6 text-amber-500" />
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">As Admin</span>
                  <span className="text-[10px] text-zinc-500 text-center">Manage products, orders, and Twilio</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                To test administrator features immediately, click <strong>As Admin</strong>. 
                Any email matching <code>*@syncgifts.com</code> is automatically assigned the Admin role.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

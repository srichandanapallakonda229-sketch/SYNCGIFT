'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  const [theme, setTheme] = useState('dark'); // Default to dark mode for premium look
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Determine active theme on load
    const savedTheme = localStorage.getItem('syncgifts_theme') || 'dark';
    
    const root = window.document.documentElement;
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    Promise.resolve().then(() => {
      setTheme(savedTheme);
      setMounted(true);
    });
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('syncgifts_theme', nextTheme);
    
    const root = window.document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Prevent hydration mismatch: render a clean shell until client mount is ready
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#090416] text-[#f1ecff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 animate-spin flex items-center justify-center">
            <div className="h-8 w-8 rounded-lg bg-zinc-950"></div>
          </div>
          <span className="text-sm font-semibold tracking-widest text-zinc-400 uppercase animate-pulse">SyncGifts is Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-grow flex flex-col w-full">
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

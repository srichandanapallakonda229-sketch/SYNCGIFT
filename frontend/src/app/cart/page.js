'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Gift, 
  Heart,
  Sparkles
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartCount,
    wishlist,
    addToCart
  } = useCart();

  const shippingFee = cartSubtotal >= 1500 || cartSubtotal === 0 ? 0 : 99;
  const platformFee = cartSubtotal > 0 ? 29 : 0;
  const totalAmount = cartSubtotal + shippingFee + platformFee;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 mx-auto">
          <ShoppingBag className="h-8 w-8" />
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Your Cart is Empty</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Looks like you haven&apos;t added anything to your cart yet. Ask our smart AI assistant or browse the shelf catalog for perfect recommendations.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/chat"
            className="py-3 px-6 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-md shadow-violet-500/10"
          >
            Ask AI Assistant
          </Link>
          <Link
            href="/catalog"
            className="py-3 px-6 rounded-full text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors"
          >
            Browse Catalog
          </Link>
        </div>

        {/* Saved Wishlist fallback */}
        {wishlist.length > 0 && (
          <div className="pt-12 text-left space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Heart className="h-4.5 w-4.5 text-rose-500 fill-rose-500" /> Saved in Wishlist
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {wishlist.map(p => (
                <div key={p.id} className="glass-panel p-4 rounded-2xl flex gap-3 items-center justify-between">
                  <div className="flex gap-3 items-center min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{p.name}</h4>
                      <p className="text-[10px] text-zinc-400">₹{p.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="p-2 rounded-xl bg-violet-600 text-white hover:bg-violet-750 text-xxs font-bold shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      <div className="mb-8">
        <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Shopping Bag</span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">Review Items</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Free shipping on orders above ₹1,500. Wrap options are customizable at checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART LIST */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div 
              key={item.id}
              className="glass-panel p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-center w-full sm:w-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-20 w-20 rounded-2xl object-cover border border-zinc-200/50 dark:border-zinc-800/50 shrink-0"
                />
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-violet-500">
                    {item.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs font-extrabold text-violet-600 dark:text-violet-400 mt-1">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Quantity controls and Actions */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t pt-3 sm:border-t-0 sm:pt-0 border-zinc-200/40">
                <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-full px-2 py-1 gap-3">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-zinc-900 dark:text-white min-w-[70px] text-right">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2.5 rounded-xl border border-zinc-200 text-zinc-400 hover:text-rose-500 dark:border-zinc-800 dark:hover:text-rose-400 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
              Bill Summary
            </h3>

            <div className="space-y-3.5 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-zinc-850 dark:text-zinc-200">
                  {shippingFee === 0 ? <strong className="text-emerald-500">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Secure Platform Fee</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{platformFee}</span>
              </div>
              
              {shippingFee > 0 && (
                <div className="bg-violet-600/5 dark:bg-violet-500/10 p-3 rounded-xl flex gap-2 items-center text-xxs font-bold text-violet-600 dark:text-violet-400">
                  <Sparkles className="h-4 w-4 shrink-0 text-fuchsia-500" />
                  <span>Add ₹{1500 - cartSubtotal} more to unlock FREE Delivery!</span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4 flex justify-between items-center text-sm font-black text-zinc-950 dark:text-white">
              <span>Total Bill</span>
              <span className="text-base text-violet-600 dark:text-violet-400">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="neon-btn w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-violet-500/20 hover:shadow-violet-500/35 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Checkout Order <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="glass-panel p-5 rounded-3xl flex gap-3 items-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 shrink-0">
              <Gift className="h-5 w-5" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Gift Box Protection</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                Add premium custom wraps, message card, and ribbon ties for ₹49. Selectable in next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

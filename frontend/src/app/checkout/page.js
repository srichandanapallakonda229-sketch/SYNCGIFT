'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import { 
  Lock, 
  MapPin, 
  Phone, 
  Gift, 
  ShoppingBag, 
  CheckCircle, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Calendar,
  CreditCard,
  MessageSquare
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams ? searchParams.get('productId') : null;
  const { user, loginMock } = useAuth();
  const { cart, cartSubtotal, clearCart } = useCart();

  // Single product checkout details
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Form Fields State
  const [recipientName, setRecipientName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [giftWrap, setGiftWrap] = useState(false);
  
  // Checkout flow state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState(null);

  // Load single product details if direct checkout
  useEffect(() => {
    if (productId) {
      setProductLoading(true);
      api.get(`/products/${productId}`)
        .then(data => {
          setProduct(data);
          setProductLoading(false);
        })
        .catch(err => {
          console.error("Failed to load direct product checkout details", err);
          setProductLoading(false);
        });
    }
  }, [productId]);

  // Sync recipient name once user is logged in
  useEffect(() => {
    if (user && !recipientName) {
      setRecipientName(user.name);
    }
  }, [user, recipientName]);

  // Calculations
  const itemSubtotal = product ? product.price * quantity : cartSubtotal;
  const shippingFee = itemSubtotal >= 1500 ? 0 : 99;
  const platformFee = 29;
  const wrapFee = giftWrap ? 49 : 0;
  const totalAmount = itemSubtotal + shippingFee + platformFee + wrapFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to place an order.");
      return;
    }
    if (!address.trim() || !phone.trim() || !city.trim() || !state.trim() || !pin.trim() || !deliveryDate) {
      alert("Please fill in all shipping and delivery date details.");
      return;
    }

    setIsSubmitting(true);

    try {
      let orderProducts = [];
      if (productId && product) {
        orderProducts = [{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          imageUrl: product.imageUrl
        }];
      } else {
        orderProducts = cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        }));
      }

      const payload = {
        userId: user.id,
        products: orderProducts,
        totalAmount,
        shippingAddress: `${address}, ${city}, ${state} - ${pin}`,
        contactPhone: phone,
        giftWrap,
        giftMessage,
        deliveryDate,
        paymentMethod
      };

      const orderResult = await api.post('/orders', payload);
      
      // Clear cart if not single item direct order
      if (!productId) {
        clearCart();
      }
      
      setConfirmedOrderDetails(orderResult);
      setOrderConfirmed(true);
      
      // WhatsApp notification simulated trigger
      try {
        await api.post(`/twilio/simulate-call`, {
          phoneNumber: phone,
          status: 'busy'
        });
      } catch (e) {
        console.warn("Notification simulation failed.");
      }

    } catch (error) {
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMockLogin = async (role) => {
    await loginMock(role);
  };

  // 1. GUEST LOG IN BLOCK
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 text-center space-y-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mx-auto">
          <Lock className="h-8 w-8" />
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Authentication Required</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Please sign in to proceed with checkout. You can use our simulated profiles to bypass setup instantly.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={() => handleMockLogin('user')}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer"
          >
            Simulate Customer Sign In
          </button>
          <button
            onClick={() => handleMockLogin('admin')}
            className="w-full py-3.5 border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 rounded-2xl text-xs font-bold cursor-pointer"
          >
            Simulate Admin Sign In
          </button>
        </div>
      </div>
    );
  }

  // 2. ORDER CONFIRMATION SCREEN
  if (orderConfirmed) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 text-center space-y-8 animate-in fade-in duration-300">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-emerald-500/10 animate-ping"></div>
          <CheckCircle className="h-16 w-16 text-emerald-500 relative z-10" />
        </div>

        <div>
          <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest">Order Placed</span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">Thank You!</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Your payment was completed successfully. Order ID: <code className="font-bold text-violet-600 dark:text-violet-400">{confirmedOrderDetails?.id || 'ord_default'}</code>
          </p>
        </div>

        <div className="glass-panel p-5 rounded-3xl text-left space-y-3.5 border-zinc-250/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70">
          <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">Delivery Summary</h4>
          <div className="text-xxs text-zinc-500 dark:text-zinc-400 space-y-1.5 leading-relaxed">
            <p><strong>Customer:</strong> {recipientName}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Ship to:</strong> {address}, {city}, {state} - {pin}</p>
            <p><strong>Payment Method:</strong> {paymentMethod}</p>
            <p><strong>Estimated Delivery:</strong> {new Date(deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            {giftMessage && <p><strong>Gift Message:</strong> &ldquo;{giftMessage}&rdquo;</p>}
            <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
          </div>
          <div className="bg-emerald-500/10 p-3.5 rounded-xl flex gap-2.5 items-start text-xxs font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-4.5 w-4.5 shrink-0 text-fuchsia-500 animate-pulse" />
            <p>
              We simulated a Twilio callback trigger. A WhatsApp notification with Order Details has been dispatched to {phone}.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:opacity-90 text-white rounded-full text-xs font-bold shadow-md cursor-pointer"
          >
            Track in Dashboard
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-3.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-350 rounded-full text-xs font-bold cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // 3. EMPTY CART AND NO PRODUCT LOADED CHECK
  if (!productId && cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 text-center space-y-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mx-auto">
          <ShoppingBag className="h-8 w-8" />
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Nothing to Checkout</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Your cart is empty. Choose a stunning gift from our catalog to place an order.
        </p>
        <button
          onClick={() => router.push('/catalog')}
          className="py-3 px-6 rounded-full text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 cursor-pointer"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  if (productLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <RefreshCw className="h-10 w-10 animate-spin mx-auto text-violet-500 mb-4" />
        <p className="text-xs font-bold text-zinc-500">Retrieving gift details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow">
      {/* Checkout Breadcrumbs */}
      <div className="mb-8 flex items-center gap-2 text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
        <Link href={productId ? "/catalog" : "/cart"} className="hover:text-zinc-700 dark:hover:text-zinc-200">
          {productId ? "Catalog" : "Cart"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-violet-600 dark:text-violet-400">Order Details</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SHIPPING FORM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3">
              <MapPin className="h-5.5 w-5.5 text-violet-600 dark:text-violet-400" /> Shipping & Delivery Information
            </h2>

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Recipient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Karthik Kumar"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Delivery Address (Street & House No.) *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat 302, Royal Enclave"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">City *</label>
                <input
                  type="text"
                  required
                  placeholder="Yadagirigutta"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">State *</label>
                <input
                  type="text"
                  required
                  placeholder="Telangana"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="508115"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Contact Phone Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="9951303523"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Delivery Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold text-zinc-600 dark:text-zinc-300"
                  />
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Payment Method *</label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-bold text-zinc-700 dark:text-zinc-200 cursor-pointer"
                  >
                    <option value="UPI">UPI (GooglePay/PhonePe)</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="CARD">Credit / Debit Card</option>
                  </select>
                  <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Gift Card Message (Optional)</label>
                <div className="relative">
                  <textarea
                    placeholder="Happy Birthday! Hope you love this surprise..."
                    rows={2}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                  ></textarea>
                  <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              {/* Quantity Changer (For direct single checkout) */}
              {product && (
                <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/20">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Order Quantity</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Specify amount of items to secure</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="h-8 w-8 rounded-lg bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                      className="h-8 w-8 rounded-lg bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Gift Wrap Toggler */}
              <div 
                onClick={() => setGiftWrap(!giftWrap)}
                className={`sm:col-span-2 flex justify-between items-center p-4 rounded-2xl border cursor-pointer transition-all ${
                  giftWrap 
                    ? 'border-violet-600 bg-violet-600/5 dark:border-violet-400 dark:bg-violet-500/10' 
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex gap-3 items-center">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${giftWrap ? 'bg-violet-600 text-white' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900'}`}>
                    <Gift className="h-5 w-5 animate-float" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Premium Gift Wrapping</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Adds a custom box, wrapping sheet, ribbon, and message tag</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 shrink-0">+ ₹49</span>
              </div>

              <div className="sm:col-span-2 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold text-xs shadow-md shadow-violet-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Processing simulated payment...
                    </>
                  ) : (
                    <>
                      Confirm Order & Secure Pay (₹{totalAmount.toLocaleString('en-IN')}) <ChevronRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* SUMMARY REVIEW BLOCK */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">Order Review</h3>

            {/* Product list */}
            <div className="space-y-4 max-h-56 overflow-y-auto pr-2">
              {product ? (
                <div className="flex gap-3 items-center justify-between">
                  <div className="flex gap-3 items-center min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate">{product.name}</h4>
                      <p className="text-[10px] text-zinc-400">Qty: {quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-zinc-900 dark:text-white shrink-0">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-3 items-center justify-between">
                    <div className="flex gap-3 items-center min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate">{item.name}</h4>
                        <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-zinc-900 dark:text-white shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))
              )}
            </div>

            {/* Pricing split */}
            <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4 space-y-2.5 text-xxs text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{itemSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{platformFee}</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span>Gift Box Pack</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">₹49</span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4 flex justify-between items-center text-xs font-black text-zinc-900 dark:text-white">
              <span>Total Price</span>
              <span className="text-sm text-violet-650 dark:text-violet-400 font-extrabold">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/5 p-3.5 rounded-xl border border-dashed border-emerald-500/20">
              <ShieldCheck className="h-4.5 w-4.5" />
              <span>AES-256 SSL Encrypted Sandbox</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <RefreshCw className="h-10 w-10 animate-spin mx-auto text-violet-500 mb-4" />
        <p className="text-xs font-bold text-zinc-500">Loading Checkout Module...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

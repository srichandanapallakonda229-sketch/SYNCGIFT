'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, User, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle } = useAuth();

  const [isAdminView, setIsAdminView] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle switching tabs
  const handleToggleTab = (adminMode) => {
    setIsAdminView(adminMode);
    setError('');
    setSuccess('');
    if (adminMode) {
      setEmail('umasgifty01@gmail.com');
      setPassword('Admin@1234');
    } else {
      setEmail('rohit@gmail.com');
      setPassword('Rohit@1234');
    }
  };

  // Populate default mock customer details on mount
  useEffect(() => {
    setEmail('rohit@gmail.com');
    setPassword('Rohit@1234');
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const loggedUser = await loginWithEmail(email, password);
      setSuccess("Logged in successfully!");
      if (rememberMe) {
        localStorage.setItem('syncgifts_remembered_email', email);
      } else {
        localStorage.removeItem('syncgifts_remembered_email');
      }

      // Separate redirect for admin vs customer
      const targetRole = (email === 'umasgifty01@gmail.com') ? 'admin' : 'user';
      setTimeout(() => {
        if (targetRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const fbUser = await loginWithGoogle();
      setSuccess("Logged in with Google successfully!");
      
      // Determine role from email
      const targetRole = (fbUser && fbUser.email === 'umasgifty01@gmail.com') ? 'admin' : 'user';
      setTimeout(() => {
        if (targetRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-grid-pattern min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blobs */}
      <div className="absolute top-12 left-1/4 -z-10 h-72 w-72 rounded-full bg-sky-600/10 blur-[100px] animate-pulse-slow"></div>
      <div className="absolute top-48 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 shadow-md">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </span>
            <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-cyan-400 bg-clip-text text-2xl font-bold tracking-wider text-transparent">
              SyncGifts
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="mt-2 text-xs text-slate-400">
            Sign in to unlock personalized gift recommendations and track orders.
          </p>
        </div>

        {/* Separated access toggle tabs */}
        <div className="flex p-1 bg-slate-900/80 border border-slate-800 rounded-2xl mb-6 shadow-inner">
          <button
            onClick={() => handleToggleTab(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isAdminView 
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="h-4 w-4" />
            Customer Portal
          </button>
          <button
            onClick={() => handleToggleTab(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isAdminView 
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Store Admin Console
          </button>
        </div>

        <div className="glass-panel p-8 rounded-[32px] border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl space-y-6">
          
          {/* Informational messaging */}
          <div className="text-center">
            {isAdminView ? (
              <p className="text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                🔒 Protected administrator vault access. Requires authorized credentials.
              </p>
            ) : (
              <p className="text-[11px] font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-xl px-4 py-2.5">
                ✨ Explore personalized recommendations and manage your order history.
              </p>
            )}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-2xl text-center"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-2xl text-center"
            >
              {success}
            </motion.div>
          )}

          {/* Social login (only for customers/standard verification) */}
          {!isAdminView && (
            <>
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 py-3.5 text-xs font-bold text-slate-350 hover:bg-slate-950 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-2.2 2.2l3.4 2.64c2-1.84 3.16-4.55 3.16-7.69z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.4-2.64c-.95.63-2.16 1.02-3.53 1.02-2.71 0-5.01-1.83-5.83-4.29H1.15v2.73C3.13 21.82 7.28 24 12 24z"/>
                  <path fill="#FBBC05" d="M6.17 15.18c-.21-.63-.33-1.3-.33-2s.12-1.37.33-2V8.45H1.15C.42 9.87 0 11.48 0 13s.42 3.13 1.15 4.55l5.02-3.37z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.93 1.19 15.24 0 12 0 7.28 0 3.13 4.18 1.15 8.45l5.02 3.37c.82-2.46 3.12-4.07 5.83-4.07z"/>
                </svg>
                Continue with Google Account
              </button>

              <div className="flex items-center">
                <hr className="flex-grow border-slate-800" />
                <span className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Or Sign In with Email</span>
                <hr className="flex-grow border-slate-800" />
              </div>
            </>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3.5 rounded-2xl border border-slate-800 bg-slate-950/40 focus:outline-none focus:border-sky-500 font-semibold focus:ring-1 focus:ring-sky-550 transition-all text-white"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                {!isAdminView && (
                  <Link 
                    href="/forgot-password" 
                    className="text-xxs font-bold text-sky-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-10 py-3.5 rounded-2xl border border-slate-800 bg-slate-950/40 focus:outline-none focus:border-sky-500 font-semibold focus:ring-1 focus:ring-sky-550 transition-all text-white"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-350 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-800 rounded bg-slate-950/80"
                />
                <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Remember Me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 mt-4 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 ${
                isAdminView
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-orange-500/20 hover:scale-[1.01]'
                  : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:shadow-sky-500/20 hover:scale-[1.01]'
              }`}
            >
              {loading 
                ? "Verifying Credentials..." 
                : isAdminView 
                  ? "Sign In as Store Administrator" 
                  : "Sign In to Customer Account"
              }
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {!isAdminView && (
            <div className="text-center pt-2">
              <p className="text-xxs text-slate-500 font-bold uppercase tracking-wider">
                Don&apos;t have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-sky-400 hover:underline font-extrabold"
                >
                  Register Here
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

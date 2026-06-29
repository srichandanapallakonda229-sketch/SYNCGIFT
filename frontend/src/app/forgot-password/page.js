'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setLoading(true);

    try {
      await sendPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not dispatch password reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-grid-pattern min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blobs */}
      <div className="absolute top-12 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px] animate-pulse-slow"></div>
      <div className="absolute top-48 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-slow"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-md">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </span>
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 bg-clip-text text-2xl font-bold tracking-wider text-transparent dark:from-violet-400 dark:to-cyan-300">
              UMA&apos;S GIFTY
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Recover Password</h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Tell us your email address, and we will dispatch a reset link.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-[32px] border border-zinc-200/50 bg-white/70 dark:border-zinc-800/50 dark:bg-zinc-950/70 backdrop-blur-md shadow-xl">
          {success ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6 py-4"
            >
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto animate-pulse" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Dispatch Successful</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  An email has been dispatched to <strong className="text-violet-600">{email}</strong>. Please check your inbox (and spam folder) to reset your account credentials.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-1.5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-colors"
              >
                Back to Sign In <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-2xl text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-10 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-violet-500/35 hover:scale-[1.01] active:scale-99 transition-all disabled:opacity-50"
                >
                  {loading ? "Dispatching mail..." : "Dispatch Reset Link"}
                </button>
              </form>

              <div className="text-center pt-2">
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-1 text-xxs font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-250 uppercase tracking-wider transition-colors"
                >
                  <ArrowLeft className="h-4.5 w-4.5" /> Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

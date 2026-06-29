'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles, Check, X, ShieldAlert } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Derive password rules validation states on each render
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@#\$%\^&\*\(\)_\+\-\[\]\{\}\|\\\:\;\"\'\<,\>\.\?\/\!]/.test(password)
  };

  const score = Object.values(rules).filter(Boolean).length;
  const strengthPercentage = (score / 5) * 100;
  const strength = score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong';

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check all rules are met
    const allRulesMet = Object.values(rules).every(Boolean);
    if (!allRulesMet) {
      setError("Please ensure your password meets all validation rules.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Phone validation (10 digits minimum)
    const cleanPhone = mobile.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError("Please input a valid 10-digit mobile number.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    setLoading(true);

    try {
      await registerWithEmail(name, email, mobile, password, imageUrl);
      setSuccess("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create account. Email might be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-grid-pattern min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blobs */}
      <div className="absolute top-12 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px] animate-pulse-slow"></div>
      <div className="absolute top-48 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-slow"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-md">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </span>
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 bg-clip-text text-2xl font-bold tracking-wider text-transparent dark:from-violet-400 dark:to-cyan-300">
              UMA&apos;S GIFTY
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Create Account</h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Join India&apos;s premium smart gifting experience.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-[32px] border border-zinc-200/50 bg-white/70 dark:border-zinc-800/50 dark:bg-zinc-950/70 backdrop-blur-md shadow-xl space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-2xl text-center"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold rounded-2xl text-center"
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Mobile Number */}
            <div>
              <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Mobile Number</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* Optional Photo URL */}
            <div>
              <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Profile Image URL (Optional)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full text-xs px-4 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-10 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center text-xxs font-bold">
                    <span className="text-zinc-400">PASSWORD STRENGTH:</span>
                    <span className={`uppercase tracking-wider ${
                      strength === 'Weak' ? 'text-rose-500' :
                      strength === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {strength}
                    </span>
                  </div>
                  {/* Strength Bar */}
                  <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-350 ${
                        strength === 'Weak' ? 'bg-rose-500' :
                        strength === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${strengthPercentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Rules Ticks */}
                  <div className="grid grid-cols-2 gap-2 text-xxs font-semibold text-zinc-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      {rules.length ? <Check className="h-3 w-3 text-emerald-500 shrink-0" /> : <X className="h-3 w-3 text-rose-500 shrink-0" />}
                      Min 8 characters
                    </span>
                    <span className="flex items-center gap-1.5">
                      {rules.upper ? <Check className="h-3 w-3 text-emerald-500 shrink-0" /> : <X className="h-3 w-3 text-rose-500 shrink-0" />}
                      At least 1 uppercase letter
                    </span>
                    <span className="flex items-center gap-1.5">
                      {rules.lower ? <Check className="h-3 w-3 text-emerald-500 shrink-0" /> : <X className="h-3 w-3 text-rose-500 shrink-0" />}
                      At least 1 lowercase letter
                    </span>
                    <span className="flex items-center gap-1.5">
                      {rules.number ? <Check className="h-3 w-3 text-emerald-500 shrink-0" /> : <X className="h-3 w-3 text-rose-500 shrink-0" />}
                      At least 1 number
                    </span>
                    <span className="flex items-center gap-1.5 col-span-2">
                      {rules.special ? <Check className="h-3 w-3 text-emerald-500 shrink-0" /> : <X className="h-3 w-3 text-rose-500 shrink-0" />}
                      At least 1 special char (@, #, $, %, etc.)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-10 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> Passwords do not match.
                </p>
              )}
            </div>

            {/* Terms and Conditions checkbox */}
            <div className="flex items-start gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                required
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 mt-0.5 text-violet-600 focus:ring-violet-500 border-zinc-300 dark:border-zinc-800 rounded"
              />
              <label htmlFor="terms" className="text-xxs font-bold text-zinc-500 dark:text-zinc-400 uppercase leading-relaxed tracking-wider">
                I agree to the{" "}
                <a href="#" className="text-violet-650 hover:underline">
                  Terms of Service
                </a>{" "}
                &amp;{" "}
                <a href="#" className="text-violet-650 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-violet-500/35 hover:scale-[1.01] active:scale-99 transition-all disabled:opacity-50"
            >
              {loading ? "Creating Account Vault..." : "Create Shop Account"}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xxs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-violet-600 dark:text-violet-400 hover:underline font-extrabold"
              >
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

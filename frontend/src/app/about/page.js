'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Award, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="relative w-full overflow-hidden bg-grid-pattern py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blobs */}
      <div className="absolute top-12 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px] animate-pulse-slow"></div>
      <div className="absolute top-48 right-1/4 -z-10 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] animate-pulse-slow"></div>

      <div className="mx-auto max-w-3xl text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/10 px-4.5 py-1.5 text-xs font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" /> Empowering Smart Choices
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl"
        >
          About{" "}
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-300">
            SyncGifts
          </span>
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mx-auto max-w-4xl glass-panel p-8 sm:p-12 rounded-[32px] border border-zinc-200/50 bg-white/70 dark:border-zinc-800/50 dark:bg-zinc-950/70 backdrop-blur-md shadow-xl space-y-8"
      >
        <div className="text-center sm:text-left space-y-6 leading-relaxed">
          <p className="text-base sm:text-lg font-medium text-zinc-850 dark:text-zinc-200">
            SyncGifts is an AI-powered gift recommendation platform designed to help customers quickly find the perfect gift for every occasion. It offers personalized recommendations based on occasion, age, relationship, and budget, making gift shopping faster, smarter, and more enjoyable.
          </p>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Whether you are searching for a high-end birthday surprise, a premium corporate hamper, or the perfect token for wedding or housewarming ceremonies, SyncGifts removes all guesswork. Utilizing next-generation natural language understanding and instant catalog matching, we filter through real, high-quality collections curated strictly for quality and aesthetic appeal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
          {[
            {
              title: "Personalized Precision",
              desc: "Contextual matching that targets age, gender, relationship, budget, and exact interests.",
              icon: Heart,
              color: "text-rose-500 bg-rose-500/10"
            },
            {
              title: "Premium Collections Only",
              desc: "Gifts specifically selected and sourced, priced between ₹1999 and ₹10000.",
              icon: Award,
              color: "text-amber-500 bg-amber-500/10"
            },
            {
              title: "Reliable Selections",
              desc: "No repeated recommendations. Every single occasion catalog is completely unique.",
              icon: ShieldCheck,
              color: "text-emerald-500 bg-emerald-500/10"
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 p-4 rounded-2xl hover:bg-zinc-100/30 dark:hover:bg-zinc-900/30 transition-all">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.color}`}>
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{feature.title}</h4>
                <p className="text-xxs text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

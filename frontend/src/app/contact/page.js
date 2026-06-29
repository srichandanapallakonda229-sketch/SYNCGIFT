'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Sparkles, Send, CheckCircle, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  const branches = [
    "Yadagirigutta (Main Branch)",
    "Bhongir",
    "Warangal",
    "Hanamkonda",
    "Hyderabad"
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">
      {/* Header Panel */}
      <div className="mb-12 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/10 px-4.5 py-1.5 text-xs font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 mb-4">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Reach Out to SyncGifts
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Contact Our Team</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Have questions about corporate gifts or custom plaques? Get in touch with Karthik or visit our outlets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Details & Branches */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3">Outlets & Support</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Main Branch Address</h4>
                  <p className="text-xxs text-zinc-500 dark:text-zinc-400 mt-1">Opposite Bus Stop, Yadagirigutta, Telangana, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-600/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Customer Support (Owner Karthik)</h4>
                  <p className="text-xxs text-zinc-500 dark:text-zinc-400 mt-1">9951303523</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-600/10 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Email Address</h4>
                  <p className="text-xxs text-zinc-500 dark:text-zinc-400 mt-1">hello@syncgifts.com</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-3">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Our Active Branches</h4>
              <div className="flex flex-wrap gap-2">
                {branches.map((branch, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xxs font-bold text-zinc-600 dark:text-zinc-350 bg-white/20 dark:bg-zinc-950/20"
                  >
                    • {branch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-80 rounded-3xl overflow-hidden relative shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3802.7214952093557!2d78.9441113!3d17.5921617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb6588a53e4125%3A0x6b8764024340d859!2sYadagirigutta%20Bus%20Stop!5e0!3m2!1sen!2sin!4v1700000000000"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="SyncGifts Main Yadagirigutta Branch Location"
            ></iframe>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div>
          <div className="glass-panel p-8 rounded-[32px] border border-zinc-200/50 bg-white/70 dark:border-zinc-800/50 dark:bg-zinc-950/70 backdrop-blur-md shadow-xl h-full flex flex-col justify-center">
            
            {submitSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-8"
              >
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Message Dispatched!</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                  Thank you for contacting SyncGifts. Karthik or one of our branch team members will reply in 15–20 minutes.
                </p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="py-2.5 px-6 rounded-full text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
                  <span>Send a Message</span>
                </h3>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Your Full Name *</label>
                  <input 
                    type="text" required placeholder="e.g. Karthik" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Email Address *</label>
                  <input 
                    type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Subject</label>
                  <input 
                    type="text" placeholder="Inquiry about customized bulk order" value={subject} onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Your Message *</label>
                  <textarea 
                    required placeholder="Type your concerns, queries, or custom specifications..." rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 mt-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Submit Inquiry"}
                  {!isSubmitting && <Send className="h-4 w-4" />}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

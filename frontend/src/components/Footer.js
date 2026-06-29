'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../utils/api';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles,
  AtSign,
  Globe,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const [shopInfo, setShopInfo] = useState({
    shopName: "SyncGifts",
    description: "SyncGifts is an AI-powered gift store in Yadagirigutta, Telangana. We help you discover the perfect personalized, spiritual, and luxury gifts for every occasion — birthdays, weddings, festivals, and more.",
    address: "Opposite Bus Stop, Yadagirigutta, Telangana, India",
    phone: "9951303523",
    email: "hello@syncgifts.com",
    businessHours: "Monday - Sunday: 10:00 AM - 9:00 PM"
  });

  useEffect(() => {
    async function loadShopInfo() {
      try {
        const info = await api.get('/shop');
        if (info) {
          setShopInfo(info);
        }
      } catch (err) {
        // Safe fail - default states already set
      }
    }
    loadShopInfo();
  }, []);

  const categories = [
    'Birthday Gifts',
    'Anniversary Gifts',
    'Wedding Gifts',
    'Housewarming',
    'Baby Shower',
    'Festivals',
    'Corporate Gifts',
    'Spiritual Gifts'
  ];

  const branches = [
    'Yadagirigutta (Main Branch)',
    'Hyderabad (City Branch)',
    'Secunderabad',
    'Warangal',
    'Nizamabad'
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-cyan-400 bg-clip-text text-xl font-bold tracking-wider text-transparent">
                SyncGifts
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {shopInfo.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/umas_gifty" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 transition-colors font-semibold"
              >
                <AtSign className="h-4.5 w-4.5" />
                @umas_gifty
              </a>
              <a 
                href={`https://wa.me/91${shopInfo.phone}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                WhatsApp
              </a>
            </div>

            {/* Branches */}
            <div>
              <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest mb-2">Our Branches</p>
              <ul className="space-y-1">
                {branches.map((branch) => (
                  <li key={branch} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60 shrink-0"></span>
                    {branch}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalog" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1">
                  AI Gift Assistant <span className="rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[8px] font-bold text-sky-400">AI</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-sky-400 transition-colors">
                  My Orders & Profile
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-sky-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gift Categories</h4>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link 
                    href={`/catalog?category=${encodeURIComponent(cat)}`} 
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Contact Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                <span>{shopInfo.address}</span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-sky-500 shrink-0" />
                <a href={`tel:+91${shopInfo.phone}`} className="hover:text-sky-400 transition-colors">
                  +91 {shopInfo.phone}
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="h-4 w-4 text-sky-500 shrink-0" />
                <a href={`mailto:${shopInfo.email}`} className="hover:text-sky-400 transition-colors truncate">
                  {shopInfo.email}
                </a>
              </li>
              <li className="flex gap-2 items-start">
                <Clock className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                <span>{shopInfo.businessHours}</span>
              </li>
              <li className="flex gap-2 items-center">
                <AtSign className="h-4 w-4 text-pink-400 shrink-0" />
                <a 
                  href="https://www.instagram.com/umas_gifty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 transition-colors"
                >
                  @umas_gifty
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} SyncGifts | Uma&apos;s Gifty — Yadagirigutta, Telangana. All rights reserved.</p>
          <p>Powered by AI · Made with ❤️ for every occasion</p>
        </div>
      </div>
    </footer>
  );
}

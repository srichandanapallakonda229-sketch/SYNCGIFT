'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { 
  Sparkles, 
  ArrowRight, 
  Mic, 
  ShoppingBag, 
  Gift, 
  Truck, 
  MessageSquareShare, 
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Heart
} from 'lucide-react';

export default function Home() {
  const { toggleWishlist, isInWishlist } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [shopInfo, setShopInfo] = useState({
    shopName: "SyncGifts",
    description: "SyncGifts is an AI-powered gift recommendation platform designed to help customers quickly find the perfect gift for every occasion. It offers personalized recommendations based on occasion, age, relationship, and budget, making gift shopping faster, smarter, and more enjoyable.",
    address: "Opposite Bus Stop, Yadagirigutta, Telangana, India",
    phone: "9951303523",
    whatsapp: "9951303523",
    email: "hello@syncgifts.com",
    businessHours: "Monday - Sunday: 10:00 AM - 9:00 PM",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3802.7214952093557!2d78.9441113!3d17.5921617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb6588a53e4125%3A0x6b8764024340d859!2sYadagirigutta%20Bus%20Stop!5e0!3m2!1sen!2sin!4v1700000000000"
  });

  useEffect(() => {
    async function loadData() {
      try {
        const prods = await api.get('/products');
        if (prods && prods.length > 0) {
          // Take top 4 rated products as featured
          const sorted = [...prods].sort((a, b) => b.rating - a.rating);
          setFeaturedProducts(sorted.slice(0, 4));
        }
      } catch (err) {
        console.warn("Could not fetch products for landing page, using seed fallbacks");
        // Static fallback if API server is offline
        setFeaturedProducts([
          {
            id: "prod_bday_1",
            name: "Luxury Teddy Bear",
            category: "Birthday Gifts",
            price: 2499,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=60",
            description: "An ultra-soft premium plush luxury teddy bear. Standing 4 feet tall with hypoallergenic premium filling."
          },
          {
            id: "prod_wed_1",
            name: "Gold Finish Idol",
            category: "Wedding Gifts",
            price: 4999,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=60",
            description: "An elegant, highly-detailed Radha Krishna idol plated in premium 24K gold finish."
          },
          {
            id: "prod_ann_1",
            name: "Customized Couple Frame",
            category: "Anniversary Gifts",
            price: 2199,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=60",
            description: "A premium wooden plaque with a high-definition photo print, customized names, and the anniversary date engraved."
          },
          {
            id: "prod_baby_1",
            name: "Baby Care Kit",
            category: "Baby Shower",
            price: 2499,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1522850959516-58f958d60005?w=600&auto=format&fit=crop&q=60",
            description: "An all-in-one organic baby skin-care package. Includes gentle baby wash, nourishing lotion, and massage oil."
          }
        ]);
      }

      try {
        const info = await api.get('/shop');
        if (info) setShopInfo(info);
      } catch (err) {
        // Safe fail - default states already set
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: 'Birthday Gifts', count: '20 Items', color: 'from-blue-500 to-sky-500', slug: 'Birthday Gifts' },
    { name: 'Wedding Gifts', count: '10 Items', color: 'from-indigo-500 to-blue-600', slug: 'Wedding Gifts' },
    { name: 'Anniversary Gifts', count: '12 Items', color: 'from-sky-400 to-blue-500', slug: 'Anniversary Gifts' },
    { name: 'Baby Shower', count: '10 Items', color: 'from-blue-400 to-indigo-400', slug: 'Baby Shower' },
    { name: 'Housewarming', count: '10 Items', color: 'from-sky-500 to-cyan-500', slug: 'Housewarming' },
    { name: 'Festivals', count: '10 Items', color: 'from-indigo-600 to-sky-600', slug: 'Festivals' },
    { name: 'Corporate Gifts', count: '10 Items', color: 'from-blue-700 to-cyan-600', slug: 'Corporate Gifts' },
    { name: 'Spiritual Gifts', count: '8 Items', color: 'from-amber-500 to-orange-500', slug: 'Spiritual Gifts' }
  ];

  const testimonials = [
    {
      name: "Sneha Reddi",
      role: "College Student",
      quote: "The Custom Spotify plaque was the perfect anniversary gift. The AI chatbot suggested it instantly when I said my boyfriend loves vintage synth-pop. Delivery was so fast!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      name: "Aditya Verma",
      role: "Software Engineer",
      quote: "Needed a birthday gift for my manager under ₹2000. I used the Voice Input, said 'professional gift under 2k', and it recommended the Leather Hamper. Best checkout experience.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      name: "Pooja Hegde",
      role: "Creative Director",
      quote: "The visual aesthetic of this store is next-level! Glassmorphism transitions are extremely smooth. I got the Astra Nebula Projector for my room, and it's spectacular.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      rating: 4.8
    }
  ];

  const whyChooseUs = [
    {
      title: "AI-Powered Intuition",
      desc: "Describe what you want in simple words or speak it aloud. Our smart AI assistant scans live inventory and matches parameters instantly.",
      icon: Sparkles,
      color: "text-violet-500 bg-violet-500/10"
    },
    {
      title: "Auto-WhatsApp Status",
      desc: "Missed call? Our Twilio webhook fires a helpful WhatsApp notification in 15 seconds. Stay tracked with automatic checkout alerts.",
      icon: MessageSquareShare,
      color: "text-cyan-500 bg-cyan-500/10"
    },
    {
      title: "Express Premium Delivery",
      desc: "Every gift is packed in double-walled aesthetic boxes with customized tags. Fast express shipping ensures it arrives on time.",
      icon: Truck,
      color: "text-fuchsia-500 bg-fuchsia-500/10"
    }
  ];

  return (
    <div className="relative w-full overflow-hidden bg-grid-pattern pb-16">
      {/* Decorative background blobs */}
      <div className="absolute top-12 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px] animate-pulse-slow"></div>
      <div className="absolute top-48 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-slow"></div>

      {/* 1. HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/10 px-4.5 py-1.5 text-xs font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              <Sparkles className="h-3.5 w-3.5" /> Next-Gen Smart Gifting
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            Find The Perfect Gift in{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-300">
              Seconds
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg"
          >
            SyncGifts is India&apos;s first AI-powered gift boutique. Speak or type your requirements, and our intelligent chatbot parses budget, relations, and mood to recommend catalog products instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              href="/chat"
              className="neon-btn flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              <Mic className="h-4 w-4" /> Ask AI Assistant
            </Link>
            <Link
              href="/catalog"
              className="glass-panel flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full px-8 py-3.5 text-sm font-bold text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
            >
              Explore Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Floating Glassmorphism Promo Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-20 max-w-5xl rounded-3xl p-1 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20"
        >
          <div className="glass-panel flex flex-col md:flex-row justify-around items-center gap-8 rounded-[22px] px-8 py-10 text-center md:text-left">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/20">
                <Gift className="h-6 w-6" />
              </span>
              <div>
                <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">Curated Collection</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">100+ youth-oriented high-end items</p>
              </div>
            </div>
            <div className="h-px w-full bg-zinc-200/50 md:h-12 md:w-px dark:bg-zinc-800/50"></div>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-rose-500 text-white shadow-md shadow-rose-500/20">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">Smart Match Finder</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">98% recommendation satisfaction</p>
              </div>
            </div>
            <div className="h-px w-full bg-zinc-200/50 md:h-12 md:w-px dark:bg-zinc-800/50"></div>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20">
                <MessageSquareShare className="h-6 w-6" />
              </span>
              <div>
                <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">Auto WhatsApp</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Instant notification & call fallback</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Shop by Vibe</h2>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Explore handcrafted gifts categorized for youth and startups</p>
          </div>
          <Link href="/catalog" className="mt-4 md:mt-0 flex items-center gap-1 text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">
            All Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/catalog?category=${encodeURIComponent(cat.slug)}`}
                className="glass-card flex flex-col justify-between h-40 rounded-2xl p-5 hover:border-violet-500 overflow-hidden relative group"
              >
                <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br ${cat.color} opacity-20 blur-md group-hover:scale-150 transition-all duration-500`}></div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white">
                  <Gift className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-snug">{cat.name}</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Trending Gifts</h2>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">High-demand items loved by our customers</p>
          </div>
          <Link href="/catalog?sortBy=popularity" className="mt-4 md:mt-0 flex items-center gap-1 text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">
            View Popular Items <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card flex flex-col justify-between rounded-3xl overflow-hidden group"
            >
              <div className="relative h-60 w-full overflow-hidden bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={p.imageUrl} 
                  alt={p.name} 
                  className="h-full w-full object-cover group-hover:scale-108 transition-all duration-500 ease-out"
                />
                <button
                  onClick={() => toggleWishlist(p)}
                  className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur-md text-zinc-700 hover:text-rose-500 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:text-rose-400 transition-colors shadow-sm cursor-pointer"
                >
                  <Heart className={`h-4.5 w-4.5 ${isInWishlist(p.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
                <span className="absolute bottom-4 left-4 rounded-lg bg-zinc-950/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  {p.category}
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{p.rating}</span>
                    </div>
                  </div>
                  <p className="text-xxs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {p.description || "A gorgeous curated gift from SyncGifts."}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <Link 
                    href={`/catalog?search=${encodeURIComponent(p.name)}`}
                    className="flex items-center gap-1 rounded-full bg-violet-600/10 px-3 py-1.5 text-xs font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-500 transition-colors"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Redefining Gift Shopping</h2>
          <p className="mx-auto mt-3 max-w-xl text-xs text-zinc-500 dark:text-zinc-400">SyncGifts merges luxury craft with high-tech automated assistance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChooseUs.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-panel flex flex-col items-center text-center p-8 rounded-3xl"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} mb-6`}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS SECTION */}
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Rated 4.9/5 by 2,000+ Lovers</h2>
          <p className="mx-auto mt-3 max-w-xl text-xs text-zinc-500 dark:text-zinc-400">See how our AI assistant and quick deliveries change lives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card flex flex-col justify-between p-8 rounded-3xl"
            >
              <div>
                <div className="flex gap-0.5 text-amber-500 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={test.avatar} 
                  alt={test.name} 
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{test.name}</h4>
                  <p className="text-[10px] text-zinc-400">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CONTACT & LOCATION SECTION */}
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-xl">
          {/* Form / Contact detail block */}
          <div className="p-8 sm:p-12 flex flex-col justify-between gap-8">
            <div>
              <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Connect with us</span>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">Visit SyncGifts Hub</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">
                Want to see our custom designs live? Or need custom branding on corporate orders? Visit our Yadagirigutta outlet or call us directly. Our call auto-reply has got your back.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Shop Address</h4>
                  <p className="text-xxs text-zinc-500 dark:text-zinc-400 mt-1">{shopInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-600/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Customer Care / WhatsApp</h4>
                  <p className="text-xxs text-zinc-500 dark:text-zinc-400 mt-1">{shopInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-600/10 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Email Support</h4>
                  <p className="text-xxs text-zinc-500 dark:text-zinc-400 mt-1">{shopInfo.email}</p>
                </div>
              </div>
            </div>

            {/* Quick Contact buttons */}
            <div className="flex gap-4">
              <a 
                href={`tel:${shopInfo.phone.replace(/\s+/g, '')}`}
                className="flex-1 py-3 px-4 text-center rounded-full text-xs font-bold text-white bg-violet-600 shadow-md shadow-violet-500/15 hover:bg-violet-700 transition-colors"
              >
                Call Now
              </a>
              <a 
                href={`https://wa.me/${shopInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 text-center rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba56] transition-colors"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="h-96 lg:h-auto min-h-[350px] relative">
            <iframe 
              src={shopInfo.googleMapsEmbedUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="SyncGifts Google Maps Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

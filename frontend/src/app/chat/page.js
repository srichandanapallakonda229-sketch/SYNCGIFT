'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  RefreshCw,
  Gift,
  Star,
  Info,
  Volume2,
  ArrowRight
} from 'lucide-react';

export default function ChatAssistant() {
  const { addToCart } = useCart();
  const messagesEndRef = useRef(null);

  // Chat message thread
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hey! I'm your SyncGifts AI Assistant. 🌟\nTell me who you're buying for and what they like, or try clicking the **Sliders** to configure a structured request!\n\n*Example: 'I need a birthday gift for my partner under ₹2500.'*\n\n🔊 **Voice Support:** English, Hindi, Telugu. Try saying: \"read description of [gift]\" or \"order [gift]\" to try voice controls!",
      productIds: []
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Voice Input state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedLang, setSelectedLang] = useState('en-IN');

  // Context settings (collapsible)
  const [showSettings, setShowSettings] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [relationship, setRelationship] = useState('');
  const [interests, setInterests] = useState('');

  // Text-To-Speech description player
  const speakText = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedLang === 'te-IN') utterance.lang = 'te-IN';
      else if (selectedLang === 'hi-IN') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice commands parser
  const handleVoiceCommand = async (text) => {
    const query = text.toLowerCase().trim();
    
    // Command 1: Speak description / Read description
    if (query.includes('read description') || query.includes('tell me about') || query.includes('describe')) {
      const cleaned = query.replace('read description of', '').replace('read description', '').replace('tell me about', '').replace('describe', '').trim();
      if (cleaned) {
        try {
          const allProds = await api.get('/products');
          const matched = allProds.find(p => p.name.toLowerCase().includes(cleaned));
          if (matched) {
            speakText(`Here is the description for ${matched.name}: ${matched.description}`);
            setMessages(prev => [...prev, {
              id: 'voice_cmd_' + Date.now(),
              sender: 'ai',
              text: `🔊 Reading description for **${matched.name}** out loud...`,
              productIds: [matched.id]
            }]);
          } else {
            speakText("Sorry, I could not find a matching gift in our collection.");
          }
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    // Command 2: Order / Buy
    if (query.includes('order') || query.includes('buy')) {
      const cleaned = query.replace('order', '').replace('buy', '').trim();
      if (cleaned) {
        try {
          const allProds = await api.get('/products');
          const matched = allProds.find(p => p.name.toLowerCase().includes(cleaned));
          if (matched) {
            speakText(`Redirecting to checkout to order ${matched.name}`);
            setMessages(prev => [...prev, {
              id: 'voice_cmd_' + Date.now(),
              sender: 'ai',
              text: `🛒 Directing you to order **${matched.name}**...`,
              productIds: [matched.id]
            }]);
            setTimeout(() => {
              router.push(`/checkout?productId=${matched.id}`);
            }, 1000);
          } else {
            speakText("Sorry, I could not find a matching gift to purchase.");
          }
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    // Command 3: Open / Show details
    if (query.includes('open') || query.includes('show')) {
      const cleaned = query.replace('open', '').replace('show', '').trim();
      if (cleaned) {
        try {
          const allProds = await api.get('/products');
          const matched = allProds.find(p => p.name.toLowerCase().includes(cleaned));
          if (matched) {
            speakText(`Showing details of ${matched.name}`);
            setMessages(prev => [...prev, {
              id: 'voice_cmd_' + Date.now(),
              sender: 'ai',
              text: `✨ Found: **${matched.name}**\n\n*Price:* ₹${matched.price}\n*Description:* ${matched.description}`,
              productIds: [matched.id]
            }]);
          } else {
            speakText("Sorry, I could not find a matching gift to open.");
          }
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }
  };

  // Recommended products store (fetched from backend IDs)
  const [productDetailsMap, setProductDetailsMap] = useState({});

  // Fetch full details of recommended products dynamically
  const fetchProductDetails = async (ids) => {
    const missingIds = ids.filter(id => !productDetailsMap[id]);
    if (missingIds.length === 0) return;

    try {
      const updatedMap = { ...productDetailsMap };
      await Promise.all(
        missingIds.map(async (id) => {
          try {
            const prod = await api.get(`/products/${id}`);
            if (prod) {
              updatedMap[id] = prod;
            }
          } catch (e) {
            console.error(`Failed to fetch product detail for ${id}`, e);
          }
        })
      );
      setProductDetailsMap(updatedMap);
    } catch (err) {
      console.error('Batch fetch product details error', err);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initialize Web Speech API for voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          handleVoiceCommand(transcript);
        };

        rec.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        Promise.resolve().then(() => setRecognition(rec));
      }
    }
  }, [selectedLang]);

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.lang = selectedLang;
      recognition.start();
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    setInputText('');

    // Append user message
    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: userMsgText
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Fetch recommendations from server
      const response = await api.post('/assistant/recommend', {
        message: userMsgText,
        occasion,
        budget,
        age,
        gender,
        relationship,
        interests
      });

      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: response.reply,
        productIds: response.recommendedProductIds || []
      };

      // If products recommended, fetch details
      if (aiMsg.productIds.length > 0) {
        await fetchProductDetails(aiMsg.productIds);
      }

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat recommend error:", error.message);
      setMessages(prev => [...prev, {
        id: 'ai_err_' + Date.now(),
        sender: 'ai',
        text: "Oops! I encountered an error connecting to my database cells. Please make sure the backend is active.",
        productIds: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleContextPreset = (label, query, details = {}) => {
    // Fill presets
    setOccasion(details.occasion || '');
    setBudget(details.budget || '');
    setRelationship(details.relationship || '');
    setInputText(query);
    setShowSettings(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow flex flex-col h-[calc(100vh-8rem)] min-h-[500px]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow h-full overflow-hidden">
        
        {/* LEFT COLUMN: CONTEXT INPUT SETTINGS (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 space-y-4 h-full overflow-y-auto pr-2">
          <div className="glass-panel p-5 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3">
              <SlidersHorizontal className="h-4 w-4" /> AI Gift Filters
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Occasion</label>
                <select 
                  value={occasion} 
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                >
                  <option value="">Select Occasion</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Festival">Festival</option>
                  <option value="Valentine">Valentine&apos;s Day</option>
                  <option value="Friendship">Friendship</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Max Budget (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1000, 2500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Recipient Age</label>
                <input
                  type="number"
                  placeholder="e.g. 21, 35"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Recipient Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-950 focus:outline-none font-semibold"
                >
                  <option value="">Any</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-950 focus:outline-none font-semibold"
                >
                  <option value="">Any</option>
                  <option value="Friend">Friend</option>
                  <option value="Partner">Partner / Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Colleague">Colleague</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Interests / Tags</label>
                <input
                  type="text"
                  placeholder="e.g. music, space, plants"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-950 focus:outline-none"
                />
              </div>
            </div>
            
            <button
              onClick={() => {
                setOccasion('');
                setBudget('');
                setAge('');
                setGender('');
                setRelationship('');
                setInterests('');
              }}
              className="w-full py-2 border border-dashed border-zinc-200 dark:border-zinc-800 text-xxs font-bold text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="glass-panel p-4.5 rounded-3xl space-y-2.5">
            <span className="text-[10px] font-bold text-violet-500 flex items-center gap-1">
              <Info className="h-3.5 w-3.5" /> Prompt Presets
            </span>
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => handleContextPreset("Girlfriend Bday", "Anniversary gift for girlfriend under 1000", { occasion: "Anniversary", budget: "1000", relationship: "Partner" })}
                className="text-[10px] font-medium text-left p-2 rounded-lg bg-zinc-100 hover:bg-violet-600/10 dark:bg-zinc-900 dark:hover:bg-violet-500/15"
              >
                💝 For GF under ₹1000
              </button>
              <button 
                onClick={() => handleContextPreset("Tech Friend", "Cool gadget under 2000 for a male friend", { occasion: "Birthday", budget: "2000", relationship: "Friend", gender: "Male" })}
                className="text-[10px] font-medium text-left p-2 rounded-lg bg-zinc-100 hover:bg-violet-600/10 dark:bg-zinc-900 dark:hover:bg-violet-500/15"
              >
                🎮 Gadget under ₹2000
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHAT WINDOW */}
        <div className="lg:col-span-3 flex flex-col h-full glass-panel rounded-3xl overflow-hidden relative shadow-lg">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-zinc-200/50 bg-white/50 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/50 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md animate-pulse">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                  UMA&apos;S GIFTY AI Bot
                </h3>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Active (Real-time recommenders)
                </span>
              </div>
            </div>

            {/* Mobile Filter toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="lg:hidden p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Settings panel */}
          {showSettings && (
            <div className="absolute top-16 left-0 right-0 z-20 bg-white border-b border-zinc-200 p-6 shadow-xl lg:hidden dark:bg-zinc-950 dark:border-zinc-800 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Occasion</label>
                <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full text-xs p-2 rounded-lg border bg-zinc-50 dark:bg-zinc-900">
                  <option value="">Any</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Valentine">Valentine</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Max Budget (₹)</label>
                <input type="number" placeholder="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full text-xs p-2 rounded-lg border bg-zinc-50 dark:bg-zinc-900" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Relationship</label>
                <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className="w-full text-xs p-2 rounded-lg border bg-zinc-50 dark:bg-zinc-900">
                  <option value="">Any</option>
                  <option value="Friend">Friend</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Interests</label>
                <input type="text" placeholder="Interests" value={interests} onChange={(e) => setInterests(e.target.value)} className="w-full text-xs p-2 rounded-lg border bg-zinc-50 dark:bg-zinc-900" />
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="col-span-2 mt-2 py-2 bg-violet-600 text-white rounded-lg text-xs font-bold"
              >
                Close Settings
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message bubble */}
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/10' 
                      : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/50'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Inline recommendations carousel */}
                {msg.sender === 'ai' && msg.productIds && msg.productIds.length > 0 && (
                  <div className="w-full max-w-[95%] mt-4 overflow-x-auto pb-2 flex gap-4 pr-4 scrollbar-thin scrollbar-thumb-zinc-200">
                    {msg.productIds.map(prodId => {
                      const p = productDetailsMap[prodId];
                      if (!p) return null; // detail loading
                      return (
                        <div 
                          key={p.id}
                          className="glass-card flex flex-col justify-between w-48 rounded-2xl overflow-hidden shrink-0 border border-zinc-200/60 dark:border-zinc-800/60"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={p.imageUrl} 
                            alt={p.name}
                            className="h-28 w-full object-cover"
                          />
                          <div className="p-3 flex-grow flex flex-col justify-between gap-2 bg-white/20 dark:bg-zinc-900/30">
                            <div>
                              <h4 className="font-extrabold text-[11px] text-zinc-950 dark:text-white line-clamp-1">{p.name}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] font-bold text-zinc-400">{p.category}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => speakText(p.description)}
                                    className="p-1 rounded-md bg-zinc-100 hover:bg-violet-100 text-zinc-600 hover:text-violet-650 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                                    title="Listen description"
                                  >
                                    <Volume2 className="h-3 w-3" />
                                  </button>
                                  <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    <span>{p.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 mt-1 pt-1 border-t border-zinc-200/30 dark:border-zinc-800/30">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-zinc-950 dark:text-white">₹{p.price}</span>
                                <button
                                  onClick={() => {
                                    addToCart(p, 1);
                                    alert(`Added ${p.name} to cart!`);
                                  }}
                                  className="flex items-center gap-0.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 rounded-lg p-1 text-[9px] font-bold transition-colors cursor-pointer"
                                >
                                  <ShoppingBag className="h-2.5 w-2.5" /> Cart
                                </button>
                              </div>
                              <button
                                onClick={() => router.push(`/checkout?productId=${p.id}`)}
                                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg py-1 px-1.5 text-[9px] font-bold hover:opacity-90 flex items-center justify-center gap-0.5"
                              >
                                Order Now <ArrowRight className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
                  <RefreshCw className="h-4 w-4 animate-spin text-violet-500" />
                </span>
                <span className="animate-pulse">SyncGifts AI is picking suggestions...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice active overlay panel */}
          {isListening && (
            <div className="absolute inset-0 bg-violet-950/20 backdrop-blur-xs flex flex-col items-center justify-center gap-4 z-30 animate-in fade-in duration-200">
              <div className="relative flex items-center justify-center">
                {/* Pulsing rings */}
                <div className="absolute h-24 w-24 rounded-full border border-violet-500 animate-ping opacity-70"></div>
                <div className="absolute h-16 w-16 rounded-full border border-fuchsia-500 animate-ping opacity-40"></div>
                <button
                  onClick={toggleVoiceInput}
                  className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white shadow-xl"
                >
                  <Mic className="h-6 w-6" />
                </button>
              </div>
              <span className="text-xs font-bold text-violet-800 dark:text-violet-300 tracking-wider uppercase animate-pulse">Listening to voice input...</span>
              <p className="text-[10px] text-zinc-400 max-w-xs text-center">Speak naturally: e.g. &ldquo;I need an anniversary plaque under 1000 rupees&rdquo;</p>
            </div>
          )}

          {/* Form Input footer */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 bg-white/50 border-t border-zinc-200/50 dark:bg-zinc-950/50 dark:border-zinc-800/50 flex gap-2 items-center"
          >
            <div className="flex flex-col gap-1 items-center shrink-0">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="text-[9px] font-bold p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/20 text-zinc-600 dark:text-zinc-300 focus:outline-none cursor-pointer"
                title="Select Recognition Language"
              >
                <option value="en-IN">🇬🇧 EN</option>
                <option value="hi-IN">🇮🇳 HI</option>
                <option value="te-IN">🇮🇳 TE</option>
              </select>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-full border cursor-pointer transition-all ${
                  isListening 
                    ? 'bg-rose-500 border-rose-600 text-white shadow-md animate-pulse' 
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
                title="Voice Input"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Ask AI assistant for recommendation..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow px-4 py-3 rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white disabled:from-zinc-200 disabled:to-zinc-200 disabled:text-zinc-400 shadow-md shadow-violet-500/10 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

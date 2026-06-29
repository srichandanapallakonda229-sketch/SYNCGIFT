'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  ShieldAlert, 
  BarChart3, 
  Package, 
  ShoppingBag, 
  PhoneCall, 
  Settings, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle,
  Clock,
  Sparkles,
  Save,
  MessageSquare,
  Lock
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loginMock } = useAuth();
  
  // Tab control
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'products', 'orders', 'twilio', 'shop'

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [whatsappLogs, setWhatsappLogs] = useState([]);
  const [shopInfo, setShopInfo] = useState({
    shopName: '', description: '', address: '', phone: '', whatsapp: '', email: '', businessHours: '', googleMapsEmbedUrl: '',
    whatsappSettings: { autoReplyOnNoAnswer: true, busyMessage: '' }
  });

  const [loading, setLoading] = useState(true);

  // Product CRUD Form State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productIdToEdit, setProductIdToEdit] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Birthday Gifts');
  const [prodPrice, setProdPrice] = useState('');
  const [prodQuantity, setProdQuantity] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');

  // Twilio Call Simulator Form State
  const [simPhone, setSimPhone] = useState('+91 98765 43210');
  const [simStatus, setSimStatus] = useState('busy'); // 'busy', 'no-answer', 'failed', 'completed'
  const [simulating, setSimulating] = useState(false);

  // Load all dashboard datasets
  const loadDashboardData = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const [prodsData, ordersData, shopData, logsData] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
        api.get('/shop'),
        api.get('/twilio/logs')
      ]);

      setProducts(prodsData || []);
      setOrders(ordersData || []);
      setShopInfo(shopData || {});
      setWhatsappLogs(logsData || []);
    } catch (error) {
      console.error("Error loading admin dataset", error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadDashboardData();
    });
  }, [loadDashboardData]);

  // Check role authorization — only umasgifty01@gmail.com can access admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-10 max-w-md w-full text-center space-y-6 shadow-2xl">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mx-auto">
            <Lock className="h-10 w-10" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Admin Access Only</h1>
            <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              This dashboard is restricted to the store administrator account only.<br/>
              Please sign in with the authorized admin account to continue.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-left space-y-2">
            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wide">Authorized Admin Account</p>
            <p className="text-sm text-white font-mono">umasgifty01@gmail.com</p>
          </div>
          {user ? (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
              ⚠️ Logged in as <strong>{user.email}</strong> — this account does not have admin privileges.
            </p>
          ) : null}
          <a
            href="/login"
            className="block w-full py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl text-sm font-bold shadow-md hover:from-sky-500 hover:to-blue-500 transition-all"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }


  // --- PRODUCT ACTIONS ---
  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodQuantity || !prodImageUrl) {
      alert("Please fill in all required product fields.");
      return;
    }

    const payload = {
      name: prodName,
      category: prodCategory,
      price: parseFloat(prodPrice),
      quantity: parseInt(prodQuantity),
      description: prodDescription,
      imageUrl: prodImageUrl
    };

    try {
      if (isEditingProduct) {
        // Update product
        await api.put(`/products/${productIdToEdit}`, payload);
        alert("Product updated successfully!");
      } else {
        // Add product
        await api.post('/products', payload);
        alert("Product created successfully!");
      }
      // Reset form
      handleResetProductForm();
      // Reload products list
      const updatedProds = await api.get('/products');
      setProducts(updatedProds || []);
    } catch (err) {
      alert(`Product action failed: ${err.message}`);
    }
  };

  const handleEditClick = (p) => {
    setIsEditingProduct(true);
    setProductIdToEdit(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdQuantity(p.quantity);
    setProdDescription(p.description);
    setProdImageUrl(p.imageUrl);
    setActiveTab('products'); // scroll or focus to tab
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product from shelves?")) return;
    try {
      await api.delete(`/products/${id}`);
      alert("Product deleted!");
      const updatedProds = await api.get('/products');
      setProducts(updatedProds || []);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleResetProductForm = () => {
    setIsEditingProduct(false);
    setProductIdToEdit('');
    setProdName('');
    setProdCategory('Personalized Gifts');
    setProdPrice('');
    setProdQuantity('');
    setProdDescription('');
    setProdImageUrl('');
  };

  // --- ORDER ACTIONS ---
  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: nextStatus });
      alert(`Order status updated to ${nextStatus}`);
      const updatedOrders = await api.get('/orders');
      setOrders(updatedOrders || []);
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // --- TWILIO SIMULATOR ---
  const handleSimulateCall = async (e) => {
    e.preventDefault();
    setSimulating(true);
    try {
      const result = await api.post('/twilio/simulate-call', {
        phoneNumber: simPhone,
        status: simStatus
      });
      alert(`Simulation completed! Outgoing Whatsapp Sent: ${result.whatsappSent ? 'YES' : 'NO'}`);
      // Refresh Twilio logs
      const updatedLogs = await api.get('/twilio/logs');
      setWhatsappLogs(updatedLogs || []);
    } catch (err) {
      alert(`Call simulation failed: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  // --- SHOP SETTINGS ACTIONS ---
  const handleUpdateShopInfo = async (e) => {
    e.preventDefault();
    try {
      await api.put('/shop', shopInfo);
      alert("Shop settings and WhatsApp configurations saved!");
      loadDashboardData();
    } catch (err) {
      alert(`Failed to save shop settings: ${err.message}`);
    }
  };

  // Analytics helper metrics
  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const inStockCount = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" /> Workspace Shield
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">Admin Control Room</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Manage products inventory, track order transactions, edit shop settings, and test WhatsApp callbacks.</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Force Sync Data
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
        {[
          { id: 'analytics', name: 'Sales Analytics', icon: BarChart3 },
          { id: 'products', name: 'Product Inventory', icon: Package },
          { id: 'orders', name: 'Track Orders', icon: ShoppingBag },
          { id: 'twilio', name: 'Call Webhooks', icon: PhoneCall },
          { id: 'shop', name: 'Shop Configurations', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
          <p className="text-xs text-zinc-500">Retrieving UMA&apos;S GIFTY analytics vault...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* TAB 1: SALES ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Metric stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Total Gross Sales", value: `₹${totalSales.toLocaleString('en-IN')}`, label: "Delivered & Processing orders", color: "from-emerald-500 to-teal-500" },
                  { name: "Order Transactions", value: orders.length, label: `${pendingOrders} Pending approval`, color: "from-violet-500 to-indigo-500" },
                  { name: "Inventory Units", value: inStockCount, label: `${products.length} catalog items`, color: "from-cyan-500 to-blue-500" },
                  { name: "Database State", value: api.BASE_URL.includes('localhost') ? "Sandbox Mode" : "Cloud Production", label: "Local fallback toggle is active", color: "from-amber-500 to-orange-500" }
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                    <span className="text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{stat.name}</span>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-2">{stat.value}</h3>
                    <p className="text-xxs text-zinc-500 mt-1">{stat.label}</p>
                    <div className={`absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-sm group-hover:scale-125 transition-transform duration-500`}></div>
                  </div>
                ))}
              </div>

              {/* Transactions feed */}
              <div className="glass-panel p-6 rounded-3xl space-y-6">
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3">Recent Transactions Log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-extrabold uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pr-4">Order ID</th>
                        <th className="pb-3 px-4">Customer ID</th>
                        <th className="pb-3 px-4">Items Count</th>
                        <th className="pb-3 px-4">Total Amount</th>
                        <th className="pb-3 px-4">Order Status</th>
                        <th className="pb-3 pl-4 text-right">Edit Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 8).map(order => (
                        <tr key={order.id} className="border-b border-zinc-200/30 dark:border-zinc-800/30 hover:bg-zinc-100/35 dark:hover:bg-zinc-900/35">
                          <td className="py-3.5 pr-4 font-bold text-violet-600 dark:text-violet-400">{order.id}</td>
                          <td className="py-3.5 px-4 font-medium text-zinc-600 dark:text-zinc-350">{order.userId.substring(0, 10)}...</td>
                          <td className="py-3.5 px-4 font-semibold">{order.products.reduce((acc, p) => acc + p.quantity, 0)} items</td>
                          <td className="py-3.5 px-4 font-black">₹{order.totalAmount}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                              order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                              order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="text-[10px] p-1.5 rounded-lg border bg-white dark:bg-zinc-900 dark:border-zinc-800 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product form */}
              <div className="lg:col-span-1">
                <div className="glass-panel p-6 rounded-3xl space-y-6">
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3 flex items-center justify-between">
                    <span>{isEditingProduct ? 'Update Product' : 'Add New Gift'}</span>
                    {isEditingProduct && (
                      <button onClick={handleResetProductForm} className="text-xxs font-bold text-rose-500 hover:underline">Cancel</button>
                    )}
                  </h3>

                  <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Product Title</label>
                      <input 
                        type="text" required placeholder="e.g. Galaxy Lamp" value={prodName} onChange={(e) => setProdName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Category</label>
                      <select 
                        value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none"
                      >
                        <option value="Birthday Gifts">Birthday Gifts</option>
                        <option value="Anniversary Gifts">Anniversary Gifts</option>
                        <option value="Wedding Gifts">Wedding Gifts</option>
                        <option value="Housewarming">Housewarming</option>
                        <option value="Baby Shower">Baby Shower</option>
                        <option value="Festivals">Festivals</option>
                        <option value="Corporate Gifts">Corporate Gifts</option>
                        <option value="Spiritual Gifts">Spiritual Gifts</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Price (₹)</label>
                        <input 
                          type="number" required placeholder="1299" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Stock Qty</label>
                        <input 
                          type="number" required placeholder="15" value={prodQuantity} onChange={(e) => setProdQuantity(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Description</label>
                      <textarea 
                        rows={3} placeholder="Describe materials, smart elements..." value={prodDescription} onChange={(e) => setProdDescription(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Image URL</label>
                      <input 
                        type="text" required placeholder="https://images.unsplash.com/..." value={prodImageUrl} onChange={(e) => setProdImageUrl(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="h-4 w-4" /> {isEditingProduct ? 'Save Updates' : 'Add to Catalog'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Products listing */}
              <div className="lg:col-span-2">
                <div className="glass-panel p-6 rounded-3xl space-y-6 h-full overflow-y-auto max-h-[580px]">
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3">UMA&apos;S GIFTY Active Shelves ({products.length} products)</h3>
                  <div className="space-y-3">
                    {products.map(p => (
                      <div key={p.id} className="border border-zinc-200/50 dark:border-zinc-850 p-4.5 rounded-2xl flex justify-between items-center gap-4 hover:border-violet-500/50 transition-all">
                        <div className="flex items-center gap-4 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] font-extrabold uppercase text-violet-500 tracking-wider">{p.category}</span>
                            <h4 className="text-xs font-extrabold text-zinc-950 dark:text-white truncate">{p.name}</h4>
                            <div className="flex gap-4 text-[10px] text-zinc-400 mt-0.5">
                              <span>Price: <strong>₹{p.price}</strong></span>
                              <span>In Stock: <strong>{p.quantity} units</strong></span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-violet-600 rounded-lg cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-rose-500 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}
          {activeTab === 'orders' && (
            <div className="glass-panel p-6 rounded-3xl space-y-6">
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3">Manage Customer Orders</h3>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400">Order ID: <strong className="text-zinc-700 dark:text-zinc-200">{order.id}</strong></span>
                        <p className="text-[10px] text-zinc-500 mt-1">User UID: {order.userId}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-violet-600 dark:text-violet-400">₹{order.totalAmount}</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-xs p-2 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-800 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {order.products.map((p, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-zinc-500">
                          <span>{p.name} (x{p.quantity})</span>
                          <span className="font-bold">₹{p.price * p.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-zinc-200/30 text-[10px] text-zinc-400">
                      <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                      <p className="mt-1"><strong>Phone Number:</strong> {order.contactPhone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CALL WEBHOOKS SIMULATOR */}
          {activeTab === 'twilio' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Simulator settings */}
              <div className="lg:col-span-1">
                <div className="glass-panel p-6 rounded-3xl space-y-6">
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3 flex items-center gap-1">
                    <PhoneCall className="h-4.5 w-4.5 text-fuchsia-500 animate-bounce" /> Inbound Call Simulator
                  </h3>
                  
                  <div className="p-3 bg-violet-600/5 dark:bg-violet-500/10 rounded-2xl flex gap-2 items-start text-xxs text-zinc-500 dark:text-zinc-400">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-violet-600" />
                    <p>
                      This console triggers the Twilio call status webhook API. If the call status is simulated as &ldquo;busy&rdquo; or &ldquo;no-answer&rdquo;, it dispatches the auto-reply WhatsApp message to the customer.
                    </p>
                  </div>

                  <form onSubmit={handleSimulateCall} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Customer Phone Number</label>
                      <input 
                        type="text" required placeholder="+91 98765 43210" value={simPhone} onChange={(e) => setSimPhone(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Simulated Status</label>
                      <select 
                        value={simStatus} onChange={(e) => setSimStatus(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none font-semibold"
                      >
                        <option value="busy">Busy (Auto-reply WhatsApp)</option>
                        <option value="no-answer">No Answer (Auto-reply WhatsApp)</option>
                        <option value="failed">Failed (Auto-reply WhatsApp)</option>
                        <option value="completed">Completed (Ignore - call answered)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={simulating}
                      className="w-full py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {simulating ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Trigger Simulated Call"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Twilio WhatsApp logs list */}
              <div className="lg:col-span-2">
                <div className="glass-panel p-6 rounded-3xl space-y-6 h-full overflow-y-auto max-h-[500px]">
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3 flex items-center justify-between">
                    <span>WhatsApp Dispatch Logs</span>
                    <button 
                      onClick={async () => {
                        const logs = await api.get('/twilio/logs');
                        setWhatsappLogs(logs || []);
                      }}
                      className="text-xxs font-bold text-violet-600 hover:underline cursor-pointer"
                    >
                      Refresh Logs
                    </button>
                  </h3>
                  
                  <div className="space-y-3">
                    {whatsappLogs.length === 0 ? (
                      <div className="text-center py-16 text-zinc-400 text-xxs">
                        No WhatsApp logs dispatched yet. Trigger a simulated call above!
                      </div>
                    ) : (
                      whatsappLogs.map((log, idx) => {
                        const dateStr = new Date(log.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        });
                        return (
                          <div key={idx} className="border border-zinc-200/50 dark:border-zinc-850 p-4 rounded-xl flex items-start gap-3 justify-between">
                            <div className="flex gap-3 items-start min-w-0">
                              <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-white shrink-0 ${
                                log.status === 'Success' ? 'bg-emerald-500' :
                                log.status === 'Simulated' ? 'bg-blue-500' : 'bg-rose-500'
                              }`}>
                                {log.status === 'Success' ? <Check className="h-4 w-4" /> :
                                 log.status === 'Simulated' ? <MessageSquare className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                              </span>
                              <div className="min-w-0 text-xxs leading-normal">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-zinc-950 dark:text-white">To: {log.to}</span>
                                  <span className="text-[10px] text-zinc-400">{dateStr}</span>
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-450 mt-1 italic">&ldquo;{log.message}&rdquo;</p>
                                {log.error && <p className="text-rose-500 mt-1 font-bold">Error: {log.error}</p>}
                              </div>
                            </div>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' :
                              log.status === 'Simulated' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SHOP SETTINGS AND CONFIGS */}
          {activeTab === 'shop' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-3xl">
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3">Update Shop Portal Settings</h3>
              
              <form onSubmit={handleUpdateShopInfo} className="space-y-4 pt-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Shop Name</label>
                    <input 
                      type="text" required value={shopInfo.shopName} onChange={(e) => setShopInfo({ ...shopInfo, shopName: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Support Email Address</label>
                    <input 
                      type="email" required value={shopInfo.email} onChange={(e) => setShopInfo({ ...shopInfo, email: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Shop Description (Tagline)</label>
                  <textarea 
                    rows={2} required value={shopInfo.description} onChange={(e) => setShopInfo({ ...shopInfo, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Postal Address</label>
                  <textarea 
                    rows={2} required value={shopInfo.address} onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Customer Care Phone</label>
                    <input 
                      type="text" required value={shopInfo.phone} onChange={(e) => setShopInfo({ ...shopInfo, phone: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">WhatsApp Contact Link</label>
                    <input 
                      type="text" required value={shopInfo.whatsapp} onChange={(e) => setShopInfo({ ...shopInfo, whatsapp: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Business Hours</label>
                    <input 
                      type="text" required value={shopInfo.businessHours} onChange={(e) => setShopInfo({ ...shopInfo, businessHours: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Google Maps Embed URL</label>
                    <input 
                      type="text" required value={shopInfo.googleMapsEmbedUrl} onChange={(e) => setShopInfo({ ...shopInfo, googleMapsEmbedUrl: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-4">
                  <h4 className="font-extrabold text-sm text-zinc-950 dark:text-white">WhatsApp Auto-Reply settings</h4>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" id="autoreply"
                      checked={shopInfo.whatsappSettings?.autoReplyOnNoAnswer} 
                      onChange={(e) => setShopInfo({ 
                        ...shopInfo, 
                        whatsappSettings: { 
                          ...shopInfo.whatsappSettings, 
                          autoReplyOnNoAnswer: e.target.checked 
                        } 
                      })}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="autoreply" className="text-xxs font-bold text-zinc-500 uppercase">Enable Auto-Reply on Inbound Call Failures</label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">WhatsApp Busy Text Template</label>
                    <textarea 
                      rows={2} required 
                      value={shopInfo.whatsappSettings?.busyMessage} 
                      onChange={(e) => setShopInfo({ 
                        ...shopInfo, 
                        whatsappSettings: { 
                          ...shopInfo.whatsappSettings, 
                          busyMessage: e.target.value 
                        } 
                      })}
                      className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 font-semibold"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="py-3 px-6 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Save Shop Config
                  </button>
                </div>
              </form>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}

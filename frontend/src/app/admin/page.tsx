"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, Package, ShoppingCart, Star, StarOff,
  Plus, Edit3, Trash2, X, Upload, LogOut, ChevronDown,
  TrendingUp, AlertTriangle, Eye, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

// ─── TYPES ────────────────────────────────────────────────
type Tab = 'overview' | 'products' | 'orders';

interface Product {
  id: string; name: string; slug: string; description: string;
  price: string | number; sku: string; stock: number;
  categoryId: string; category?: { id: string; name: string };
  images: string[]; material?: string; gemstone?: string;
  isFeatured: boolean; createdAt: string;
}

interface Category {
  id: string; name: string; slug: string;
}

interface OrderItem {
  id: string; quantity: number; price: string | number;
  product: { id: string; name: string; images: string[]; slug: string };
}

interface Order {
  id: string; status: string; total: string | number;
  createdAt: string; user: { id: string; email: string };
  items: OrderItem[];
}

interface Stats {
  products: number; orders: number; revenue: number; lowStock: number;
}

const API_URL = '/api';

// ─── MOCK DATA (used when backend has no data) ───────────
const MOCK_STATS: Stats = { products: 6, orders: 12, revenue: 156200, lowStock: 2 };

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001', status: 'CRAFTING', total: 14600, createdAt: '2026-03-28T00:00:00Z',
    user: { id: '1', email: 'alexandra@example.com' },
    items: [
      { id: 'i1', quantity: 1, price: 12500, product: { id: 'p1', name: 'Emerald Cut Diamond Ring', images: ['/images/ring.png'], slug: 'emerald-cut-diamond-ring' } },
      { id: 'i2', quantity: 1, price: 2100, product: { id: 'p2', name: 'Minimalist Gold Pendant', images: ['/images/necklace.png'], slug: 'minimalist-gold-pendant' } },
    ],
  },
  {
    id: 'ORD-002', status: 'DELIVERED', total: 8200, createdAt: '2026-03-15T00:00:00Z',
    user: { id: '2', email: 'james@example.com' },
    items: [
      { id: 'i3', quantity: 1, price: 8200, product: { id: 'p3', name: 'Classic Solitaire Ring', images: ['/images/ring.png'], slug: 'classic-solitaire-ring' } },
    ],
  },
  {
    id: 'ORD-003', status: 'SHIPPED', total: 24000, createdAt: '2026-03-10T00:00:00Z',
    user: { id: '3', email: 'sophia@example.com' },
    items: [
      { id: 'i4', quantity: 1, price: 24000, product: { id: 'p4', name: 'Diamond Tennis Necklace', images: ['/images/necklace.png'], slug: 'diamond-tennis-necklace' } },
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  PROCESSING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  CONFIRMED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  CRAFTING: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  SHIPPED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  DELIVERED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const headers = { 'Content-Type': 'application/json' };

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading, openAuthModal } = useAuth();

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats>(MOCK_STATS);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productModal, setProductModal] = useState<Product | 'new' | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Product form state
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', sku: '',
    stock: '0', categoryId: '', material: '', gemstone: '',
    isFeatured: false, images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);


  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Auth check
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      if (!user) openAuthModal();
      router.push('/');
    }
  }, [authLoading, user, router, openAuthModal]);

  // Load data
  const loadData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, catsRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers }).catch(() => null),
        fetch(`${API_URL}/admin/products`, { headers }).catch(() => null),
        fetch(`${API_URL}/admin/orders`, { headers }).catch(() => null),
        fetch(`${API_URL}/admin/categories`, { headers }).catch(() => null),
      ]);

      if (statsRes?.ok) setStats(await statsRes.json());
      if (productsRes?.ok) setProducts(await productsRes.json());
      if (ordersRes?.ok) {
        const data = await ordersRes.json();
        setOrders(data.length > 0 ? data : MOCK_ORDERS);
      }
      if (catsRes?.ok) setCategories(await catsRes.json());
    } catch {}
    setIsLoading(false);
    }, [user, headers]); // Added headers as potentially stable or included
  
    useEffect(() => {
      if (user?.role === 'ADMIN') loadData();
    }, [user, loadData]);

  // Product form helpers
  const openNewProduct = () => {
    setForm({ name: '', slug: '', description: '', price: '', sku: '', stock: '0', categoryId: categories[0]?.id || '', material: '', gemstone: '', isFeatured: false, images: [] });
    setProductModal('new');
  };

  const openEditProduct = (p: Product) => {
    setForm({
      name: p.name, slug: p.slug, description: p.description,
      price: String(p.price), sku: p.sku, stock: String(p.stock),
      categoryId: p.categoryId, material: p.material || '',
      gemstone: p.gemstone || '', isFeatured: p.isFeatured,
      images: p.images,
    });
    setProductModal(p);
  };

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_URL}/admin/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const { url } = await res.json();
        setForm(f => ({ ...f, images: [...f.images, url] }));
      } else {
        showToast('Upload failed');
      }
    } catch {
      // Fallback: use local path
      const url = URL.createObjectURL(file);
      setForm(f => ({ ...f, images: [...f.images, '/images/ring.png'] }));
      showToast('Using placeholder — backend may be offline');
    }
    setUploading(false);
  };

  const saveProduct = async () => {
    if (!form.name || !form.slug || !form.price || !form.sku) {
      showToast('Please fill required fields');
      return;
    }

    try {
      const method = productModal === 'new' ? 'POST' : 'PUT';
      const url = productModal === 'new'
        ? `${API_URL}/admin/products`
        : `${API_URL}/admin/products/${(productModal as Product).id}`;

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(productModal === 'new' ? 'Product created ✓' : 'Product updated ✓');
        setProductModal(null);
        loadData();
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to save');
      }
    } catch {
      showToast('Failed to save — check backend');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE', headers,
      });
      if (res.ok) {
        setProducts(p => p.filter(x => x.id !== id));
        showToast('Product deleted');
      }
    } catch {
      showToast('Delete failed');
    }
    setDeleteConfirm(null);
  };

  const toggleFeatured = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'PATCH', 
        headers,
        body: JSON.stringify({ featured: !products.find(p => p.id === id)?.isFeatured })
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(p => p.map(x => x.id === id ? updated : x));
        showToast(updated.isFeatured ? 'Marked as featured ⭐' : 'Removed from featured');
      }
    } catch {
      showToast('Failed to update');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(o => o.map(x => x.id === orderId ? updated : x));
        showToast(`Order status updated to ${status}`);
      }
    } catch {
      // Update locally for mock
      setOrders(o => o.map(x => x.id === orderId ? { ...x, status } : x));
      showToast(`Order status updated to ${status}`);
    }
  };

  // Auth guard
  if (authLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredProducts = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  const inputCls = "w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition";

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-[#1a1a1e]">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-serif tracking-widest text-primary">AURA</span>
            <span className="text-xs tracking-widest text-gray-500 border-l border-[#2a2a2e] pl-4">ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 tracking-wide hidden sm:block">{user.email}</span>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-2 text-xs tracking-widest text-gray-400 hover:text-white transition"
            >
              <LogOut size={14} /> EXIT
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <nav className="flex gap-1 mb-8 bg-[#111114] rounded-xl p-1 w-fit">
          {[
            { key: 'overview' as Tab, label: 'Overview', icon: <LayoutDashboard size={16} /> },
            { key: 'products' as Tab, label: 'Products', icon: <Package size={16} /> },
            { key: 'orders' as Tab, label: 'Orders', icon: <ShoppingCart size={16} /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm tracking-wider transition-all ${
                tab === t.key
                  ? 'bg-primary text-black font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1e]'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Products', value: stats.products, icon: <Package size={20} className="text-primary" />, color: 'border-primary/20' },
                { label: 'Total Orders', value: stats.orders, icon: <ShoppingCart size={20} className="text-blue-400" />, color: 'border-blue-400/20' },
                { label: 'Revenue', value: `$${Number(stats.revenue).toLocaleString()}`, icon: <TrendingUp size={20} className="text-emerald-400" />, color: 'border-emerald-400/20' },
                { label: 'Low Stock', value: stats.lowStock, icon: <AlertTriangle size={20} className="text-amber-400" />, color: 'border-amber-400/20' },
              ].map(stat => (
                <div key={stat.label} className={`bg-[#111114] border ${stat.color} rounded-xl p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-widest text-gray-400 uppercase">{stat.label}</span>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-serif">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-[#111114] border border-[#1a1a1e] rounded-xl p-6">
              <h3 className="text-sm tracking-widest text-gray-400 uppercase mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-[#1a1a1e] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#1a1a1e] overflow-hidden relative">
                        <Image src={order.items[0]?.product.images[0] || '/images/ring.png'} alt="" fill className="object-cover" sizes="32px" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">${Number(order.total).toLocaleString()}</span>
                      <span className={`text-[10px] tracking-wider px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111114] border border-[#1a1a1e] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition"
                />
              </div>
              <button
                onClick={openNewProduct}
                className="flex items-center gap-2 bg-primary text-black px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium hover:bg-primary/90 transition"
              >
                <Plus size={16} /> ADD PRODUCT
              </button>
            </div>

            {/* Product Table */}
            <div className="bg-[#111114] border border-[#1a1a1e] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1a1a1e]">
                      <th className="text-left text-[10px] tracking-widest text-gray-500 uppercase px-5 py-3">Product</th>
                      <th className="text-left text-[10px] tracking-widest text-gray-500 uppercase px-5 py-3">SKU</th>
                      <th className="text-left text-[10px] tracking-widest text-gray-500 uppercase px-5 py-3">Price</th>
                      <th className="text-left text-[10px] tracking-widest text-gray-500 uppercase px-5 py-3">Stock</th>
                      <th className="text-center text-[10px] tracking-widest text-gray-500 uppercase px-5 py-3">Featured</th>
                      <th className="text-right text-[10px] tracking-widest text-gray-500 uppercase px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-b border-[#1a1a1e] last:border-0 hover:bg-[#151518] transition">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 rounded bg-[#1a1a1e] overflow-hidden relative shrink-0 border border-[#2a2a2e]">
                              <Image src={product.images[0] || '/images/ring.png'} alt={product.name} fill className="object-cover" sizes="40px" />
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[200px]">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.category?.name || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-400 tracking-wide">{product.sku}</td>
                        <td className="px-5 py-4 text-sm font-serif italic text-primary">
                          ${Number(product.price).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-medium ${product.stock < 5 ? 'text-amber-400' : 'text-gray-400'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button onClick={() => toggleFeatured(product.id)} className="transition hover:scale-110">
                            {product.isFeatured
                              ? <Star size={18} className="text-primary fill-primary" />
                              : <StarOff size={18} className="text-gray-600 hover:text-gray-400" />
                            }
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditProduct(product)} className="p-2 text-gray-500 hover:text-white transition">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirm(product.id)} className="p-2 text-gray-500 hover:text-red-400 transition">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Package size={32} className="mx-auto mb-3" strokeWidth={1} />
                  <p className="text-sm">No products found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => {
              const open = expandedOrder === order.id;
              return (
                <div key={order.id} className="bg-[#111114] border border-[#1a1a1e] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedOrder(open ? null : order.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#151518] transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-[#1a1a1e] overflow-hidden relative border border-[#2a2a2e]">
                        <Image src={order.items[0]?.product.images[0] || '/images/ring.png'} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.user.email} · {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-serif">${Number(order.total).toLocaleString()}</span>
                      <span className={`text-[10px] tracking-wider px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                      <ChevronDown size={16} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[#1a1a1e] p-5 space-y-4 bg-[#0d0d10]">
                          {/* Items */}
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 py-2">
                              <div className="w-12 h-14 rounded bg-[#1a1a1e] overflow-hidden relative border border-[#2a2a2e]">
                                <Image src={item.product.images[0] || '/images/ring.png'} alt="" fill className="object-cover" sizes="48px" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">{item.product.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-serif italic text-primary">${Number(item.price).toLocaleString()}</p>
                            </div>
                          ))}

                          {/* Status Update */}
                          <div className="flex items-center gap-3 pt-4 border-t border-[#1a1a1e]">
                            <span className="text-xs text-gray-400 tracking-wider">UPDATE STATUS:</span>
                            <div className="flex gap-2 flex-wrap">
                              {['PROCESSING', 'CONFIRMED', 'CRAFTING', 'SHIPPED', 'DELIVERED'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateOrderStatus(order.id, s)}
                                  className={`text-[10px] tracking-wider px-3 py-1.5 rounded-full border transition ${
                                    order.status === s
                                      ? `${STATUS_COLORS[s]} font-medium`
                                      : 'border-[#2a2a2e] text-gray-500 hover:border-gray-400 hover:text-gray-300'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── PRODUCT MODAL ─────────────────────────────────── */}
      <AnimatePresence>
        {productModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setProductModal(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-[#111114] border border-[#2a2a2e] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-serif tracking-wide">
                  {productModal === 'new' ? 'Add New Product' : 'Edit Product'}
                </h3>
                <button onClick={() => setProductModal(null)} className="text-gray-500 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 tracking-wider mb-1 block">Name *</label>
                    <input className={inputCls} value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) })); }} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 tracking-wider mb-1 block">Slug *</label>
                    <input className={inputCls} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 tracking-wider mb-1 block">Description *</label>
                  <textarea className={`${inputCls} min-h-[80px]`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 tracking-wider mb-1 block">Price *</label>
                    <input className={inputCls} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 tracking-wider mb-1 block">SKU *</label>
                    <input className={inputCls} value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 tracking-wider mb-1 block">Stock</label>
                    <input className={inputCls} type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 tracking-wider mb-1 block">Category</label>
                    <select className={inputCls} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                      <option value="">Select...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 tracking-wider mb-1 block">Material</label>
                    <input className={inputCls} value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 tracking-wider mb-1 block">Gemstone</label>
                    <input className={inputCls} value={form.gemstone} onChange={e => setForm(f => ({ ...f, gemstone: e.target.value }))} />
                  </div>
                </div>

                {/* Featured toggle */}
                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${form.isFeatured ? 'bg-primary' : 'bg-[#2a2a2e]'}`}
                    onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.isFeatured ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-300">Featured on Homepage</span>
                </label>

                {/* Images */}
                <div>
                  <label className="text-xs text-gray-400 tracking-wider mb-2 block">Images</label>
                  <div className="flex gap-3 flex-wrap mb-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-20 rounded bg-[#1a1a1e] border border-[#2a2a2e] overflow-hidden">
                        <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                        <button
                          onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 border border-dashed border-[#2a2a2e] rounded-lg px-4 py-3 cursor-pointer hover:border-primary/50 transition text-sm text-gray-400">
                    <Upload size={16} />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>

                <button
                  onClick={saveProduct}
                  className="w-full bg-primary text-black py-3.5 rounded-lg text-sm tracking-widest font-medium hover:bg-primary/90 transition mt-4"
                >
                  {productModal === 'new' ? 'CREATE PRODUCT' : 'SAVE CHANGES'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DELETE CONFIRM ────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-[#111114] border border-[#2a2a2e] rounded-xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <Trash2 size={32} className="mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-serif mb-2">Delete Product?</h3>
              <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-[#2a2a2e] rounded-lg py-2.5 text-sm text-gray-400 hover:text-white hover:border-gray-500 transition">
                  CANCEL
                </button>
                <button onClick={() => deleteProduct(deleteConfirm)} className="flex-1 bg-red-500 rounded-lg py-2.5 text-sm font-medium hover:bg-red-600 transition">
                  DELETE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TOAST ─────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[120] bg-primary text-black px-6 py-3 rounded-lg shadow-2xl text-sm font-medium tracking-wide flex items-center gap-2"
          >
            {toast}
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

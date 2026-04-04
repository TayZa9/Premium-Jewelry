"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  User, ShoppingBag, Clock, MapPin, CreditCard, LogOut,
  ChevronDown, ChevronRight, Plus, Edit3, Trash2, Star,
  Package, Truck, CheckCircle, Gift, Heart, X, Camera,
  Home, Briefcase, MoreHorizontal, RefreshCw, MessageSquare
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

// ─── TYPES ────────────────────────────────────────────────
type Section = 'overview' | 'orders' | 'history' | 'addresses' | 'payments';
type OrderStatus = 'Processing' | 'Confirmed' | 'Crafting' | 'Shipped' | 'Delivered';
type Tier = 'Silver' | 'Gold' | 'Platinum';

interface Order {
  id: string; date: string; status: OrderStatus; total: string; estimatedDelivery: string;
  items: { name: string; image: string; price: string; variant: string; quantity: number; slug: string; sku: string }[];
  tracking: { date: string; text: string }[];
}
interface Address {
  id: string; label: string; name: string; line1: string; line2: string; city: string; state: string; zip: string; country: string; phone: string; isDefault: boolean;
}
interface PaymentMethod {
  id: string; type: 'visa' | 'mastercard'; last4: string; expiry: string; name: string; isDefault: boolean;
}

// ─── MOCK DATA ────────────────────────────────────────────
const CUSTOMER = { name: 'Alexandra Chen', email: 'alexandra@example.com', tier: 'Gold' as Tier, points: 4250, joined: 'Jan 2024' };

const STATUS_STEPS: OrderStatus[] = ['Processing', 'Confirmed', 'Crafting', 'Shipped', 'Delivered'];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-1847', date: 'Mar 28, 2026', status: 'Crafting', total: '$14,600', estimatedDelivery: 'Apr 15, 2026',
    items: [
      { name: 'Emerald Cut Diamond Ring', image: '/images/ring.png', price: '$12,500', variant: '18k Rose Gold, Size 7', quantity: 1, slug: 'emerald-cut-diamond-ring', sku: 'ECR-RG-7' },
      { name: 'Minimalist Gold Pendant', image: '/images/necklace.png', price: '$2,100', variant: '14k Yellow Gold', quantity: 1, slug: 'minimalist-gold-pendant', sku: 'MGP-YG' },
    ],
    tracking: [
      { date: 'Mar 28', text: 'Order placed successfully' },
      { date: 'Mar 29', text: 'Payment confirmed' },
      { date: 'Mar 31', text: 'Artisan crafting began — est. 10 business days' },
    ],
  },
  {
    id: 'ORD-2024-1532', date: 'Feb 14, 2026', status: 'Delivered', total: '$2,100', estimatedDelivery: 'Mar 1, 2026',
    items: [{ name: 'Minimalist Gold Pendant', image: '/images/necklace.png', price: '$2,100', variant: '14k Yellow Gold', quantity: 1, slug: 'minimalist-gold-pendant', sku: 'MGP-YG' }],
    tracking: [
      { date: 'Feb 14', text: 'Order placed' },
      { date: 'Feb 15', text: 'Payment confirmed' },
      { date: 'Feb 18', text: 'Crafting complete' },
      { date: 'Feb 22', text: 'Shipped via FedEx (TRK#8374628)' },
      { date: 'Feb 28', text: 'Delivered — signed by A. Chen' },
    ],
  },
  {
    id: 'ORD-2024-1201', date: 'Jan 5, 2026', status: 'Delivered', total: '$12,500', estimatedDelivery: 'Jan 22, 2026',
    items: [{ name: 'Emerald Cut Diamond Ring', image: '/images/ring.png', price: '$12,500', variant: '18k White Gold, Size 6', quantity: 1, slug: 'emerald-cut-diamond-ring', sku: 'ECR-WG-6' }],
    tracking: [
      { date: 'Jan 5', text: 'Order placed' },
      { date: 'Jan 6', text: 'Payment confirmed' },
      { date: 'Jan 12', text: 'Crafting complete' },
      { date: 'Jan 16', text: 'Shipped' },
      { date: 'Jan 20', text: 'Delivered' },
    ],
  },
];

const MOCK_ADDRESSES: Address[] = [
  { id: 'a1', label: 'Home', name: 'Alexandra Chen', line1: '1428 Wilshire Blvd', line2: 'Apt 12A', city: 'Beverly Hills', state: 'CA', zip: '90210', country: 'United States', phone: '+1 (310) 555-0142', isDefault: true },
  { id: 'a2', label: 'Office', name: 'Alexandra Chen', line1: '9100 Constellation Blvd', line2: 'Floor 34', city: 'Los Angeles', state: 'CA', zip: '90067', country: 'United States', phone: '+1 (310) 555-0198', isDefault: false },
];

const MOCK_PAYMENTS: PaymentMethod[] = [
  { id: 'p1', type: 'visa', last4: '4242', expiry: '09/28', name: 'Alexandra Chen', isDefault: true },
  { id: 'p2', type: 'mastercard', last4: '8888', expiry: '03/27', name: 'Alexandra Chen', isDefault: false },
];

const TIER_COLORS: Record<Tier, string> = {
  Silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
  Gold: 'bg-primary/20 text-primary border-primary/30',
  Platinum: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
};
const LABEL_ICONS: Record<string, React.ReactNode> = {
  Home: <Home size={14} />, Office: <Briefcase size={14} />, Other: <MoreHorizontal size={14} />,
};

// ─── TOAST ────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-primary text-black px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-up font-medium text-sm tracking-wide">
      <CheckCircle size={18} /> {message}
      <button onClick={onClose} className="ml-2 hover:opacity-70"><X size={14} /></button>
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatus }) {
  const colors: Record<OrderStatus, string> = {
    Processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Confirmed: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Crafting: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return <span className={`text-xs tracking-wider px-3 py-1 rounded-full border font-medium ${colors[status]}`}>{status.toUpperCase()}</span>;
}

// ─── PROGRESS BAR ─────────────────────────────────────────
function OrderProgress({ status }: { status: OrderStatus }) {
  const idx = STATUS_STEPS.indexOf(status);
  const icons = [ShoppingBag, CheckCircle, Gift, Truck, Package];
  return (
    <div className="flex items-center justify-between w-full my-6 px-2">
      {STATUS_STEPS.map((step, i) => {
        const Icon = icons[i];
        const done = i <= idx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'border-primary bg-primary/20 text-primary' : 'border-border bg-surface text-muted-foreground'}`}>
                <Icon size={16} />
              </div>
              <span className={`text-[10px] mt-2 tracking-wide ${done ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{step}</span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mt-[-18px] transition-all ${i < idx ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const { user, logout, isLoading, openAuthModal } = useAuth();
  const [section, setSection] = useState<Section>('overview');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [payments, setPayments] = useState<PaymentMethod[]>(MOCK_PAYMENTS);
  const [addressModal, setAddressModal] = useState<Address | null | 'new'>(null);
  const [cardModal, setCardModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<{ status: string; category: string }>({ status: 'all', category: 'all' });
  const [historyPage, setHistoryPage] = useState(1);
  const [formAddr, setFormAddr] = useState<Omit<Address, 'id' | 'isDefault'>>({ label: 'Home', name: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'United States', phone: '' });
  const [formCard, setFormCard] = useState({ number: '', expiry: '', name: '', cvc: '' });

  useEffect(() => {
    if (!isLoading && !user) {
      openAuthModal();
      router.push('/');
    }
  }, [isLoading, user, router, openAuthModal]);

  if (isLoading || !user) return (
    <div className="min-h-[calc(100vh-88px)] bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const showToast = (msg: string) => setToast(msg);

  const handleReorder = (item: Order['items'][0]) => {
    addItem({ id: item.slug, slug: item.slug, sku: item.sku, name: item.name, price: item.price, image: item.image, quantity: 1 });
    showToast(`${item.name} added to cart ✓`);
  };

  const deleteAddress = (id: string) => { setAddresses(a => a.filter(x => x.id !== id)); showToast('Address removed'); };
  const setDefaultAddress = (id: string) => { setAddresses(a => a.map(x => ({ ...x, isDefault: x.id === id }))); showToast('Default address updated'); };
  const deletePayment = (id: string) => { setPayments(p => p.filter(x => x.id !== id)); showToast('Payment method removed'); };

  const saveAddress = () => {
    if (!formAddr.name || !formAddr.line1 || !formAddr.city) return;
    if (addressModal === 'new') {
      setAddresses(a => [...a, { ...formAddr, id: `a${Date.now()}`, isDefault: a.length === 0 }]);
      showToast('Address added');
    } else if (addressModal) {
      setAddresses(a => a.map(x => x.id === (addressModal as Address).id ? { ...x, ...formAddr } : x));
      showToast('Address updated');
    }
    setAddressModal(null);
  };

  const saveCard = () => {
    if (formCard.number.length < 16) return;
    const type = formCard.number.startsWith('5') ? 'mastercard' as const : 'visa' as const;
    setPayments(p => [...p, { id: `p${Date.now()}`, type, last4: formCard.number.slice(-4), expiry: formCard.expiry, name: formCard.name, isDefault: p.length === 0 }]);
    setCardModal(false);
    setFormCard({ number: '', expiry: '', name: '', cvc: '' });
    showToast('Card added');
  };

  const openEditAddress = (addr: Address) => {
    setFormAddr({ label: addr.label, name: addr.name, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, zip: addr.zip, country: addr.country, phone: addr.phone });
    setAddressModal(addr);
  };

  const openNewAddress = () => {
    setFormAddr({ label: 'Home', name: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'United States', phone: '' });
    setAddressModal('new');
  };

  const allOrders = MOCK_ORDERS;
  const filteredHistory = allOrders.filter(o => {
    if (historyFilter.status !== 'all' && o.status !== historyFilter.status) return false;
    return true;
  });

  // Nav items
  const NAV: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <User size={18} /> },
    { key: 'orders', label: 'Order Tracking', icon: <Truck size={18} /> },
    { key: 'history', label: 'Purchase History', icon: <Clock size={18} /> },
    { key: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { key: 'payments', label: 'Payment Methods', icon: <CreditCard size={18} /> },
  ];

  // ─── SECTIONS ─────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary text-2xl font-serif relative group cursor-pointer">
          AC
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Camera size={18} className="text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-serif tracking-wide">Welcome back, {(user.name || user.email.split('@')[0]).split(' ')[0]}</h2>
          <p className="text-muted-foreground text-sm mt-1">Member since {CUSTOMER.joined}</p>
          <span className={`inline-flex items-center gap-1.5 text-xs tracking-wider px-3 py-1 rounded-full border font-medium mt-2 ${TIER_COLORS[CUSTOMER.tier]}`}>
            <Star size={12} fill="currentColor" /> {CUSTOMER.tier.toUpperCase()} MEMBER
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: allOrders.length, icon: <ShoppingBag size={20} className="text-primary" /> },
          { label: 'Reward Points', value: CUSTOMER.points.toLocaleString(), icon: <Gift size={20} className="text-primary" /> },
          { label: 'Wishlist Items', value: 5, icon: <Heart size={20} className="text-primary" /> },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border rounded-lg p-5 flex items-center gap-4 hover:border-primary/40 transition">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">{s.icon}</div>
            <div>
              <div className="text-2xl font-serif text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground tracking-wider uppercase">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders minilist */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif tracking-wide">Recent Orders</h3>
          <button onClick={() => setSection('orders')} className="text-xs text-primary tracking-wider hover:underline">VIEW ALL</button>
        </div>
        {allOrders.slice(0, 2).map(o => (
          <div key={o.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-surface overflow-hidden relative">
                <Image src={o.items[0].image} alt={o.items[0].name} fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <p className="text-sm font-medium">{o.id}</p>
                <p className="text-xs text-muted-foreground">{o.date}</p>
              </div>
            </div>
            <StatusBadge status={o.status} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-serif tracking-wide mb-6">Order Tracking</h2>
      {allOrders.map(order => {
        const open = expandedOrder === order.id;
        return (
          <div key={order.id} className="border border-border rounded-lg overflow-hidden bg-surface hover:border-primary/30 transition">
            <button onClick={() => setExpandedOrder(open ? null : order.id)} className="w-full flex items-center justify-between p-5 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-background overflow-hidden relative border border-border">
                  <Image src={order.items[0].image} alt="" fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.date} · {order.total}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <ChevronDown size={16} className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {open && (
              <div className="border-t border-border p-5 space-y-6 bg-background/50">
                <OrderProgress status={order.status} />
                <div className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Estimated Delivery:</span> {order.estimatedDelivery}
                </div>
                {/* Items */}
                {order.items.map(item => (
                  <div key={item.sku} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                    <div className="w-14 h-14 rounded bg-surface overflow-hidden relative border border-border">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.variant} · Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{item.price}</p>
                  </div>
                ))}
                {/* Tracking Timeline */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><Package size={14} className="text-primary" /> Tracking Timeline</h4>
                  <div className="space-y-3 ml-2">
                    {order.tracking.map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-border'}`} />
                          {i < order.tracking.length - 1 && <div className="w-px h-6 bg-border" />}
                        </div>
                        <div className="pb-1">
                          <p className="text-xs font-medium">{t.text}</p>
                          <p className="text-[10px] text-muted-foreground">{t.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-serif tracking-wide">Purchase History</h2>
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={historyFilter.status} onChange={e => setHistoryFilter(f => ({ ...f, status: e.target.value }))} className="bg-surface border border-border rounded-lg px-3 py-2 text-xs tracking-wider text-foreground">
          <option value="all">All Status</option>
          {STATUS_STEPS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {/* List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <ShoppingBag size={32} className="mx-auto text-muted-foreground mb-4" strokeWidth={1} />
            <p className="text-muted-foreground text-sm">No orders match your filter.</p>
          </div>
        )}
        {filteredHistory.map(order => order.items.map(item => (
          <div key={`${order.id}-${item.sku}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface border border-border rounded-lg p-4 hover:border-primary/30 transition">
            <div className="w-16 h-16 rounded bg-background overflow-hidden relative border border-border shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.variant} · Qty {item.quantity}</p>
              <p className="text-xs text-muted-foreground">{order.date} · {order.id}</p>
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
              <p className="text-sm font-medium">{item.price}</p>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex gap-2 sm:flex-col mt-2 sm:mt-0">
              <button onClick={() => handleReorder(item)} className="flex items-center gap-1.5 text-xs tracking-wider border border-primary text-primary px-3 py-1.5 rounded hover:bg-primary hover:text-black transition">
                <RefreshCw size={12} /> RE-ORDER
              </button>
              {order.status === 'Delivered' && (
                <button className="flex items-center gap-1.5 text-xs tracking-wider border border-border text-muted-foreground px-3 py-1.5 rounded hover:border-foreground hover:text-foreground transition">
                  <MessageSquare size={12} /> REVIEW
                </button>
              )}
            </div>
          </div>
        )))}
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif tracking-wide">Saved Addresses</h2>
        <button onClick={openNewAddress} className="flex items-center gap-1.5 text-xs tracking-wider border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-black transition">
          <Plus size={14} /> ADD ADDRESS
        </button>
      </div>
      {addresses.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <MapPin size={32} className="mx-auto text-muted-foreground mb-4" strokeWidth={1} />
          <p className="text-muted-foreground text-sm">No saved addresses yet.</p>
          <button onClick={openNewAddress} className="mt-4 text-primary text-xs tracking-wider hover:underline">ADD YOUR FIRST ADDRESS</button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className={`border rounded-lg p-5 relative transition ${addr.isDefault ? 'border-primary/50 bg-primary/5' : 'border-border bg-surface'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-xs tracking-wider px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground">{LABEL_ICONS[addr.label]}{addr.label}</span>
              {addr.isDefault && <span className="text-[10px] tracking-wider text-primary font-medium">DEFAULT</span>}
            </div>
            <p className="text-sm font-medium">{addr.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
            <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
            <p className="text-xs text-muted-foreground">{addr.phone}</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => openEditAddress(addr)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition"><Edit3 size={12} /> Edit</button>
              <button onClick={() => deleteAddress(addr.id)} className="text-xs text-muted-foreground hover:text-red-400 flex items-center gap-1 transition"><Trash2 size={12} /> Delete</button>
              {!addr.isDefault && <button onClick={() => setDefaultAddress(addr.id)} className="text-xs text-primary hover:underline">Set as default</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif tracking-wide">Payment Methods</h2>
        <button onClick={() => { setFormCard({ number: '', expiry: '', name: '', cvc: '' }); setCardModal(true); }} className="flex items-center gap-1.5 text-xs tracking-wider border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-black transition">
          <Plus size={14} /> ADD CARD
        </button>
      </div>
      {payments.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <CreditCard size={32} className="mx-auto text-muted-foreground mb-4" strokeWidth={1} />
          <p className="text-muted-foreground text-sm">No saved payment methods.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payments.map(card => (
          <div key={card.id} className={`border rounded-lg p-5 transition ${card.isDefault ? 'border-primary/50 bg-primary/5' : 'border-border bg-surface'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium tracking-wider">{card.type === 'visa' ? '𝗩𝗜𝗦𝗔' : '⬤⬤ Mastercard'}</span>
              {card.isDefault && <span className="text-[10px] tracking-wider text-primary font-medium">DEFAULT</span>}
            </div>
            <p className="text-lg tracking-[0.35em] text-foreground font-mono">•••• •••• •••• {card.last4}</p>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>{card.name}</span>
              <span>Exp {card.expiry}</span>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => deletePayment(card.id)} className="text-xs text-muted-foreground hover:text-red-400 flex items-center gap-1 transition"><Trash2 size={12} /> Remove</button>
              {!card.isDefault && <button onClick={() => { setPayments(p => p.map(x => ({ ...x, isDefault: x.id === card.id }))); showToast('Default card updated'); }} className="text-xs text-primary hover:underline">Set as default</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SECTION_MAP: Record<Section, () => React.ReactNode> = { overview: renderOverview, orders: renderOrders, history: renderHistory, addresses: renderAddresses, payments: renderPayments };

  // ─── MODAL ──────────────────────────────────────────────
  const renderModal = (title: string, onClose: () => void, children: React.ReactNode) => (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-serif tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );

  const inputCls = "w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition";

  return (
    <div className="min-h-[calc(100vh-88px)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-serif tracking-widest uppercase">My Account</h1>
            <p className="text-muted-foreground text-sm mt-1 tracking-wide">{user.email}</p>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="hidden sm:flex items-center gap-2 text-xs tracking-widest text-muted-foreground hover:text-foreground transition">
            <LogOut size={16} /> SIGN OUT
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar ─ desktop */}
          <nav className="hidden lg:flex flex-col w-56 shrink-0 space-y-1">
            {NAV.map(n => (
              <button key={n.key} onClick={() => setSection(n.key)} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm tracking-wider transition ${section === n.key ? 'bg-primary/10 text-primary font-medium border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-surface'}`}>
                {n.icon} {n.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">{SECTION_MAP[section]()}</div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex justify-around py-2 px-1">
        {NAV.map(n => (
          <button key={n.key} onClick={() => setSection(n.key)} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition ${section === n.key ? 'text-primary' : 'text-muted-foreground'}`}>
            {n.icon}
            <span className="text-[9px] tracking-wider">{n.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      {/* Address Modal */}
      {addressModal && renderModal(addressModal === 'new' ? 'Add Address' : 'Edit Address', () => setAddressModal(null), (
        <div className="space-y-3">
          <div className="flex gap-2">
            {['Home', 'Office', 'Other'].map(l => (
              <button key={l} onClick={() => setFormAddr(f => ({ ...f, label: l }))} className={`text-xs px-3 py-1.5 rounded-full border transition ${formAddr.label === l ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}>{l}</button>
            ))}
          </div>
          <input className={inputCls} placeholder="Full Name" value={formAddr.name} onChange={e => setFormAddr(f => ({ ...f, name: e.target.value }))} />
          <input className={inputCls} placeholder="Address Line 1" value={formAddr.line1} onChange={e => setFormAddr(f => ({ ...f, line1: e.target.value }))} />
          <input className={inputCls} placeholder="Address Line 2 (Optional)" value={formAddr.line2} onChange={e => setFormAddr(f => ({ ...f, line2: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <input className={inputCls} placeholder="City" value={formAddr.city} onChange={e => setFormAddr(f => ({ ...f, city: e.target.value }))} />
            <input className={inputCls} placeholder="State" value={formAddr.state} onChange={e => setFormAddr(f => ({ ...f, state: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className={inputCls} placeholder="ZIP Code" value={formAddr.zip} onChange={e => setFormAddr(f => ({ ...f, zip: e.target.value }))} />
            <input className={inputCls} placeholder="Phone" value={formAddr.phone} onChange={e => setFormAddr(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <button onClick={saveAddress} className="w-full bg-primary text-black py-3 rounded-lg text-sm tracking-widest font-medium hover:bg-primary/90 transition mt-2">SAVE ADDRESS</button>
        </div>
      ))}

      {/* Card Modal */}
      {cardModal && renderModal('Add Payment Method', () => setCardModal(false), (
        <div className="space-y-3">
          <input className={inputCls} placeholder="Card Number" maxLength={16} value={formCard.number} onChange={e => setFormCard(f => ({ ...f, number: e.target.value.replace(/\D/g, '') }))} />
          <div className="grid grid-cols-2 gap-3">
            <input className={inputCls} placeholder="MM/YY" maxLength={5} value={formCard.expiry} onChange={e => { let v = e.target.value.replace(/\D/g, ''); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); setFormCard(f => ({ ...f, expiry: v })); }} />
            <input className={inputCls} placeholder="CVC" maxLength={4} value={formCard.cvc} onChange={e => setFormCard(f => ({ ...f, cvc: e.target.value.replace(/\D/g, '') }))} />
          </div>
          <input className={inputCls} placeholder="Cardholder Name" value={formCard.name} onChange={e => setFormCard(f => ({ ...f, name: e.target.value }))} />
          <button onClick={saveCard} className="w-full bg-primary text-black py-3 rounded-lg text-sm tracking-widest font-medium hover:bg-primary/90 transition mt-2">ADD CARD</button>
        </div>
      ))}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Slide-up animation */}
      <style jsx global>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}

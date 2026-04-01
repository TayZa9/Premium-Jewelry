"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push('/products'); // Redirect to collections if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-88px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-serif tracking-widest text-foreground uppercase mb-2">My Account</h1>
            <p className="text-gray-500 font-light tracking-wide">Welcome back. View your collection and orders.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-6 md:mt-0 flex items-center space-x-2 text-sm tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            <LogOut size={16} />
            <span>SIGN OUT</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-6 py-4 text-sm tracking-widest uppercase transition-colors flex items-center space-x-3 ${activeTab === 'orders' ? 'bg-white shadow-sm font-medium' : 'text-gray-500 hover:text-foreground hover:bg-white/50'}`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span>Order History</span>
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-6 py-4 text-sm tracking-widest uppercase transition-colors flex items-center space-x-3 ${activeTab === 'wishlist' ? 'bg-white shadow-sm font-medium' : 'text-gray-500 hover:text-foreground hover:bg-white/50'}`}
            >
              <Heart size={18} strokeWidth={1.5} />
              <span>Wishlist</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white shadow-sm border border-gray-100 p-8 min-h-[400px]">
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-medium tracking-wide mb-8">Recent Orders</h2>
                <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200">
                  <ShoppingBag size={32} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
                  <p className="text-gray-500 tracking-wide font-light">You haven't placed any orders yet.</p>
                  <button onClick={() => router.push('/products')} className="mt-6 border border-foreground px-8 py-3 text-sm tracking-widest hover:bg-foreground hover:text-white transition-colors">
                    START SHOPPING
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-lg font-medium tracking-wide mb-8">My Wishlist</h2>
                <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200">
                  <Heart size={32} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
                  <p className="text-gray-500 tracking-wide font-light">Your wishlist is currently empty.</p>
                  <button onClick={() => router.push('/products')} className="mt-6 border border-foreground px-8 py-3 text-sm tracking-widest hover:bg-foreground hover:text-white transition-colors">
                    EXPLORE COLLECTION
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

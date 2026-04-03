"use client";

import { Fragment } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSlideOver() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Slide-over panel */}
      <div className="fixed top-0 right-0 h-[100dvh] z-50 w-full max-w-md bg-background shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-serif tracking-widest text-foreground">YOUR BAG ({items.length})</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-foreground transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar flex flex-col gap-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag size={48} strokeWidth={1} className="text-gray-300" />
              <p className="text-gray-400 font-light tracking-wide">Your shopping bag is empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 border border-foreground px-8 py-3 text-sm tracking-widest hover:bg-foreground hover:text-white transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.sku} className="flex gap-4">
                <div className="relative w-24 h-32 bg-surface flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover object-center" />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium tracking-wide text-foreground line-clamp-2 pr-2">{item.name}</h3>
                      <button onClick={() => removeItem(item.sku)} className="text-xs text-gray-400 hover:text-red-500 underline underline-offset-2 flex-shrink-0">Remove</button>
                    </div>
                    <p className="text-primary font-serif italic text-sm mt-1">
                      {typeof item.price === 'string' ? item.price : `$${item.price.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="flex items-center border border-border w-fit">
                    <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} className="px-3 py-1 hover:bg-muted"><Minus size={14} /></button>
                    <span className="px-3 py-1 text-sm text-foreground">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} className="px-3 py-1 hover:bg-muted"><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-surface">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm tracking-widest text-gray-400 uppercase">Subtotal</span>
              <span className="text-lg font-serif italic text-foreground">${cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6 text-center tracking-wide">Taxes and shipping calculated at checkout</p>
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-foreground text-background py-4 text-center text-sm tracking-widest hover:opacity-90 transition-all font-medium"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </Fragment>
  );
}

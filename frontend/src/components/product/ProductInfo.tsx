"use client";

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: string;
    description: string;
    material: string;
    gemstone?: string;
    sku: string;
    images: string[];
  }
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="flex flex-col py-6 md:py-0 md:pl-10 h-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-serif tracking-widest text-foreground font-light mb-2">{product.name}</h1>
        <p className="text-2xl font-serif italic text-primary mb-8">{product.price}</p>
        
        <div className="prose prose-sm text-gray-400 font-light tracking-wide mb-10 leading-relaxed">
          <p>{product.description}</p>
        </div>

        <div className="space-y-4 border-y border-white/10 py-6 mb-10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 tracking-wider">Material</span>
            <span className="text-foreground font-medium tracking-wide">{product.material}</span>
          </div>
          {product.gemstone && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 tracking-wider">Gemstone</span>
              <span className="text-foreground font-medium tracking-wide">{product.gemstone}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 tracking-wider">SKU</span>
            <span className="text-foreground font-medium tracking-wide">{product.sku}</span>
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-foreground text-white py-4 flex items-center justify-center space-x-2 text-sm tracking-widest hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          <span>{isAdding ? 'ADDING TO CART...' : 'ADD TO CART'}</span>
        </button>

        <div className="mt-8 text-xs text-gray-400 text-center tracking-wider space-y-2">
          <p>Complimentary shipping & returns on all orders.</p>
          <p>Secure payments processed via Stripe.</p>
        </div>
      </motion.div>
    </div>
  );
}

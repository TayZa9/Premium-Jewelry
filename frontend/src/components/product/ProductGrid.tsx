"use client";

import { useState } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Emerald Cut Diamond Ring', price: '$12,500', image: '/images/ring.png', slug: 'emerald-cut-diamond-ring', category: 'Rings' },
  { id: '2', name: 'Minimalist Gold Pendant', price: '$2,100', image: '/images/necklace.png', slug: 'minimalist-gold-pendant', category: 'Necklaces' },
  { id: '3', name: 'Classic Solitaire Ring', price: '$8,200', image: '/images/ring.png', slug: 'classic-solitaire-ring', category: 'Rings' },
  { id: '4', name: 'Vintage Pearl Necklace', price: '$3,400', image: '/images/necklace.png', slug: 'vintage-pearl-necklace', category: 'Necklaces' },
  { id: '5', name: 'Sapphire Halo Ring', price: '$6,800', image: '/images/ring.png', slug: 'sapphire-halo-ring', category: 'Rings' },
  { id: '6', name: 'Diamond Tennis Necklace', price: '$24,000', image: '/images/necklace.png', slug: 'diamond-tennis-necklace', category: 'Necklaces' },
];

export default function ProductGrid() {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings'];
  
  const filteredProducts = filter === 'All' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-sm tracking-widest uppercase transition-colors duration-300 pb-1 border-b-2 ${
              filter === cat ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
      >
        {filteredProducts.map((product) => (
          <motion.div 
            key={product.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-serif italic text-lg">
          No pieces available in this collection yet.
        </div>
      )}
    </div>
  );
}

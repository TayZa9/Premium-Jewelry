"use client";

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterState } from './ProductFilters';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  images: string[];
  material?: string;
  gemstone?: string;
  category?: { name: string; slug: string };
  isFeatured?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Emerald Cut Diamond Ring', price: 12500, images: ['/images/ring.png'], slug: 'emerald-cut-diamond-ring', category: { name: 'Rings', slug: 'rings' }, material: 'White Gold', gemstone: 'Diamond' },
  { id: '2', name: 'Minimalist Gold Pendant', price: 2100, images: ['/images/necklace.png'], slug: 'minimalist-gold-pendant', category: { name: 'Necklaces', slug: 'necklaces' }, material: 'Yellow Gold' },
  { id: '3', name: 'Classic Solitaire Ring', price: 8200, images: ['/images/ring.png'], slug: 'classic-solitaire-ring', category: { name: 'Rings', slug: 'rings' }, material: 'Platinum', gemstone: 'Diamond' },
  { id: '4', name: 'Vintage Pearl Necklace', price: 3400, images: ['/images/necklace.png'], slug: 'vintage-pearl-necklace', category: { name: 'Necklaces', slug: 'necklaces' }, material: 'Yellow Gold', gemstone: 'Pearl' },
  { id: '5', name: 'Sapphire Halo Ring', price: 6800, images: ['/images/ring.png'], slug: 'sapphire-halo-ring', category: { name: 'Rings', slug: 'rings' }, material: 'White Gold', gemstone: 'Sapphire' },
  { id: '6', name: 'Diamond Tennis Necklace', price: 24000, images: ['/images/necklace.png'], slug: 'diamond-tennis-necklace', category: { name: 'Necklaces', slug: 'necklaces' }, material: 'White Gold', gemstone: 'Diamond' },
];

export default function ProductGrid({ filters }: { filters?: FilterState }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters?.materials.length) params.set('material', filters.materials.join(','));
        if (filters?.gemstones.length) params.set('gemstone', filters.gemstones.join(','));
        if (filters?.sort) params.set('sort', filters.sort);
        if (filters?.priceRange) {
          const [min, max] = filters.priceRange.split('-');
          if (min) params.set('minPrice', min);
          if (max) params.set('maxPrice', max);
        }

        const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fallback to mock data
      }

      // Apply local filtering to mock data
      let filtered = [...MOCK_PRODUCTS];
      if (filters?.materials.length) {
        filtered = filtered.filter(p => p.material && filters.materials.some(m => p.material?.toLowerCase().includes(m.toLowerCase())));
      }
      if (filters?.gemstones.length) {
        filtered = filtered.filter(p => p.gemstone && filters.gemstones.some(g => p.gemstone?.toLowerCase().includes(g.toLowerCase())));
      }
      if (filters?.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filtered = filtered.filter(p => {
          const price = typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[$,]/g, ''));
          return price >= min && price <= max;
        });
      }
      if (filters?.sort === 'price-asc') filtered.sort((a, b) => Number(a.price) - Number(b.price));
      else if (filters?.sort === 'price-desc') filtered.sort((a, b) => Number(b.price) - Number(a.price));

      setProducts(filtered);
      setIsLoading(false);
    };

    fetchProducts();
  }, [filters]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] bg-surface rounded mb-4" />
            <div className="h-3 bg-surface rounded w-1/3 mb-2" />
            <div className="h-4 bg-surface rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Result count */}
      <div className="mb-6">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'}
        </p>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: typeof product.price === 'number' ? `$${product.price.toLocaleString()}` : product.price,
                  image: product.images?.[0] || '/images/ring.png',
                  images: product.images,
                  category: product.category?.name,
                  material: product.material,
                  gemstone: product.gemstone,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {products.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-serif italic text-lg">
          No pieces match your selected filters.
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { filterFallbackProducts } from '@/lib/catalog';
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

const API_URL = '/api';

export default function ProductGrid({ filters, categorySlug }: { filters?: FilterState; categorySlug?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters?.materials.length) params.set('material', filters.materials.join(','));
        if (filters?.gemstones.length) params.set('gemstone', filters.gemstones.join(','));
        if (categorySlug) params.set('categorySlug', categorySlug);
        if (filters?.sort) params.set('sort', filters.sort);
        if (filters?.priceRange) {
          const [min, max] = filters.priceRange.split('-');
          if (min) params.set('minPrice', min);
          if (max) params.set('maxPrice', max);
        }

        const res = await fetch(`${API_URL}/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fallback to mock data
      }

      const [min, max] = filters?.priceRange ? filters.priceRange.split('-') : ['', ''];
      const filtered = filterFallbackProducts({
        material: filters?.materials.length ? filters.materials.join(',') : null,
        gemstone: filters?.gemstones.length ? filters.gemstones.join(',') : null,
        categorySlug: categorySlug ?? null,
        sort: filters?.sort ?? null,
        minPrice: min || null,
        maxPrice: max || null,
      });

      setProducts(filtered);
      setIsLoading(false);
    };

    fetchProducts();
  }, [filters, categorySlug]);

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

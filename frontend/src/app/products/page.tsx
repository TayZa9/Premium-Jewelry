"use client";

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    materials: [],
    gemstones: [],
    priceRange: '',
    sort: 'featured',
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeFilterCount = filters.materials.length + filters.gemstones.length + (filters.priceRange ? 1 : 0);

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif tracking-wide text-foreground mb-4">THE COLLECTION</h1>
          <p className="text-gray-400 max-w-2xl mx-auto tracking-wide font-light">
            Discover a wide selection of stunning pieces, perfectly crafted to illuminate your daily luxury.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden flex justify-end mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 text-sm tracking-widest border border-border px-4 py-2.5 hover:border-primary/50 transition-colors"
          >
            <SlidersHorizontal size={16} />
            FILTER
            {activeFilterCount > 0 && (
              <span className="bg-primary text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Layout: Filters + Grid */}
        <div className="flex gap-8">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <ProductGrid filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}

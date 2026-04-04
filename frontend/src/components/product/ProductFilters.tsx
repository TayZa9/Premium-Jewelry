"use client";

import { useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterState {
  materials: string[];
  gemstones: string[];
  priceRange: string;
  sort: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const MATERIALS = ['Gold', 'Platinum', 'Rose Gold', 'White Gold', 'Silver', 'Yellow Gold'];
const GEMSTONES = ['Diamond', 'Emerald', 'Sapphire', 'Ruby', 'Pearl', 'Amethyst'];
const PRICE_RANGES = [
  { label: 'All Prices', value: '' },
  { label: 'Under $5,000', value: '0-5000' },
  { label: '$5,000 – $10,000', value: '5000-10000' },
  { label: '$10,000 – $25,000', value: '10000-25000' },
  { label: 'Over $25,000', value: '25000-999999' },
];
const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-5 mb-5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm tracking-widest uppercase text-foreground mb-4"
      >
        {title}
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckboxOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
      <div className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center ${
        checked ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'
      }`}>
        {checked && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            width="10" height="8" viewBox="0 0 10 8" fill="none"
          >
            <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
      </div>
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors tracking-wide">
        {label}
      </span>
    </label>
  );
}

function FilterContent({ filters, onFilterChange }: { filters: FilterState; onFilterChange: (f: FilterState) => void }) {
  const toggleMaterial = (mat: string) => {
    const updated = filters.materials.includes(mat)
      ? filters.materials.filter(m => m !== mat)
      : [...filters.materials, mat];
    onFilterChange({ ...filters, materials: updated });
  };

  const toggleGemstone = (gem: string) => {
    const updated = filters.gemstones.includes(gem)
      ? filters.gemstones.filter(g => g !== gem)
      : [...filters.gemstones, gem];
    onFilterChange({ ...filters, gemstones: updated });
  };

  const activeCount = filters.materials.length + filters.gemstones.length + (filters.priceRange ? 1 : 0);

  return (
    <div>
      {/* Clear All */}
      {activeCount > 0 && (
        <button
          onClick={() => onFilterChange({ materials: [], gemstones: [], priceRange: '', sort: filters.sort })}
          className="flex items-center gap-1.5 text-xs text-primary tracking-widest mb-6 hover:underline"
        >
          <X size={12} />
          CLEAR ALL ({activeCount})
        </button>
      )}

      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="space-y-1">
          {SORT_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-3 py-1.5 cursor-pointer group">
              <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                filters.sort === opt.value ? 'border-primary' : 'border-border group-hover:border-primary/50'
              }`}>
                {filters.sort === opt.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors tracking-wide">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Materials */}
      <FilterSection title="Material">
        <div className="space-y-0.5">
          {MATERIALS.map(mat => (
            <CheckboxOption
              key={mat}
              label={mat}
              checked={filters.materials.includes(mat)}
              onChange={() => toggleMaterial(mat)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Gemstones */}
      <FilterSection title="Gemstone">
        <div className="space-y-0.5">
          {GEMSTONES.map(gem => (
            <CheckboxOption
              key={gem}
              label={gem}
              checked={filters.gemstones.includes(gem)}
              onChange={() => toggleGemstone(gem)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map(range => (
            <label key={range.value} className="flex items-center gap-3 py-1.5 cursor-pointer group">
              <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                filters.priceRange === range.value ? 'border-primary' : 'border-border group-hover:border-primary/50'
              }`}>
                {filters.priceRange === range.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors tracking-wide">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

export default function ProductFilters({ filters, onFilterChange, isMobileOpen, onMobileClose }: ProductFiltersProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8 border-r border-border">
        <h3 className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6 flex items-center gap-2">
          <SlidersHorizontal size={14} />
          REFINE
        </h3>
        <FilterContent filters={filters} onFilterChange={onFilterChange} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[85] w-80 max-w-[85vw] bg-background border-r border-border p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm tracking-[0.3em] text-foreground uppercase flex items-center gap-2">
                  <SlidersHorizontal size={14} />
                  REFINE
                </h3>
                <button onClick={onMobileClose} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              <FilterContent filters={filters} onFilterChange={onFilterChange} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export type { FilterState };

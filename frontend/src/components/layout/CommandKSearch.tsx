"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  images: string[];
  material?: string;
  category?: { name: string };
}

const API_URL = '/api';
const RECENT_KEY = 'aura-recent-searches';

export default function CommandKSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) {
      try { setRecentSearches(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Global ⌘K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Parent will handle opening
          const event = new CustomEvent('open-command-k');
          window.dispatchEvent(event);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        // Fallback: no results if API is down
        setResults([]);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const navigateToResult = useCallback((result: SearchResult) => {
    // Save to recent searches
    const updated = [result.name, ...recentSearches.filter(s => s !== result.name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));

    onClose();
    router.push(`/products/${result.slug}`);
  }, [recentSearches, onClose, router]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigateToResult(results[selectedIndex]);
    }
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
          onClick={onClose}
        >
          {/* Glassmorphism Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

          {/* Search Panel */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl mx-4 bg-background/90 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Input Row */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-border/50">
              <Search size={20} className="text-primary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search exquisite pieces..."
                className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground/60 placeholder:font-serif placeholder:italic focus:outline-none tracking-wide"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground transition">
                  <X size={18} />
                </button>
              )}
              <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground bg-surface border border-border rounded-md px-2 py-1 tracking-wider">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {/* Loading */}
              {isSearching && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Results List */}
              {!isSearching && results.length > 0 && (
                <div className="py-2">
                  <p className="px-6 py-2 text-[10px] tracking-widest text-muted-foreground uppercase">
                    {results.length} {results.length === 1 ? 'result' : 'results'}
                  </p>
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => navigateToResult(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-colors ${
                        index === selectedIndex ? 'bg-primary/10' : 'hover:bg-surface'
                      }`}
                    >
                      <div className="w-12 h-14 relative rounded bg-surface border border-border overflow-hidden shrink-0">
                        <Image
                          src={result.images?.[0] || '/images/ring.png'}
                          alt={result.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{result.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.category?.name}{result.material ? ` · ${result.material}` : ''}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-serif italic text-primary">
                          {typeof result.price === 'number' ? `$${Number(result.price).toLocaleString()}` : result.price}
                        </p>
                      </div>
                      {index === selectedIndex && (
                        <ArrowRight size={14} className="text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isSearching && query && results.length === 0 && (
                <div className="text-center py-16">
                  <Sparkles size={32} className="mx-auto text-muted-foreground mb-3" strokeWidth={1} />
                  <p className="text-sm text-muted-foreground font-serif italic">
                    No pieces found for "{query}"
                  </p>
                </div>
              )}

              {/* Recent Searches (when no query) */}
              {!query && recentSearches.length > 0 && (
                <div className="py-2">
                  <p className="px-6 py-2 text-[10px] tracking-widest text-muted-foreground uppercase">
                    Recent Searches
                  </p>
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleRecentClick(term)}
                      className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-surface transition-colors"
                    >
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{term}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty state (no query, no recent) */}
              {!query && recentSearches.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-sm text-muted-foreground font-serif italic">
                    Begin typing to discover exquisite pieces...
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-border/50 text-[10px] text-muted-foreground tracking-wider">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><kbd className="bg-surface border border-border rounded px-1.5 py-0.5">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-surface border border-border rounded px-1.5 py-0.5">↵</kbd> Select</span>
              </div>
              <span className="flex items-center gap-1"><kbd className="bg-surface border border-border rounded px-1.5 py-0.5">ESC</kbd> Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

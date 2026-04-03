"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsCartOpen, totalItems } = useCart();
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAccountClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      openAuthModal();
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 border-b border-border backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif font-bold tracking-widest text-foreground">
            AURA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-sm tracking-widest hover:text-primary transition-colors">COLLECTIONS</Link>
            <Link href="/categories/rings" className="text-sm tracking-widest hover:text-primary transition-colors">RINGS</Link>
            <Link href="/categories/necklaces" className="text-sm tracking-widest hover:text-primary transition-colors">NECKLACES</Link>
            <Link href="/about" className="text-sm tracking-widest hover:text-primary transition-colors">OUR STORY</Link>
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            <button aria-label="Search" className="hover:text-primary transition-colors"><Search size={20} strokeWidth={1.5} /></button>
            <button aria-label="Account" onClick={handleAccountClick} className="relative hover:text-primary transition-colors group">
              <User size={20} strokeWidth={1.5} />
              {user && (
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
              )}
            </button>
            <button aria-label="Cart" onClick={() => setIsCartOpen(true)} className="relative hover:text-primary transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button aria-label="Account" onClick={handleAccountClick} className="relative hover:text-primary transition-colors">
              <User size={20} strokeWidth={1.5} />
              {user && (
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
              )}
            </button>
            <button aria-label="Cart" onClick={() => setIsCartOpen(true)} className="relative hover:text-primary transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
              {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-6 flex flex-col space-y-4"
        >
          <Link href="/products" className="text-sm tracking-widest hover:text-primary transition-colors">COLLECTIONS</Link>
          <Link href="/categories/rings" className="text-sm tracking-widest hover:text-primary transition-colors">RINGS</Link>
          <Link href="/categories/necklaces" className="text-sm tracking-widest hover:text-primary transition-colors">NECKLACES</Link>
          <div className="flex space-x-6 pt-4 border-t border-border">
            <button aria-label="Search"><Search size={20} strokeWidth={1.5} /></button>
          </div>
        </motion.div>
      )}
    </header>
  );
}

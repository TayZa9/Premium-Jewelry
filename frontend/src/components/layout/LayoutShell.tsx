"use client";

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSlideOver from '@/components/cart/CartSlideOver';
import AuthModal from '@/components/auth/AuthModal';
import CommandKSearch from './CommandKSearch';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Header onSearchOpen={() => setIsSearchOpen(true)} />
      <CartSlideOver />
      <AuthModal />
      <CommandKSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <main className="flex-grow pt-[88px]">
        {children}
      </main>
      <Footer />
    </>
  );
}

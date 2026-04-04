"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ShareWishlistModal from '@/components/wishlist/ShareWishlistModal';

export default function WishlistPage() {
  const { items, removeFromWishlist, isLoading } = useWishlist();
  const { addItem } = useCart();
  const [shareOpen, setShareOpen] = useState(false);

  const handleAddToCart = (product: typeof items[0]) => {
    addItem({
      id: product.id,
      sku: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/images/ring.png',
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-88px)] pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-4">
          <div>
            <h1 className="text-4xl font-serif tracking-wide text-foreground mb-2">MY WISHLIST</h1>
            <p className="text-muted-foreground tracking-wide font-light text-sm">
              {items.length} curated {items.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-2 border border-primary text-primary px-6 py-3 text-sm tracking-widest hover:bg-primary hover:text-black transition-all duration-300"
            >
              <Share2 size={16} />
              SHARE WITH A LOVED ONE
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-surface border border-border flex items-center justify-center">
              <Heart size={40} strokeWidth={1} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-serif tracking-wide text-foreground mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-10 tracking-wide font-light">
              Begin curating your collection by exploring our exquisite pieces and tapping the heart icon.
            </p>
            <Link
              href="/products"
              className="inline-block border border-gold/50 text-foreground px-10 py-4 text-sm tracking-[0.3em] font-medium hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-300"
            >
              EXPLORE THE COLLECTION
            </Link>
          </motion.div>
        )}

        {/* Wishlist Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="group"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-[4/5] bg-surface mb-4 overflow-hidden border border-border group-hover:border-primary/20 transition-colors">
                    <Image
                      src={product.images[0] || '/images/ring.png'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="flex flex-col space-y-1 mb-3">
                  {product.category && (
                    <span className="text-xs tracking-widest text-gray-400 uppercase">{product.category.name}</span>
                  )}
                  <h3 className="text-sm font-medium tracking-wide text-foreground line-clamp-1">{product.name}</h3>
                  <p className="text-primary font-serif italic text-sm">
                    {typeof product.price === 'number' ? `$${Number(product.price).toLocaleString()}` : product.price}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-foreground text-white py-2.5 text-xs tracking-widest hover:bg-black transition-colors"
                  >
                    <ShoppingBag size={14} />
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-10 flex items-center justify-center border border-border text-muted-foreground hover:border-red-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <ShareWishlistModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}

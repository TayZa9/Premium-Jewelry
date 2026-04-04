"use client";

import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist, WishlistProduct } from '@/context/WishlistContext';

interface WishlistButtonProps {
  product: WishlistProduct;
  size?: number;
  className?: string;
}

export default function WishlistButton({ product, size = 20, className = '' }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isFavorited = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`relative group/heart transition-colors duration-300 ${className}`}
      whileTap={{ scale: 0.85 }}
    >
      <AnimatePresence mode="wait">
        {isFavorited ? (
          <motion.div
            key="filled"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            <Heart
              size={size}
              strokeWidth={1.5}
              className="text-red-500 fill-red-500 drop-shadow-sm"
            />
          </motion.div>
        ) : (
          <motion.div
            key="outline"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            <Heart
              size={size}
              strokeWidth={1.5}
              className="text-foreground/60 group-hover/heart:text-red-400 transition-colors duration-300"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burst effect on favorite */}
      <AnimatePresence>
        {isFavorited && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full h-full rounded-full border border-red-400/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

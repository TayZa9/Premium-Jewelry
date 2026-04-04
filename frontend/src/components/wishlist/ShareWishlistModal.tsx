"use client";

import { useState } from 'react';
import { X, Link2, Mail, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';

interface ShareWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareWishlistModal({ isOpen, onClose }: ShareWishlistModalProps) {
  const { items } = useWishlist();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/wishlist` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('My AURA Wishlist ✨');
    const body = encodeURIComponent(
      `I've curated a collection of exquisite pieces from AURA that I'd love to share with you.\n\n` +
      items.map(p => `• ${p.name}`).join('\n') +
      `\n\nView my wishlist: ${shareUrl}`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    setEmail('');
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://wa.me/?text=${encodeURIComponent(`Check out my AURA wishlist: ${shareUrl}`)}`,
    },
    {
      name: 'Twitter',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`My curated jewelry wishlist from AURA ✨`)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Pinterest',
      icon: '📌',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent('My AURA Jewelry Wishlist')}`,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-8 w-full max-w-md shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <h3 className="text-2xl font-serif tracking-wide text-foreground mb-2">
              Share with a Loved One
            </h3>
            <p className="text-sm text-muted-foreground mb-8 tracking-wide">
              Share your curated collection of {items.length} exquisite {items.length === 1 ? 'piece' : 'pieces'}.
            </p>

            {/* Copy Link */}
            <div className="mb-6">
              <label className="text-xs text-muted-foreground tracking-widest uppercase mb-2 block">
                Copy Link
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground truncate">
                  {shareUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-3 rounded-lg border text-sm tracking-wider transition-all duration-300 flex items-center gap-2 ${
                    copied
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'border-primary text-primary hover:bg-primary hover:text-black'
                  }`}
                >
                  {copied ? <Check size={16} /> : <Link2 size={16} />}
                  {copied ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="mb-8">
              <label className="text-xs text-muted-foreground tracking-widest uppercase mb-2 block">
                Send via Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recipient@email.com"
                  className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                />
                <button
                  onClick={handleEmailShare}
                  disabled={!email}
                  className="px-4 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-black text-sm tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Mail size={16} />
                  SEND
                </button>
              </div>
            </div>

            {/* Social */}
            <div>
              <label className="text-xs text-muted-foreground tracking-widest uppercase mb-3 block">
                Share on Social
              </label>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border rounded-lg py-3 text-sm hover:border-primary/50 hover:text-primary transition-all duration-300"
                  >
                    <span className="text-base">{social.icon}</span>
                    <span className="text-xs tracking-wider hidden sm:inline">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

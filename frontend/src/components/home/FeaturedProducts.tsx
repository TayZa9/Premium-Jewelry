"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FALLBACK_PRODUCTS, formatPrice } from '@/lib/catalog';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import WishlistButton from '@/components/wishlist/WishlistButton';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function FeaturedProducts() {
  const containerRef = useRef(null);
  const featuredProducts = FALLBACK_PRODUCTS.filter((product) => product.isFeatured).slice(0, 2);
  
  return (
    <section ref={containerRef} className="py-32 bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-serif tracking-widest text-gold uppercase"
          >
            Signature Pieces
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-16 h-[1px] bg-gold mx-auto mt-8 origin-center"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm text-muted-foreground tracking-widest uppercase mt-6 max-w-md mx-auto"
          >
            Handcrafted masterpieces for the discerning collector
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16"
        >
          {featuredProducts.map((product, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div 
                key={product.id}
                variants={staggerItem}
                className={`group md:col-span-6 ${!isEven ? 'md:mt-32' : ''}`}
              >
                <Link href={`/products/${product.slug}`} className="block relative">
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface mb-8 border border-border group-hover:border-primary/50 transition-colors duration-500">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center transition-all duration-1000 ease-out group-hover:brightness-110"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gold mix-blend-overlay opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>

                    {/* Wishlist button */}
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-background/80 backdrop-blur-sm rounded-full p-2 border border-border/50 shadow-lg">
                        <WishlistButton
                          product={{
                            id: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: formatPrice(product.price),
                            images: product.images,
                            material: product.material,
                            gemstone: product.gemstone,
                          }}
                          size={18}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-serif tracking-wide text-foreground mb-3 group-hover:text-gold transition-colors duration-300">{product.name}</h3>
                    <p className="text-gray-400 font-sans tracking-widest text-sm">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-32"
        >
          <Link 
            href="/products" 
            className="inline-block border border-gold/50 text-foreground px-12 py-5 text-sm tracking-[0.3em] font-medium hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-300"
          >
            VIEW ALL PRODUCTS
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

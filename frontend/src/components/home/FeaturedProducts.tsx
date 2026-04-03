"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const MOCK_FEATURED = [
  {
    id: '1',
    name: 'The Emerald Cut Diamond Ring',
    price: '$12,500',
    image: '/images/ring.png',
    slug: 'emerald-cut-diamond-ring'
  },
  {
    id: '2',
    name: 'Minimalist Gold Pendant',
    price: '$2,100',
    image: '/images/necklace.png',
    slug: 'minimalist-gold-pendant'
  }
];

export default function FeaturedProducts() {
  const containerRef = useRef(null);
  
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          {MOCK_FEATURED.map((product, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`group md:col-span-6 ${!isEven ? 'md:mt-32' : ''}`}
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface mb-8 border border-border group-hover:border-primary/50 transition-colors duration-500">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center transition-all duration-1000 ease-out group-hover:scale-105 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gold mix-blend-overlay opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-serif tracking-wide text-foreground mb-3 group-hover:text-gold transition-colors duration-300">{product.name}</h3>
                    <p className="text-gray-400 font-sans tracking-widest text-sm">{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        
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

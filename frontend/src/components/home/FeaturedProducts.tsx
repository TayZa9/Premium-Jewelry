"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif tracking-widest text-foreground uppercase">Signature Pieces</h2>
          <div className="w-16 h-[1px] bg-primary mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {MOCK_FEATURED.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium tracking-wide text-foreground mb-2">{product.name}</h3>
                  <p className="text-primary font-serif italic text-lg">{product.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link 
            href="/products" 
            className="inline-block border border-foreground text-foreground px-10 py-4 text-sm tracking-widest font-medium hover:bg-foreground hover:text-white transition-colors duration-300"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
}

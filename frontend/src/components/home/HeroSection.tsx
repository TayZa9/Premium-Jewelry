"use client";

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const title = "ETERNAL BRILLIANCE";
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section ref={ref} className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Luxury diamond necklace on model"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.7]"
        />
        {/* Gradients blending into the background color */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/30" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl pt-20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gold mb-6 tracking-wide drop-shadow-lg flex flex-wrap justify-center">
          {title.split('').map((char, index) => (
            <motion.span
              key={index}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, delay: index * 0.05 + 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
              variants={letterVariants}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-lg md:text-xl text-gray-300 mb-12 tracking-widest uppercase font-light drop-shadow-sm max-w-2xl mx-auto"
        >
          Discover The New Signature Diamond Collection
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <Link 
            href="/products" 
            className="inline-block border border-gold text-gold px-12 py-5 text-sm tracking-[0.3em] font-medium hover:bg-gold hover:text-black transition-all duration-500 relative overflow-hidden group"
          >
            <span className="relative z-10 transition-colors duration-500">DISCOVER THE COLLECTION</span>
            <div className="absolute inset-0 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0"></div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

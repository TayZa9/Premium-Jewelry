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
  
  // Multi-layer parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  
  // Decorative elements parallax
  const decorY1 = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const decorY2 = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const decorRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  const title = "ETERNAL BRILLIANCE";
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section ref={ref} className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Multi-layer Parallax */}
      <motion.div style={{ y: bgY, scale: bgScale, opacity: bgOpacity }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Luxury diamond necklace on model"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.7]"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/30" />
      </motion.div>

      {/* Decorative floating elements */}
      <motion.div
        style={{ y: decorY1, rotate: decorRotate }}
        className="absolute top-20 right-[15%] w-px h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent z-[5] hidden lg:block"
      />
      <motion.div
        style={{ y: decorY2 }}
        className="absolute top-32 left-[10%] w-24 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent z-[5] hidden lg:block"
      />
      <motion.div
        style={{ y: decorY1, opacity: bgOpacity }}
        className="absolute bottom-32 right-[20%] z-[5] hidden lg:block"
      >
        <div className="w-2 h-2 rounded-full bg-gold/30 animate-pulse" />
      </motion.div>
      <motion.div
        style={{ y: decorY2, opacity: bgOpacity }}
        className="absolute top-1/4 left-[8%] z-[5] hidden lg:block"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-gold/20 animate-pulse" style={{ animationDelay: '1s' }} />
      </motion.div>

      {/* Content with independent parallax */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 text-center px-4 max-w-4xl pt-20">
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
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}

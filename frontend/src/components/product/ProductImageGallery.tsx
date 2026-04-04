"use client";

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

interface GalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: GalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || '/images/ring.png');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLightbox, setIsLightbox] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  }, [isZoomed]);

  const switchImage = (img: string) => {
    if (img === mainImage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setMainImage(img);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 flex-shrink-0 hide-scrollbar">
          {images.map((img, idx) => (
            <motion.button
              key={idx}
              onClick={() => switchImage(img)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-20 h-24 flex-shrink-0 bg-surface border-2 transition-all duration-300 overflow-hidden ${
                mainImage === img
                  ? 'border-primary shadow-lg shadow-primary/10'
                  : 'border-border hover:border-border/80'
              }`}
            >
              <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" sizes="80px" />
              {mainImage === img && (
                <motion.div
                  layoutId="thumb-indicator"
                  className="absolute inset-0 border-2 border-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Main Image with HD Zoom */}
        <div className="relative w-full group">
          <div
            ref={containerRef}
            className="relative aspect-[4/5] w-full bg-surface cursor-crosshair overflow-hidden border border-border"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Normal Image */}
            <motion.div
              animate={{ opacity: isTransitioning ? 0 : 1 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              <Image
                src={mainImage}
                alt="Product Main Image"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover object-center transition-opacity duration-200 ${
                  isZoomed ? 'opacity-0' : 'opacity-100'
                }`}
              />
            </motion.div>

            {/* HD Zoom Lens — Desktop only */}
            {isZoomed && (
              <div
                className="absolute inset-0 pointer-events-none hidden md:block"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: '300%',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}

            {/* Zoom crosshair */}
            {isZoomed && (
              <div
                className="absolute pointer-events-none hidden md:flex items-center justify-center"
                style={{
                  left: `${mousePos.x}%`,
                  top: `${mousePos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-32 h-32 rounded-full border border-gold/30" />
                <div className="absolute w-px h-8 bg-gold/20" />
                <div className="absolute w-8 h-px bg-gold/20" />
              </div>
            )}
          </div>

          {/* Fullscreen button */}
          <button
            onClick={() => setIsLightbox(true)}
            className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-black hover:border-primary"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={() => setIsLightbox(false)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white transition z-10"
              onClick={() => setIsLightbox(false)}
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-[90vw] h-[85vh] max-w-4xl"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={mainImage}
                alt="Product Full View"
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>

            {/* Lightbox thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setMainImage(img); }}
                  className={`relative w-14 h-16 border-2 overflow-hidden transition ${
                    mainImage === img ? 'border-primary' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

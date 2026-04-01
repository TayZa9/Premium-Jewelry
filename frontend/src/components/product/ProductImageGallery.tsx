"use client";

import { useState } from 'react';
import Image from 'next/image';

interface GalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: GalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || '/images/ring.png');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 flex-shrink-0 hide-scrollbar">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setMainImage(img)}
            className={`relative w-20 h-24 flex-shrink-0 bg-gray-50 border transition-all ${mainImage === img ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
          >
            <Image src={img} alt="Thumbnail" fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div 
        className="relative aspect-[4/5] w-full bg-gray-50 cursor-zoom-in overflow-hidden"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={mainImage}
          alt="Product Main Image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover object-center transition-transform duration-200 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
        />
        {/* Zoom Overlay - Disabled on Mobile touch devices */}
        {isZoomed && (
          <div 
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{
              backgroundImage: `url(${mainImage})`,
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundSize: '200%',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </div>
    </div>
  );
}

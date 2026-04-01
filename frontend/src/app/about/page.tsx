import React from 'react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-[calc(100vh-88px)] py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-serif tracking-widest text-foreground mb-8">OUR STORY</h1>
        <div className="prose prose-lg mx-auto text-gray-500 font-light leading-relaxed tracking-wide space-y-6">
          <p>
            Founded in 1920, AURA has been the destination for those who seek the extraordinary. 
            Our heritage is built on a century of craftsmanship, where every piece of jewelry 
            tells a story of passion, precision, and timeless elegance.
          </p>
          <p>
            From the selection of the finest ethically sourced gemstones to the final hand-polish, 
            our artisans combine traditional techniques with modern innovation to create 
            masterpieces that last for generations.
          </p>
        </div>
      </div>
    </div>
  );
}

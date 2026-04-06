"use client";

import React from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;
  const formattedCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

  return (
    <div className="bg-background min-h-[calc(100vh-88px)] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-light tracking-widest text-foreground uppercase mb-4">
            {formattedCategory || 'COLLECTION'}
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 font-light tracking-wide italic">
             Every piece in our {formattedCategory || 'curated'} collection is a testament to the AURA tradition of excellence.
          </p>
        </div>
        <ProductGrid categorySlug={category} />
      </div>
    </div>
  );
}

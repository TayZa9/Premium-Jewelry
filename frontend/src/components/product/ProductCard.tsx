"use client";

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: string | number;
    image: string;
    category?: string;
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col cursor-pointer">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/5] bg-gray-50 mb-4 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col space-y-1">
          {product.category && (
            <span className="text-xs tracking-widest text-gray-400 uppercase">{product.category}</span>
          )}
          <h3 className="text-sm font-medium tracking-wide text-foreground line-clamp-1">{product.name}</h3>
          <p className="text-primary font-serif italic text-sm">{product.price}</p>
        </div>
      </Link>
    </div>
  );
}

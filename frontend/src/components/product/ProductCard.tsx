"use client";

import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from '@/components/wishlist/WishlistButton';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: string | number;
    image?: string;
    images?: string[];
    category?: string;
    material?: string;
    gemstone?: string;
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayImage = product.image || (product.images && product.images[0]) || '/images/ring.png';

  return (
    <div className="group flex flex-col cursor-pointer relative">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/5] bg-surface mb-4 overflow-hidden border border-border group-hover:border-primary/20 transition-colors">
          <Image
            src={displayImage}
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
          <p className="text-primary font-serif italic text-sm">
            {typeof product.price === 'number' ? `$${Number(product.price).toLocaleString()}` : product.price}
          </p>
        </div>
      </Link>

      {/* Wishlist Heart */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-background/80 backdrop-blur-sm rounded-full p-2 border border-border/50 shadow-lg">
          <WishlistButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              images: product.images || [displayImage],
              material: product.material,
              gemstone: product.gemstone,
              category: product.category ? { name: product.category, slug: '' } : undefined,
            }}
            size={18}
          />
        </div>
      </div>
    </div>
  );
}

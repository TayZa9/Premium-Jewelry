import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Product Details | AURA'
};

// Mock fetch function (would hit your Express API in reality)
async function getProduct(slug: string) {
  // Simulating API response delay
  await new Promise(res => setTimeout(res, 200));

  const products: Record<string, any> = {
    'emerald-cut-diamond-ring': {
      id: '1',
      name: 'The Emerald Cut Diamond Ring',
      price: '$12,500',
      description: 'A masterpiece of precision and elegance. This emerald-cut diamond ring captures the essence of sophisticated luxury. Expertly crafted in 18k White Gold, its step-cut facets create a mesmerizing hall-of-mirrors effect.',
      material: '18k White Gold',
      gemstone: 'Diamond (VVS1, E Color)',
      sku: 'AURA-R-001',
      images: ['/images/ring.png', '/images/ring.png']
    },
    'minimalist-gold-pendant': {
      id: '2',
      name: 'Minimalist Gold Pendant',
      price: '$2,100',
      description: 'Understated luxury for the modern individual. A beautifully hammered gold pendant resting on a delicate chain. Designed for everyday elegance.',
      material: '18k Yellow Gold',
      sku: 'AURA-N-105',
      images: ['/images/necklace.png', '/images/necklace.png']
    },
    'classic-solitaire-ring': {
      id: '3',
      name: 'Classic Solitaire Ring',
      price: '$8,200',
      description: 'A timeless expression of love. This classic solitaire features a brilliant round-cut diamond set in a minimalist four-prong mount of polished platinum.',
      material: 'Platinum',
      gemstone: 'Diamond (VS1, F Color)',
      sku: 'AURA-R-002',
      images: ['/images/ring.png', '/images/ring.png']
    },
    'vintage-pearl-necklace': {
      id: '4',
      name: 'Vintage Pearl Necklace',
      price: '$3,400',
      description: 'The elegance of a bygone era. A double strand of luminous Akoya pearls, finished with a vintage-inspired 18k yellow gold clasp.',
      material: '18k Yellow Gold',
      gemstone: 'Akoya Pearls',
      sku: 'AURA-N-106',
      images: ['/images/necklace.png', '/images/necklace.png']
    },
    'sapphire-halo-ring': {
      id: '5',
      name: 'Sapphire Halo Ring',
      price: '$6,800',
      description: 'A regal blue sapphire surrounded by a brilliant halo of diamonds. This striking piece captures the depth of the ocean and the sparkle of the stars.',
      material: '18k White Gold',
      gemstone: 'Blue Sapphire & Diamonds',
      sku: 'AURA-R-003',
      images: ['/images/ring.png', '/images/ring.png']
    },
    'diamond-tennis-necklace': {
      id: '6',
      name: 'Diamond Tennis Necklace',
      price: '$24,000',
      description: 'An unbroken circle of light. This exquisite tennis necklace features a continuous line of hand-selected diamonds set in 18k white gold.',
      material: '18k White Gold',
      gemstone: 'Diamonds (Total 10.5ctw)',
      sku: 'AURA-N-107',
      images: ['/images/necklace.png', '/images/necklace.png']
    }
  };

  return products[slug] || null;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-background min-h-[calc(100vh-88px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="col-span-1">
             <ProductImageGallery images={product.images} />
          </div>
          <div className="col-span-1 border-l-0 md:border-l border-white/10">
             <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

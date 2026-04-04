import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Product Details | AURA'
};

import prisma from '@/lib/prisma';

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true }
    });

    if (!product) return null;
    
    return {
      ...product,
      description: product.description || '',
      material: product.material || 'Premium Gold',
      price: `$${Number(product.price).toLocaleString()}`,
      gemstone: product.gemstone || undefined
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
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

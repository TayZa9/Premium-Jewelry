import ProductGrid from '@/components/product/ProductGrid';

export const metadata = {
  title: 'All Collections | AURA',
  description: 'Explore our full luxury jewelry collection.',
};

export default function ProductsPage() {
  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif tracking-wide text-foreground mb-4">THE COLLECTION</h1>
          <p className="text-gray-500 max-w-2xl mx-auto tracking-wide font-light">
            Discover a wide selection of stunning pieces, perfectly crafted to illuminate your daily luxury.
          </p>
        </div>
        
        <ProductGrid />
      </div>
    </div>
  );
}

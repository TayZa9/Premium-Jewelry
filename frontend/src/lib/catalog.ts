export interface CatalogCategory {
  id?: string;
  name: string;
  slug: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  images: string[];
  material?: string;
  gemstone?: string;
  isFeatured?: boolean;
  category: CatalogCategory;
}

export interface ProductQueryFilters {
  material?: string | null;
  gemstone?: string | null;
  categoryId?: string | null;
  categorySlug?: string | null;
  sort?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  featured?: string | null;
}

export const FALLBACK_PRODUCTS: CatalogProduct[] = [
  {
    id: 'mock-emerald-cut-diamond-ring',
    name: 'Emerald Cut Diamond Ring',
    slug: 'emerald-cut-diamond-ring',
    description: 'A masterpiece of precision and elegance, featuring a radiant emerald-cut diamond set in luminous 18K white gold.',
    price: 12500,
    sku: 'JW-RING-EM01',
    stock: 10,
    images: ['/images/ring.png'],
    material: '18K White Gold',
    gemstone: 'Diamond',
    isFeatured: true,
    category: { name: 'Rings', slug: 'rings' },
  },
  {
    id: 'mock-minimalist-gold-pendant',
    name: 'Minimalist Gold Pendant',
    slug: 'minimalist-gold-pendant',
    description: 'A sleek everyday pendant crafted in polished 18K yellow gold for understated luxury.',
    price: 2100,
    sku: 'JW-NECK-MP01',
    stock: 18,
    images: ['/images/necklace.png'],
    material: '18K Yellow Gold',
    isFeatured: true,
    category: { name: 'Necklaces', slug: 'necklaces' },
  },
  {
    id: 'mock-classic-solitaire-ring',
    name: 'Classic Solitaire Ring',
    slug: 'classic-solitaire-ring',
    description: 'A timeless solitaire silhouette with a brilliant diamond elevated by a refined platinum band.',
    price: 8200,
    sku: 'JW-RING-CS01',
    stock: 8,
    images: ['/images/ring.png'],
    material: 'Platinum',
    gemstone: 'Diamond',
    category: { name: 'Rings', slug: 'rings' },
  },
  {
    id: 'mock-vintage-pearl-necklace',
    name: 'Vintage Pearl Necklace',
    slug: 'vintage-pearl-necklace',
    description: 'Lustrous pearls meet heritage-inspired gold detailing in a necklace designed for modern heirloom appeal.',
    price: 3400,
    sku: 'JW-NECK-VP01',
    stock: 6,
    images: ['/images/necklace.png'],
    material: 'Yellow Gold',
    gemstone: 'Pearl',
    category: { name: 'Necklaces', slug: 'necklaces' },
  },
  {
    id: 'mock-sapphire-halo-ring',
    name: 'Sapphire Halo Ring',
    slug: 'sapphire-halo-ring',
    description: 'A vivid sapphire center stone framed by a shimmering halo, handcrafted in bright white gold.',
    price: 6800,
    sku: 'JW-RING-SH01',
    stock: 7,
    images: ['/images/ring.png'],
    material: 'White Gold',
    gemstone: 'Sapphire',
    category: { name: 'Rings', slug: 'rings' },
  },
  {
    id: 'mock-diamond-tennis-necklace',
    name: 'Diamond Tennis Necklace',
    slug: 'diamond-tennis-necklace',
    description: 'An iconic line of expertly matched diamonds that brings gala-level brilliance to every occasion.',
    price: 24000,
    sku: 'JW-NECK-DT01',
    stock: 4,
    images: ['/images/necklace.png'],
    material: 'White Gold',
    gemstone: 'Diamond',
    category: { name: 'Necklaces', slug: 'necklaces' },
  },
];

export const FALLBACK_CATEGORIES: CatalogCategory[] = Array.from(
  new Map(FALLBACK_PRODUCTS.map((product) => [product.category.slug, product.category])).values()
);

export function formatPrice(price: number) {
  return `$${price.toLocaleString()}`;
}

export function findFallbackProductBySlug(slug: string) {
  return FALLBACK_PRODUCTS.find((product) => product.slug === slug) ?? null;
}

export function filterFallbackProducts(filters: ProductQueryFilters = {}) {
  let products = [...FALLBACK_PRODUCTS];

  if (filters.material) {
    const materials = filters.material.split(',').map((value) => value.trim().toLowerCase()).filter(Boolean);
    products = products.filter((product) =>
      product.material ? materials.some((material) => product.material!.toLowerCase().includes(material)) : false
    );
  }

  if (filters.gemstone) {
    const gemstones = filters.gemstone.split(',').map((value) => value.trim().toLowerCase()).filter(Boolean);
    products = products.filter((product) =>
      product.gemstone ? gemstones.some((gemstone) => product.gemstone!.toLowerCase().includes(gemstone)) : false
    );
  }

  if (filters.categorySlug) {
    products = products.filter((product) => product.category.slug === filters.categorySlug);
  }

  if (filters.featured === 'true') {
    products = products.filter((product) => product.isFeatured);
  }

  const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
  if (minPrice !== null || maxPrice !== null) {
    products = products.filter((product) => {
      if (minPrice !== null && product.price < minPrice) return false;
      if (maxPrice !== null && product.price > maxPrice) return false;
      return true;
    });
  }

  if (filters.sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'featured') {
    products.sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)));
  }

  return products;
}

export function searchFallbackProducts(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return FALLBACK_PRODUCTS.filter((product) =>
    [product.name, product.description, product.slug, product.material, product.gemstone, product.category.name]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalized))
  ).slice(0, 10);
}

import { NextRequest, NextResponse } from 'next/server';
import { filterFallbackProducts } from '@/lib/catalog';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const material = searchParams.get('material');
  const gemstone = searchParams.get('gemstone');
  const categoryId = searchParams.get('categoryId');
  const categorySlug = searchParams.get('categorySlug');
  const sort = searchParams.get('sort');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const featured = searchParams.get('featured');

  try {
    const where: any = {};

    if (material) {
      const materials = material.split(',');
      where.material = { in: materials, mode: 'insensitive' };
    }
    if (gemstone) {
      const gemstones = gemstone.split(',');
      where.gemstone = { in: gemstones, mode: 'insensitive' };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    else if (sort === 'price-desc') orderBy = { price: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };
    else if (sort === 'featured') orderBy = { isFeatured: 'desc' };

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      take: featured === 'true' ? 4 : undefined,
    });

    if (products.length === 0) {
      return NextResponse.json(
        filterFallbackProducts({ material, gemstone, categoryId, categorySlug, sort, minPrice, maxPrice, featured })
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      filterFallbackProducts({ material, gemstone, categoryId, categorySlug, sort, minPrice, maxPrice, featured })
    );
  }
}

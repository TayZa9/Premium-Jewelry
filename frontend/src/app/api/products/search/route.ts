import { NextRequest, NextResponse } from 'next/server';
import { searchFallbackProducts } from '@/lib/catalog';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        category: {
          select: { name: true }
        }
      },
      take: 10
    });

    if (products.length === 0) {
      return NextResponse.json({ products: searchFallbackProducts(query) });
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ products: searchFallbackProducts(query) });
  }
}

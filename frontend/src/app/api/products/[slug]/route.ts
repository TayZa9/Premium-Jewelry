import { NextRequest, NextResponse } from 'next/server';
import { findFallbackProductBySlug } from '@/lib/catalog';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true }
    });
    
    if (product) {
      return NextResponse.json(product);
    }

    const fallbackProduct = findFallbackProductBySlug(slug);
    if (fallbackProduct) {
      return NextResponse.json(fallbackProduct);
    }

    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    const { slug } = await params;
    const fallbackProduct = findFallbackProductBySlug(slug);
    if (fallbackProduct) {
      return NextResponse.json(fallbackProduct);
    }

    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

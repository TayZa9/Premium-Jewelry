import { NextResponse } from 'next/server';
import { FALLBACK_CATEGORIES } from '@/lib/catalog';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    if (categories.length === 0) {
      return NextResponse.json(FALLBACK_CATEGORIES);
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(FALLBACK_CATEGORIES);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin-auth';

export async function GET() {
  try {
    const { isAdmin, response } = await checkAdmin();
    if (!isAdmin) return response!;

    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Admin Products Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isAdmin, response } = await checkAdmin();
    if (!isAdmin) return response!;

    const data = await req.json();
    const { name, slug, description, price, sku, stock, categoryId, images, material, gemstone, isFeatured } = data;

    if (!name || !slug || !description || !price || !sku || !categoryId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        sku,
        stock: parseInt(stock) || 0,
        categoryId,
        images: images || [],
        material: material || null,
        gemstone: gemstone || null,
        isFeatured: isFeatured || false,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Admin Create Product Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Product with this slug or SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

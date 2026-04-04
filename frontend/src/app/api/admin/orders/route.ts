import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin-auth';

export async function GET() {
  try {
    const { isAdmin, response } = await checkAdmin();
    if (!isAdmin) return response!;

    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, images: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Admin Orders Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

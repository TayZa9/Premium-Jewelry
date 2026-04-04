import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin-auth';

export async function GET() {
  const { isAdmin, response } = await checkAdmin();
  if (!isAdmin) return response!;

  try {
    const [productCount, orderCount, totalRevenue, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count({ where: { stock: { lt: 5 } } }),
    ]);

    return NextResponse.json({
      products: productCount,
      orders: orderCount,
      revenue: Number(totalRevenue._sum.total) || 0,
      lowStock,
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

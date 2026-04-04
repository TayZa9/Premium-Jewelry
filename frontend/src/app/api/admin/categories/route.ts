import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin-auth';

export async function GET() {
  try {
    const { isAdmin, response } = await checkAdmin();
    if (!isAdmin) return response!;

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Admin Categories Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

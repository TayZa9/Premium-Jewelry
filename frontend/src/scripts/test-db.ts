import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Synchronizing database data...');

    // 1. Ensure Category exists
    const category = await prisma.category.upsert({
      where: { slug: 'rings' },
      update: {},
      create: {
        name: 'Rings',
        slug: 'rings',
        description: 'Exquisite rings for every occasion.',
      },
    });
    console.log('Category synced:', category.name);

    // 2. Upsert Emerald Cut Diamond Ring
    const product = await prisma.product.upsert({
      where: { slug: 'emerald-cut-diamond-ring' },
      update: {
        name: 'Emerald Cut Diamond Ring',
        price: 12500,
        description: 'A masterpiece of precision and elegance, featuring a 2-carat emerald-cut diamond set in 18K white gold.',
        material: '18K White Gold',
        gemstone: 'Diamond',
        stock: 10,
        isFeatured: true,
      },
      create: {
        name: 'Emerald Cut Diamond Ring',
        slug: 'emerald-cut-diamond-ring',
        price: 12500,
        description: 'A masterpiece of precision and elegance, featuring a 2-carat emerald-cut diamond set in 18K white gold.',
        sku: 'JW-RING-EM01',
        stock: 10,
        material: '18K White Gold',
        gemstone: 'Diamond',
        isFeatured: true,
        categoryId: category.id,
      },
    });
    console.log('Product synced:', product.name, `(${product.slug})`);

    // 3. Upsert Gold Solitaire Ring (Fixing mismatch discovered by browser)
    await prisma.product.upsert({
      where: { slug: 'gold-solitaire-ring' },
      update: {
        name: '18K Gold Solitaire Ring',
        price: 8900,
      },
      create: {
        name: '18K Gold Solitaire Ring',
        slug: 'gold-solitaire-ring',
        price: 8900,
        description: 'Classic elegance in a high-polish 18K yellow gold setting.',
        sku: 'JW-RING-GS01',
        stock: 15,
        material: '18K Yellow Gold',
        gemstone: 'Diamond',
        isFeatured: true,
        categoryId: category.id,
      },
    });
    console.log('Secondary product synced: 18K Gold Solitaire Ring');

    console.log('Database synchronization complete!');
  } catch (error) {
    console.error('Sync failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { material, gemstone, categoryId, sort, minPrice, maxPrice } = req.query;

    const where: any = {};

    if (material) {
      const materials = (material as string).split(',');
      where.material = { in: materials, mode: 'insensitive' };
    }
    if (gemstone) {
      const gemstones = (gemstone as string).split(',');
      where.gemstone = { in: gemstones, mode: 'insensitive' };
    }
    if (categoryId) {
      where.categoryId = categoryId as string;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
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
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug as string },
      include: { category: true }
    });
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
      take: 4,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    
    if (!q.trim()) {
      res.json([]);
      return;
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { material: { contains: q, mode: 'insensitive' } },
          { gemstone: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
      take: 10,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

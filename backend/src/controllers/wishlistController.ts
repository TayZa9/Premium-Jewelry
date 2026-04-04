import { Response } from 'express';
import prisma from '../prismaClient';
import { AuthRequest } from '../middleware/authMiddleware';

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ message: 'productId is required' });
      return;
    }

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Upsert to avoid duplicate errors
    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: req.user!.id,
          productId,
        },
      },
      update: {},
      create: {
        userId: req.user!.id,
        productId,
      },
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId as string;

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: req.user!.id,
        productId,
      },
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

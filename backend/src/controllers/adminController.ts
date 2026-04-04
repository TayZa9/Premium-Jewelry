import { Response } from 'express';
import prisma from '../prismaClient';
import { AuthRequest } from '../middleware/authMiddleware';

// ─── STATS ────────────────────────────────────────────────
export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [productCount, orderCount, totalRevenue, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count({ where: { stock: { lt: 5 } } }),
    ]);

    res.json({
      products: productCount,
      orders: orderCount,
      revenue: totalRevenue._sum.total || 0,
      lowStock,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PRODUCTS CRUD ────────────────────────────────────────
export const adminGetProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const adminCreateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, description, price, sku, stock, categoryId, images, material, gemstone, isFeatured } = req.body;

    if (!name || !slug || !description || !price || !sku || !categoryId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
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

    res.status(201).json(product);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Product with this slug or SKU already exists' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const adminUpdateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, slug, description, price, sku, stock, categoryId, images, material, gemstone, isFeatured } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(sku && { sku }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoryId && { categoryId }),
        ...(images && { images }),
        ...(material !== undefined && { material: material || null }),
        ...(gemstone !== undefined && { gemstone: gemstone || null }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
      include: { category: true },
    });

    res.json(product);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const adminDeleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const adminToggleFeatured = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
      include: { category: true },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ORDERS ───────────────────────────────────────────────
export const adminGetOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
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
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const adminUpdateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const validStatuses = ['PROCESSING', 'CONFIRMED', 'CRAFTING', 'SHIPPED', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, images: true } },
          },
        },
      },
    });

    res.json(order);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── CATEGORIES ───────────────────────────────────────────
export const adminGetCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── FILE UPLOAD ──────────────────────────────────────────
export const adminUploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware';
import {
  getStats,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminToggleFeatured,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetCategories,
  adminUploadImage,
} from '../controllers/adminController';

const router = Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// All routes require auth + admin
router.use(protect as any, admin as any);

// Stats
router.get('/stats', getStats as any);

// Products
router.get('/products', adminGetProducts as any);
router.post('/products', adminCreateProduct as any);
router.put('/products/:id', adminUpdateProduct as any);
router.delete('/products/:id', adminDeleteProduct as any);
router.patch('/products/:id/featured', adminToggleFeatured as any);

// Orders
router.get('/orders', adminGetOrders as any);
router.patch('/orders/:id/status', adminUpdateOrderStatus as any);

// Categories
router.get('/categories', adminGetCategories as any);

// File upload
router.post('/upload', upload.single('image'), adminUploadImage as any);

export default router;

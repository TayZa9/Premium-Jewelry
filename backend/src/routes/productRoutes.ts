import { Router } from 'express';
import { getProducts, getProductBySlug, getFeaturedProducts, searchProducts } from '../controllers/productController';

const router = Router();

router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

export default router;

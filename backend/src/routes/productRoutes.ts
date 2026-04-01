import { Router } from 'express';
import { getProducts, getProductBySlug, getFeaturedProducts } from '../controllers/productController';

const router = Router();

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

export default router;

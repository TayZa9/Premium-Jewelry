import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';

const router = Router();

router.get('/', protect as any, getWishlist as any);
router.post('/', protect as any, addToWishlist as any);
router.delete('/:productId', protect as any, removeFromWishlist as any);

export default router;

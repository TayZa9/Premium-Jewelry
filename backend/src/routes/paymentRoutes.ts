import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Requires user to be authenticated to trigger payment
router.post('/create-intent', protect, createPaymentIntent);

export default router;

import { Router } from 'express';
import { createOrder, verifyPayment, createCoupon } from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify-payment', authenticate, verifyPayment);

// Coupon management (restricted to admins/instructors)
router.post('/coupons', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), createCoupon);

export default router;

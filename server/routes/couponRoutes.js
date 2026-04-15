import express from 'express';
import {
  validateCoupon,
  getCoupons,
  getActiveCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public routes – static first
router.post('/validate', validateCoupon);
router.get('/active', getActiveCoupons);   // MUST be before /:id

// ✅ Admin routes – dynamic after static
router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;
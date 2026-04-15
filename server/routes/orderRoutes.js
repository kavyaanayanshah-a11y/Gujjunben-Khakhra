import express from 'express';
import { createOrder, getMyOrders, getOrderById, trackOrder, getAllOrders, updateOrderStatus, updateDeliveryStatus } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/track/:id', trackOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/delivery', protect, admin, updateDeliveryStatus);

export default router;
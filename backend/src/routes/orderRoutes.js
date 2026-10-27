import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, createOrder)
  .get(protect, requireAdmin, getAllOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/status').put(protect, requireAdmin, updateOrderStatus);

export default router;

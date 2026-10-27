import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getNewArrivals,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, requireAdmin, createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, requireAdmin, updateProduct)
  .delete(protect, requireAdmin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;

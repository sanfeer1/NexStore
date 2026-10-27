import express from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, requireAdmin, createCategory);

router.route('/:id').delete(protect, requireAdmin, deleteCategory);

export default router;

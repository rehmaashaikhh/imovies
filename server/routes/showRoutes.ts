import { Router } from 'express';
import {
  getShows,
  getShowById,
  getSeatsForShow,
  createShow,
  updateShow,
  deleteShow,
  toggleSeatBlock,
} from '../controllers/showController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getShows);
router.get('/:id', getShowById);
router.get('/:id/seats', getSeatsForShow);
router.post('/', authenticate, requireAdmin, createShow);
router.put('/:id', authenticate, requireAdmin, updateShow);
router.delete('/:id', authenticate, requireAdmin, deleteShow);
router.patch('/:id/seats/block', authenticate, requireAdmin, toggleSeatBlock);

export default router;

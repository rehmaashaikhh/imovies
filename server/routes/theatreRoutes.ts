import { Router } from 'express';
import {
  getAllTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} from '../controllers/theatreController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllTheatres);
router.get('/:id', getTheatreById);
router.post('/', authenticate, requireAdmin, createTheatre);
router.put('/:id', authenticate, requireAdmin, updateTheatre);
router.delete('/:id', authenticate, requireAdmin, deleteTheatre);

export default router;

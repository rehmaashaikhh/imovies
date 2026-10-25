import { Router } from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', authenticate, requireAdmin, createMovie);
router.put('/:id', authenticate, requireAdmin, updateMovie);
router.delete('/:id', authenticate, requireAdmin, deleteMovie);

export default router;

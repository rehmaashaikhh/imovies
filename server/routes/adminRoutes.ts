import { Router } from 'express';
import {
  getAdminDashboard,
  getAllAdminBookings,
  resetDatabase,
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authenticate, requireAdmin, getAdminDashboard);
router.get('/bookings', authenticate, requireAdmin, getAllAdminBookings);
router.post('/reset-database', authenticate, requireAdmin, resetDatabase);

export default router;

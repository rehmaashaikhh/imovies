import { Request, Response } from 'express';
import { dbStore } from '../services/dbStore.js';

export async function getAdminDashboard(req: Request, res: Response): Promise<void> {
  try {
    const stats = dbStore.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAllAdminBookings(req: Request, res: Response): Promise<void> {
  try {
    const bookings = dbStore.getAllBookings();
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function resetDatabase(req: Request, res: Response): Promise<void> {
  try {
    dbStore.seedDefaultData(true);
    res.json({ success: true, message: 'Database reset to default college demonstration seed successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

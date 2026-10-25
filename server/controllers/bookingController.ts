import { Response } from 'express';
import { dbStore } from '../services/dbStore.js';
import { AuthRequest } from '../middleware/auth.js';

export async function createBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to book tickets' });
      return;
    }

    const { showId, selectedSeats, paymentMethod } = req.body;

    if (!showId || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      res.status(400).json({ success: false, message: 'Please provide showId and an array of selectedSeats' });
      return;
    }

    const booking = dbStore.createBooking({
      userId: req.user._id,
      showId,
      selectedSeats,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: booking,
    });
  } catch (error: any) {
    if (error.statusCode === 409) {
      res.status(409).json({
        success: false,
        message: error.message,
        conflicts: error.conflicts,
      });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Failed to complete booking' });
  }
}

export async function getMyBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const bookings = dbStore.getMyBookings(req.user._id);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getBookingById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const booking = dbStore.getBookingById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    // Ownership check: regular users can only see their own bookings
    if (req.user?.role !== 'admin' && booking.userId !== req.user?._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to view this booking' });
      return;
    }

    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function cancelBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';
    const updated = dbStore.cancelBooking(id, req.user._id, isAdmin);

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released and refund initiated.',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to cancel booking' });
  }
}

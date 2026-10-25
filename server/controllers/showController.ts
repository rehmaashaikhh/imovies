import { Request, Response } from 'express';
import { dbStore } from '../services/dbStore.js';

export async function getShows(req: Request, res: Response): Promise<void> {
  try {
    const { movieId, theatreId, date } = req.query;
    const shows = dbStore.getShows({
      movieId: movieId as string,
      theatreId: theatreId as string,
      date: date as string,
    });
    res.json({ success: true, count: shows.length, data: shows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getShowById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const show = dbStore.getShowById(id);
    if (!show) {
      res.status(404).json({ success: false, message: 'Showtime not found' });
      return;
    }
    res.json({ success: true, data: show });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSeatsForShow(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const show = dbStore.getShowById(id);
    if (!show) {
      res.status(404).json({ success: false, message: 'Showtime not found' });
      return;
    }
    res.json({
      success: true,
      showId: show._id,
      movieTitle: show.movie?.title,
      theatreName: show.theatre?.name,
      screenName: show.screenName,
      showDate: show.showDate,
      startTime: show.startTime,
      tierPrices: show.tierPrices,
      seatInventory: show.seatInventory,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createShow(req: Request, res: Response): Promise<void> {
  try {
    const { movieId, theatreId, showDate, startTime, screenFormat, screenName, tierPrices, basePath } = req.body;

    if (!movieId || !theatreId || !showDate || !startTime) {
      res.status(400).json({ success: false, message: 'Movie, theatre, date, and start time are required' });
      return;
    }

    const show = dbStore.createShow({
      movieId,
      theatreId,
      showDate,
      startTime,
      screenFormat: screenFormat || 'Dolby Cinema',
      screenName: screenName || 'Screen 1',
      basePrice: tierPrices?.Gold || 16,
      tierPrices: tierPrices || { Silver: 12, Gold: 16, Platinum: 22 },
      status: 'active',
    });

    res.status(201).json({ success: true, message: 'Showtime scheduled successfully', data: show });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateShow(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = dbStore.updateShow(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Show not found' });
      return;
    }
    res.json({ success: true, message: 'Show updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteShow(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = dbStore.deleteShow(id);
    if (!success) {
      res.status(404).json({ success: false, message: 'Show not found' });
      return;
    }
    res.json({ success: true, message: 'Show deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function toggleSeatBlock(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { seatNumbers, action } = req.body;

    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      res.status(400).json({ success: false, message: 'seatNumbers array required' });
      return;
    }

    const updatedSeats = dbStore.toggleSeatBlock(id, seatNumbers, action === 'unblock' ? 'unblock' : 'block');
    if (!updatedSeats) {
      res.status(404).json({ success: false, message: 'Show not found' });
      return;
    }

    res.json({ success: true, message: `Seats ${action || 'block'}ed successfully`, data: updatedSeats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

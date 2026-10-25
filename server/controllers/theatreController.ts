import { Request, Response } from 'express';
import { dbStore } from '../services/dbStore.js';

export async function getAllTheatres(req: Request, res: Response): Promise<void> {
  try {
    const theatres = dbStore.getAllTheatres();
    res.json({ success: true, count: theatres.length, data: theatres });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getTheatreById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const theatre = dbStore.getTheatreById(id);
    if (!theatre) {
      res.status(404).json({ success: false, message: 'Theatre not found' });
      return;
    }
    res.json({ success: true, data: theatre });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createTheatre(req: Request, res: Response): Promise<void> {
  try {
    const { name, location, address, city, screens, totalSeats, seatLayout, amenities } = req.body;
    if (!name || !location || !address) {
      res.status(400).json({ success: false, message: 'Name, location, and address are required' });
      return;
    }

    const theatre = dbStore.createTheatre({
      name,
      location,
      address,
      city: city || 'Metro City',
      screens: screens || ['Screen 1 - 4K Laser', 'Screen 2 - Atmos'],
      totalSeats: totalSeats || 60,
      seatLayout: seatLayout || {
        totalRows: 6,
        seatsPerRow: 10,
        tiers: [
          { name: 'Silver', price: 12, rows: ['A', 'B'] },
          { name: 'Gold', price: 16, rows: ['C', 'D'] },
          { name: 'Platinum', price: 22, rows: ['E', 'F'] },
        ],
      },
      amenities: amenities || ['Dolby Sound', 'Recliners', 'Cafeteria'],
    });

    res.status(201).json({ success: true, message: 'Theatre created', data: theatre });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateTheatre(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = dbStore.updateTheatre(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Theatre not found' });
      return;
    }
    res.json({ success: true, message: 'Theatre updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteTheatre(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = dbStore.deleteTheatre(id);
    if (!success) {
      res.status(404).json({ success: false, message: 'Theatre not found' });
      return;
    }
    res.json({ success: true, message: 'Theatre deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

import { Request, Response } from 'express';
import { dbStore } from '../services/dbStore.js';

export async function getAllMovies(req: Request, res: Response): Promise<void> {
  try {
    const { status, genre, search } = req.query;
    const movies = dbStore.getAllMovies({
      status: status as string,
      genre: genre as string,
      search: search as string,
    });
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getMovieById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const movie = dbStore.getMovieById(id);
    if (!movie) {
      res.status(404).json({ success: false, message: 'Movie not found' });
      return;
    }
    res.json({ success: true, data: movie });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createMovie(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, genre, language, duration, releaseDate, posterUrl, bannerUrl, cast, director, rating, status, trailerUrl, certificate } = req.body;

    if (!title || !description || !duration || !posterUrl) {
      res.status(400).json({ success: false, message: 'Title, description, duration, and poster URL are required.' });
      return;
    }

    const movie = dbStore.createMovie({
      title,
      description,
      genre: Array.isArray(genre) ? genre : [genre],
      language: language || 'English',
      duration: Number(duration),
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      posterUrl,
      bannerUrl: bannerUrl || posterUrl,
      cast: Array.isArray(cast) ? cast : cast ? [cast] : [],
      director: director || 'Director',
      rating: Number(rating) || 8.0,
      status: status || 'now-showing',
      trailerUrl: trailerUrl || '',
      certificate: certificate || 'PG-13',
    });

    res.status(201).json({ success: true, message: 'Movie added successfully', data: movie });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateMovie(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = dbStore.updateMovie(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Movie not found' });
      return;
    }
    res.json({ success: true, message: 'Movie updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteMovie(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = dbStore.deleteMovie(id);
    if (!success) {
      res.status(404).json({ success: false, message: 'Movie not found' });
      return;
    }
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

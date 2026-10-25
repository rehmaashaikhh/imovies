import {
  User,
  Movie,
  Theatre,
  Show,
  SeatItem,
  Booking,
  DashboardStats,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('imovies_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const error: any = new Error(data.message || 'API request failed');
    error.status = res.status;
    error.conflicts = data.conflicts;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  async register(body: { name: string; email: string; password: string; phone?: string }) {
    return request<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async login(body: { email: string; password: string }) {
    return request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async getMe() {
    return request<{ success: boolean; user: User }>('/auth/me');
  },

  // Movies
  async getMovies(params?: { status?: string; genre?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.genre && params.genre !== 'All') query.append('genre', params.genre);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: Movie[] }>(`/movies${queryString}`);
  },

  async getMovieById(id: string) {
    return request<{ success: boolean; data: Movie }>(`/movies/${id}`);
  },

  async createMovie(movie: Partial<Movie>) {
    return request<{ success: boolean; message: string; data: Movie }>('/movies', {
      method: 'POST',
      body: JSON.stringify(movie),
    });
  },

  async updateMovie(id: string, updates: Partial<Movie>) {
    return request<{ success: boolean; message: string; data: Movie }>(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteMovie(id: string) {
    return request<{ success: boolean; message: string }>(`/movies/${id}`, {
      method: 'DELETE',
    });
  },

  // Theatres
  async getTheatres() {
    return request<{ success: boolean; count: number; data: Theatre[] }>('/theatres');
  },

  async getTheatreById(id: string) {
    return request<{ success: boolean; data: Theatre }>(`/theatres/${id}`);
  },

  async createTheatre(theatre: Partial<Theatre>) {
    return request<{ success: boolean; message: string; data: Theatre }>('/theatres', {
      method: 'POST',
      body: JSON.stringify(theatre),
    });
  },

  async updateTheatre(id: string, updates: Partial<Theatre>) {
    return request<{ success: boolean; message: string; data: Theatre }>(`/theatres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteTheatre(id: string) {
    return request<{ success: boolean; message: string }>(`/theatres/${id}`, {
      method: 'DELETE',
    });
  },

  // Shows
  async getShows(params?: { movieId?: string; theatreId?: string; date?: string }) {
    const query = new URLSearchParams();
    if (params?.movieId) query.append('movieId', params.movieId);
    if (params?.theatreId) query.append('theatreId', params.theatreId);
    if (params?.date) query.append('date', params.date);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: Show[] }>(`/shows${queryString}`);
  },

  async getShowById(id: string) {
    return request<{ success: boolean; data: Show }>(`/shows/${id}`);
  },

  async getShowSeats(showId: string) {
    return request<{
      success: boolean;
      showId: string;
      movieTitle: string;
      theatreName: string;
      screenName: string;
      showDate: string;
      startTime: string;
      tierPrices: { Silver: number; Gold: number; Platinum: number };
      seatInventory: SeatItem[];
    }>(`/shows/${showId}/seats`);
  },

  async createShow(show: Partial<Show>) {
    return request<{ success: boolean; message: string; data: Show }>('/shows', {
      method: 'POST',
      body: JSON.stringify(show),
    });
  },

  async updateShow(id: string, updates: Partial<Show>) {
    return request<{ success: boolean; message: string; data: Show }>(`/shows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteShow(id: string) {
    return request<{ success: boolean; message: string }>(`/shows/${id}`, {
      method: 'DELETE',
    });
  },

  async blockSeats(showId: string, seatNumbers: string[], action: 'block' | 'unblock') {
    return request<{ success: boolean; message: string; data: SeatItem[] }>(`/shows/${showId}/seats/block`, {
      method: 'PATCH',
      body: JSON.stringify({ seatNumbers, action }),
    });
  },

  // Bookings
  async createBooking(data: { showId: string; selectedSeats: string[]; paymentMethod?: string }) {
    return request<{ success: boolean; message: string; data: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyBookings() {
    return request<{ success: boolean; count: number; data: Booking[] }>('/bookings/my');
  },

  async getBookingById(id: string) {
    return request<{ success: boolean; data: Booking }>(`/bookings/${id}`);
  },

  async cancelBooking(id: string) {
    return request<{ success: boolean; message: string; data: Booking }>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  // Admin
  async getAdminDashboard() {
    return request<{ success: boolean; data: DashboardStats }>('/admin/dashboard');
  },

  async getAllAdminBookings() {
    return request<{ success: boolean; count: number; data: Booking[] }>('/admin/bookings');
  },

  async resetDatabase() {
    return request<{ success: boolean; message: string }>('/admin/reset-database', {
      method: 'POST',
    });
  },
};

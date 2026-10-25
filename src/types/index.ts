export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt?: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number; // in minutes
  releaseDate: string;
  posterUrl: string;
  bannerUrl: string;
  cast: string[];
  director: string;
  rating: number;
  trailerUrl?: string;
  certificate?: string;
  status: 'now-showing' | 'upcoming';
  createdAt?: string;
}

export interface SeatTier {
  name: 'Silver' | 'Gold' | 'Platinum';
  price: number;
  rows: string[];
}

export interface Theatre {
  _id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  screens: string[];
  totalSeats: number;
  seatLayout: {
    totalRows: number;
    seatsPerRow: number;
    tiers: SeatTier[];
  };
  amenities: string[];
}

export interface SeatItem {
  seatNumber: string;
  row: string;
  col: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  price: number;
  status: 'available' | 'booked' | 'blocked' | 'reserved';
}

export interface Show {
  _id: string;
  movieId: string;
  theatreId: string;
  showDate: string;
  startTime: string;
  screenFormat: string;
  screenName: string;
  basePrice: number;
  tierPrices: {
    Silver: number;
    Gold: number;
    Platinum: number;
  };
  seatInventory?: SeatItem[];
  movie?: Movie;
  theatre?: Theatre;
}

export interface BookedSeatDetail {
  seatNumber: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  price: number;
}

export interface Booking {
  _id: string;
  bookingReference: string;
  userId: string;
  showId: string;
  movieId: string;
  theatreId: string;
  selectedSeats: string[];
  seatsDetail: BookedSeatDetail[];
  numberOfTickets: number;
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  bookingStatus: 'confirmed' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'refunded' | 'failed' | 'simulated';
  paymentMethod: string;
  bookedAt: string;
  cancelledAt?: string;
  qrCodeData: string;
  customerName?: string;
  customerEmail?: string;
  show?: Show;
  movie?: Movie;
  theatre?: Theatre;
}

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalTicketsSold: number;
  activeMovies: number;
  upcomingMovies: number;
  totalTheatres: number;
  totalShows: number;
  totalUsers: number;
  occupancyRate: number;
  recentBookings: Booking[];
}

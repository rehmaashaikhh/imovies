import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { INITIAL_MOVIES, INITIAL_THEATRES, generateSeatInventory } from '../scripts/sampleData.js';

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovieDoc {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number;
  releaseDate: string;
  posterUrl: string;
  bannerUrl: string;
  cast: string[];
  director: string;
  rating: number;
  trailerUrl?: string;
  certificate?: string;
  ageRating?: string;
  status: 'now-showing' | 'upcoming';
  createdAt: string;
  updatedAt: string;
}

export interface TheatreDoc {
  _id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  screens: string[];
  totalSeats: number;
  seatLayout: any;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SeatItem {
  seatNumber: string;
  row: string;
  col: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  price: number;
  status: 'available' | 'booked' | 'blocked' | 'reserved';
  heldBy?: string;
  heldUntil?: string;
}

export interface ShowDoc {
  _id: string;
  movieId: string;
  theatreId: string;
  showDate: string; // YYYY-MM-DD
  startTime: string; // "14:30"
  screenFormat: string;
  screenName: string;
  basePrice: number;
  tierPrices: {
    Silver: number;
    Gold: number;
    Platinum: number;
  };
  seatInventory: SeatItem[];
  status: 'active' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  // populated when requested
  movie?: MovieDoc;
  theatre?: TheatreDoc;
}

export interface BookingDoc {
  _id: string;
  bookingReference: string;
  userId: string;
  showId: string;
  movieId: string;
  theatreId: string;
  selectedSeats: string[];
  seatsDetail: Array<{ seatNumber: string; tier: 'Silver' | 'Gold' | 'Platinum'; price: number }>;
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
  createdAt: string;
  updatedAt: string;
  // populated
  show?: ShowDoc;
  movie?: MovieDoc;
  theatre?: TheatreDoc;
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

class DatabaseStore {
  private users: UserDoc[] = [];
  private movies: MovieDoc[] = [];
  private theatres: TheatreDoc[] = [];
  private shows: ShowDoc[] = [];
  private bookings: BookingDoc[] = [];
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;

    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.warn('Could not create data dir:', err);
      }
    }

    if (fs.existsSync(STORE_FILE)) {
      try {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || [];
        this.movies = data.movies || [];
        this.theatres = data.theatres || [];
        this.shows = data.shows || [];
        this.bookings = data.bookings || [];
        this.initialized = true;
        console.log(`📦 Loaded stored database: ${this.movies.length} movies, ${this.shows.length} shows, ${this.bookings.length} bookings`);
        return;
      } catch (e) {
        console.warn('Could not parse existing store.json, re-seeding default data.');
      }
    }

    this.seedDefaultData();
    this.initialized = true;
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(
        STORE_FILE,
        JSON.stringify(
          {
            users: this.users,
            movies: this.movies,
            theatres: this.theatres,
            shows: this.shows,
            bookings: this.bookings,
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch (err) {
      console.warn('Could not persist store to disk, retaining in memory:', err);
    }
  }

  public seedDefaultData(forceReset = false) {
    const now = new Date().toISOString();

    // Default users
    const adminPasswordHash = bcrypt.hashSync('Admin@123', 10);
    const userPasswordHash = bcrypt.hashSync('User@123', 10);

    this.users = [
      {
        _id: 'usr_admin',
        name: 'Cinema Administrator',
        email: 'admin@imovies.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        phone: '+1 (555) 019-2831',
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: 'usr_demouser',
        name: 'Rehma Shaikh',
        email: 'user@imovies.com',
        passwordHash: userPasswordHash,
        role: 'user',
        phone: '+1 (555) 014-9923',
        createdAt: now,
        updatedAt: now,
      },
    ];

    this.movies = INITIAL_MOVIES.map((m) => ({
      ...m,
      createdAt: now,
      updatedAt: now,
    })) as MovieDoc[];

    this.theatres = INITIAL_THEATRES.map((t) => ({
      ...t,
      createdAt: now,
      updatedAt: now,
    })) as TheatreDoc[];

    // Generate dynamic shows for today, tomorrow, and day after tomorrow
    this.shows = [];
    const today = new Date();
    const dates = [0, 1, 2, 3].map((offset) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offset);
      return d.toISOString().split('T')[0];
    });

    const nowShowingMovies = this.movies.filter((m) => m.status === 'now-showing');

    let showCounter = 1;
    for (const movie of nowShowingMovies) {
      for (const theatre of this.theatres) {
        for (const showDate of dates) {
          const times = [
            { time: '11:00 AM', format: 'IMAX 3D', screen: 'Screen 1', booked: ['C4', 'C5'] },
            { time: '02:45 PM', format: 'Dolby Atmos', screen: 'Screen 2', booked: ['D3', 'D4', 'D5'] },
            { time: '06:30 PM', format: 'IMAX with Laser', screen: 'Screen 1', booked: ['C5', 'C6', 'E4', 'E5'] },
            { time: '09:45 PM', format: 'Luxury Recliner', screen: 'Screen 3 VIP', booked: ['E2', 'E3'] },
          ];

          for (const item of times) {
            const showId = `shw_${showCounter++}`;
            const tierPrices = {
              Silver: theatre.seatLayout.tiers.find((t: any) => t.name === 'Silver')?.price || 12,
              Gold: theatre.seatLayout.tiers.find((t: any) => t.name === 'Gold')?.price || 16,
              Platinum: theatre.seatLayout.tiers.find((t: any) => t.name === 'Platinum')?.price || 22,
            };

            const inventory = generateSeatInventory(
              theatre.seatLayout,
              item.booked,
              ['A1', 'F10'] // couple maintenance seats blocked
            );

            this.shows.push({
              _id: showId,
              movieId: movie._id,
              theatreId: theatre._id,
              showDate,
              startTime: item.time,
              screenFormat: item.format,
              screenName: item.screen,
              basePrice: tierPrices.Gold,
              tierPrices,
              seatInventory: inventory,
              status: 'active',
              createdAt: now,
              updatedAt: now,
            });
          }
        }
      }
    }

    // Seed sample initial confirmed booking for the demo user
    const sampleShow = this.shows[0];
    if (sampleShow) {
      this.bookings = [
        {
          _id: 'bk_sample_01',
          bookingReference: 'IMV-2026-8942',
          userId: 'usr_demouser',
          showId: sampleShow._id,
          movieId: sampleShow.movieId,
          theatreId: sampleShow.theatreId,
          selectedSeats: ['C4', 'C5'],
          seatsDetail: [
            { seatNumber: 'C4', tier: 'Gold', price: 16 },
            { seatNumber: 'C5', tier: 'Gold', price: 16 },
          ],
          numberOfTickets: 2,
          subtotal: 32,
          convenienceFee: 2.5,
          tax: 1.6,
          totalAmount: 36.1,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card (Visa ending in 4242)',
          bookedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          qrCodeData: 'IMOVIES-TICKET-IMV-2026-8942-USER-REHMA-2-TICKETS',
          customerName: 'Rehma Shaikh',
          customerEmail: 'user@imovies.com',
          createdAt: now,
          updatedAt: now,
        },
      ];
    }

    this.save();
    console.log(`🎬 Database initialized: ${this.movies.length} movies, ${this.theatres.length} theatres, ${this.shows.length} shows generated!`);
  }

  // --- Users ---
  public findUserById(id: string): UserDoc | undefined {
    return this.users.find((u) => u._id === id);
  }

  public findUserByEmail(email: string): UserDoc | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: { name: string; email: string; password: string; role?: 'user' | 'admin'; phone?: string }): UserDoc {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(userData.password, salt);
    const now = new Date().toISOString();

    const newUser: UserDoc = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      passwordHash,
      role: userData.role || 'user',
      phone: userData.phone || '',
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);
    this.save();
    return newUser;
  }

  public getAllUsers(): UserDoc[] {
    return this.users;
  }

  // --- Movies ---
  public getAllMovies(filter?: { status?: string; genre?: string; search?: string }): MovieDoc[] {
    let list = [...this.movies];
    if (filter?.status) {
      list = list.filter((m) => m.status === filter.status);
    }
    if (filter?.genre && filter.genre !== 'All') {
      list = list.filter((m) => m.genre.some((g) => g.toLowerCase() === filter.genre?.toLowerCase()));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((c) => c.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public getMovieById(id: string): MovieDoc | undefined {
    return this.movies.find((m) => m._id === id);
  }

  public createMovie(movieData: Omit<MovieDoc, '_id' | 'createdAt' | 'updatedAt'>): MovieDoc {
    const now = new Date().toISOString();
    const movie: MovieDoc = {
      ...movieData,
      _id: `mov_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.movies.push(movie);
    this.save();
    return movie;
  }

  public updateMovie(id: string, updates: Partial<MovieDoc>): MovieDoc | null {
    const idx = this.movies.findIndex((m) => m._id === id);
    if (idx === -1) return null;

    this.movies[idx] = {
      ...this.movies[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.movies[idx];
  }

  public deleteMovie(id: string): boolean {
    const initialLen = this.movies.length;
    this.movies = this.movies.filter((m) => m._id !== id);
    // Also remove shows associated with deleted movie
    this.shows = this.shows.filter((s) => s.movieId !== id);
    this.save();
    return this.movies.length < initialLen;
  }

  // --- Theatres ---
  public getAllTheatres(): TheatreDoc[] {
    return this.theatres;
  }

  public getTheatreById(id: string): TheatreDoc | undefined {
    return this.theatres.find((t) => t._id === id);
  }

  public createTheatre(theatreData: Omit<TheatreDoc, '_id' | 'createdAt' | 'updatedAt'>): TheatreDoc {
    const now = new Date().toISOString();
    const theatre: TheatreDoc = {
      ...theatreData,
      _id: `th_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.theatres.push(theatre);
    this.save();
    return theatre;
  }

  public updateTheatre(id: string, updates: Partial<TheatreDoc>): TheatreDoc | null {
    const idx = this.theatres.findIndex((t) => t._id === id);
    if (idx === -1) return null;

    this.theatres[idx] = {
      ...this.theatres[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.theatres[idx];
  }

  public deleteTheatre(id: string): boolean {
    const len = this.theatres.length;
    this.theatres = this.theatres.filter((t) => t._id !== id);
    this.shows = this.shows.filter((s) => s.theatreId !== id);
    this.save();
    return this.theatres.length < len;
  }

  // --- Shows ---
  public getShows(params?: { movieId?: string; theatreId?: string; date?: string }): ShowDoc[] {
    let list = [...this.shows];
    if (params?.movieId) {
      list = list.filter((s) => s.movieId === params.movieId);
    }
    if (params?.theatreId) {
      list = list.filter((s) => s.theatreId === params.theatreId);
    }
    if (params?.date) {
      list = list.filter((s) => s.showDate === params.date);
    }

    // Populate movie and theatre objects
    return list.map((s) => ({
      ...s,
      movie: this.getMovieById(s.movieId),
      theatre: this.getTheatreById(s.theatreId),
    }));
  }

  public getShowById(id: string): ShowDoc | undefined {
    const s = this.shows.find((item) => item._id === id);
    if (!s) return undefined;
    return {
      ...s,
      movie: this.getMovieById(s.movieId),
      theatre: this.getTheatreById(s.theatreId),
    };
  }

  public createShow(showData: Omit<ShowDoc, '_id' | 'createdAt' | 'updatedAt' | 'seatInventory'>): ShowDoc {
    const now = new Date().toISOString();
    const theatre = this.getTheatreById(showData.theatreId);
    const layout = theatre ? theatre.seatLayout : { totalRows: 6, seatsPerRow: 10 };
    const seatInventory = generateSeatInventory(layout);

    const show: ShowDoc = {
      ...showData,
      _id: `shw_${Date.now()}`,
      seatInventory,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.shows.push(show);
    this.save();
    return show;
  }

  public updateShow(id: string, updates: Partial<ShowDoc>): ShowDoc | null {
    const idx = this.shows.findIndex((s) => s._id === id);
    if (idx === -1) return null;

    this.shows[idx] = {
      ...this.shows[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.shows[idx];
  }

  public deleteShow(id: string): boolean {
    const len = this.shows.length;
    this.shows = this.shows.filter((s) => s._id !== id);
    this.save();
    return this.shows.length < len;
  }

  public getSeatsForShow(showId: string): SeatItem[] | null {
    const show = this.shows.find((s) => s._id === showId);
    if (!show) return null;
    return show.seatInventory;
  }

  public toggleSeatBlock(showId: string, seatNumbers: string[], action: 'block' | 'unblock'): SeatItem[] | null {
    const show = this.shows.find((s) => s._id === showId);
    if (!show) return null;

    seatNumbers.forEach((seatNum) => {
      const seat = show.seatInventory.find((s) => s.seatNumber === seatNum);
      if (seat) {
        if (action === 'block' && seat.status === 'available') {
          seat.status = 'blocked';
        } else if (action === 'unblock' && seat.status === 'blocked') {
          seat.status = 'available';
        }
      }
    });

    show.updatedAt = new Date().toISOString();
    this.save();
    return show.seatInventory;
  }

  // --- Bookings with Server-Side Double-Booking Prevention & Validation ---
  public createBooking(data: {
    userId: string;
    showId: string;
    selectedSeats: string[];
    paymentMethod?: string;
  }): BookingDoc {
    const show = this.shows.find((s) => s._id === data.showId);
    if (!show) {
      throw new Error('Showtime not found or has expired');
    }

    if (!data.selectedSeats || data.selectedSeats.length === 0) {
      throw new Error('Please select at least one seat');
    }

    if (data.selectedSeats.length > 8) {
      throw new Error('Maximum 8 seats allowed per booking transaction');
    }

    // ATOMIC VALIDATION: Check that ALL requested seats are strictly 'available'
    const conflictingSeats: string[] = [];
    const seatItemsToBook: SeatItem[] = [];

    for (const seatCode of data.selectedSeats) {
      const seat = show.seatInventory.find((s) => s.seatNumber === seatCode);
      if (!seat) {
        throw new Error(`Seat ${seatCode} does not exist in this theatre layout`);
      }
      if (seat.status !== 'available') {
        conflictingSeats.push(seatCode);
      } else {
        seatItemsToBook.push(seat);
      }
    }

    if (conflictingSeats.length > 0) {
      const conflictError: any = new Error(
        `Seats already reserved or unavailable: ${conflictingSeats.join(', ')}. Please choose other seats.`
      );
      conflictError.statusCode = 409;
      conflictError.conflicts = conflictingSeats;
      throw conflictError;
    }

    // Mark seats as booked atomically
    for (const seat of seatItemsToBook) {
      seat.status = 'booked';
    }

    // Server-side authoritative price calculation
    const seatsDetail = seatItemsToBook.map((s) => ({
      seatNumber: s.seatNumber,
      tier: s.tier,
      price: s.price,
    }));

    const subtotal = seatsDetail.reduce((sum, item) => sum + item.price, 0);
    const convenienceFee = parseFloat((2.5 * seatsDetail.length).toFixed(2));
    const tax = parseFloat((subtotal * 0.08).toFixed(2)); // 8% sales tax
    const totalAmount = parseFloat((subtotal + convenienceFee + tax).toFixed(2));

    const user = this.findUserById(data.userId);
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingReference = `IMV-${new Date().getFullYear()}-${randomHex}`;
    const now = new Date().toISOString();

    const booking: BookingDoc = {
      _id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      bookingReference,
      userId: data.userId,
      showId: show._id,
      movieId: show.movieId,
      theatreId: show.theatreId,
      selectedSeats: data.selectedSeats,
      seatsDetail,
      numberOfTickets: data.selectedSeats.length,
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: data.paymentMethod || 'Credit Card (Simulated Gateway)',
      bookedAt: now,
      qrCodeData: `IMOVIES-TICKET-${bookingReference}-${user?.name || 'GUEST'}-${data.selectedSeats.join('-')}`,
      customerName: user?.name || 'Valued Moviegoer',
      customerEmail: user?.email || '',
      createdAt: now,
      updatedAt: now,
      show,
      movie: this.getMovieById(show.movieId),
      theatre: this.getTheatreById(show.theatreId),
    };

    this.bookings.unshift(booking);
    show.updatedAt = now;
    this.save();

    return booking;
  }

  public getMyBookings(userId: string): BookingDoc[] {
    return this.bookings
      .filter((b) => b.userId === userId)
      .map((b) => ({
        ...b,
        show: this.getShowById(b.showId),
        movie: this.getMovieById(b.movieId),
        theatre: this.getTheatreById(b.theatreId),
      }));
  }

  public getBookingById(id: string): BookingDoc | undefined {
    const b = this.bookings.find((item) => item._id === id || item.bookingReference === id);
    if (!b) return undefined;
    return {
      ...b,
      show: this.getShowById(b.showId),
      movie: this.getMovieById(b.movieId),
      theatre: this.getTheatreById(b.theatreId),
    };
  }

  public getAllBookings(): BookingDoc[] {
    return this.bookings.map((b) => ({
      ...b,
      show: this.getShowById(b.showId),
      movie: this.getMovieById(b.movieId),
      theatre: this.getTheatreById(b.theatreId),
    }));
  }

  public cancelBooking(bookingId: string, userId: string, isAdmin = false): BookingDoc {
    const booking = this.bookings.find((b) => b._id === bookingId || b.bookingReference === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (!isAdmin && booking.userId !== userId) {
      throw new Error('Unauthorized to cancel this booking');
    }

    if (booking.bookingStatus === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    // Release seats back to available in the corresponding show
    const show = this.shows.find((s) => s._id === booking.showId);
    if (show) {
      booking.selectedSeats.forEach((seatNum) => {
        const seat = show.seatInventory.find((s) => s.seatNumber === seatNum);
        if (seat && seat.status === 'booked') {
          seat.status = 'available';
        }
      });
      show.updatedAt = new Date().toISOString();
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    this.save();

    return {
      ...booking,
      show: this.getShowById(booking.showId),
      movie: this.getMovieById(booking.movieId),
      theatre: this.getTheatreById(booking.theatreId),
    };
  }

  // --- Admin Analytics Dashboard ---
  public getDashboardStats() {
    const confirmedBookings = this.bookings.filter((b) => b.bookingStatus === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + b.numberOfTickets, 0);

    // Calculate cinema seat occupancy percentage
    let totalSeatsAcrossShows = 0;
    let bookedSeatsAcrossShows = 0;
    this.shows.forEach((show) => {
      totalSeatsAcrossShows += show.seatInventory.length;
      bookedSeatsAcrossShows += show.seatInventory.filter((s) => s.status === 'booked').length;
    });

    const occupancyRate =
      totalSeatsAcrossShows > 0
        ? Math.round((bookedSeatsAcrossShows / totalSeatsAcrossShows) * 100)
        : 0;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalBookings: this.bookings.length,
      confirmedBookings: confirmedBookings.length,
      cancelledBookings: this.bookings.filter((b) => b.bookingStatus === 'cancelled').length,
      totalTicketsSold,
      activeMovies: this.movies.filter((m) => m.status === 'now-showing').length,
      upcomingMovies: this.movies.filter((m) => m.status === 'upcoming').length,
      totalTheatres: this.theatres.length,
      totalShows: this.shows.length,
      totalUsers: this.users.length,
      occupancyRate,
      recentBookings: this.getAllBookings().slice(0, 10),
    };
  }
}

export const dbStore = new DatabaseStore();

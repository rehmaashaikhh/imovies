import React, { useState, useEffect } from 'react';
import {
  DashboardStats,
  Movie,
  Theatre,
  Show,
  Booking,
} from '../types';
import { api } from '../services/api';
import {
  DollarSign,
  Ticket,
  Film,
  Calendar,
  Building,
  Users,
  Percent,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'shows' | 'bookings' | 'theatres' | 'seats'>('overview');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Movie Modal Form state
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 120,
    releaseDate: '2025-01-01',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    cast: 'Actor One, Actor Two',
    director: 'Director Name',
    rating: 8.5,
    certificate: 'PG-13',
    status: 'now-showing' as 'now-showing' | 'upcoming',
    trailerUrl: '',
  });

  // Show Modal Form state
  const [showShowModal, setShowShowModal] = useState(false);
  const [showForm, setShowForm] = useState({
    movieId: '',
    theatreId: '',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '07:00 PM',
    screenFormat: 'IMAX 3D',
    screenName: 'Screen 1',
    silverPrice: 12,
    goldPrice: 16,
    platinumPrice: 22,
  });

  // Seat Maintenance state
  const [selectedSeatShowId, setSelectedSeatShowId] = useState<string>('');
  const [seatsToBlock, setSeatsToBlock] = useState<string>('');

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, theatresRes, showsRes, bookingsRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getMovies(),
        api.getTheatres(),
        api.getShows(),
        api.getAllAdminBookings(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (moviesRes.success) setMovies(moviesRes.data);
      if (theatresRes.success) setTheatres(theatresRes.data);
      if (showsRes.success) {
        setShows(showsRes.data);
        if (showsRes.data.length > 0 && !selectedSeatShowId) {
          setSelectedSeatShowId(showsRes.data[0]._id);
        }
      }
      if (bookingsRes.success) setAllBookings(bookingsRes.data);
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to load dashboard data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- Movie Handlers ---
  const handleOpenAddMovie = () => {
    setEditingMovieId(null);
    setMovieForm({
      title: '',
      description: '',
      genre: 'Action, Sci-Fi',
      language: 'English',
      duration: 120,
      releaseDate: new Date().toISOString().split('T')[0],
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
      cast: 'Lead Actor, Supporting Actor',
      director: 'Director Name',
      rating: 8.5,
      certificate: 'PG-13',
      status: 'now-showing',
      trailerUrl: '',
    });
    setShowMovieModal(true);
  };

  const handleOpenEditMovie = (movie: Movie) => {
    setEditingMovieId(movie._id);
    setMovieForm({
      title: movie.title,
      description: movie.description,
      genre: movie.genre.join(', '),
      language: movie.language,
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      posterUrl: movie.posterUrl,
      bannerUrl: movie.bannerUrl,
      cast: movie.cast.join(', '),
      director: movie.director,
      rating: movie.rating,
      certificate: movie.certificate || 'PG-13',
      status: movie.status,
      trailerUrl: movie.trailerUrl || '',
    });
    setShowMovieModal(true);
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        title: movieForm.title,
        description: movieForm.description,
        genre: movieForm.genre.split(',').map((g) => g.trim()),
        language: movieForm.language,
        duration: Number(movieForm.duration),
        releaseDate: movieForm.releaseDate,
        posterUrl: movieForm.posterUrl,
        bannerUrl: movieForm.bannerUrl,
        cast: movieForm.cast.split(',').map((c) => c.trim()),
        director: movieForm.director,
        rating: Number(movieForm.rating),
        certificate: movieForm.certificate,
        status: movieForm.status,
        trailerUrl: movieForm.trailerUrl,
      };

      if (editingMovieId) {
        await api.updateMovie(editingMovieId, payload);
        setMessage({ text: 'Movie updated successfully', type: 'success' });
      } else {
        await api.createMovie(payload);
        setMessage({ text: 'Movie added successfully', type: 'success' });
      }
      setShowMovieModal(false);
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to save movie', type: 'error' });
    }
  };

  const handleDeleteMovie = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}" and all its scheduled shows?`)) return;
    try {
      await api.deleteMovie(id);
      setMessage({ text: `Movie "${title}" deleted`, type: 'success' });
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to delete movie', type: 'error' });
    }
  };

  // --- Show Handlers ---
  const handleOpenAddShow = () => {
    if (movies.length === 0 || theatres.length === 0) {
      setMessage({ text: 'Add at least one movie and one theatre first', type: 'error' });
      return;
    }
    setShowForm({
      movieId: movies[0]._id,
      theatreId: theatres[0]._id,
      showDate: new Date().toISOString().split('T')[0],
      startTime: '07:00 PM',
      screenFormat: 'IMAX 3D',
      screenName: 'Screen 1',
      silverPrice: 12,
      goldPrice: 16,
      platinumPrice: 22,
    });
    setShowShowModal(true);
  };

  const handleSaveShow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createShow({
        movieId: showForm.movieId,
        theatreId: showForm.theatreId,
        showDate: showForm.showDate,
        startTime: showForm.startTime,
        screenFormat: showForm.screenFormat,
        screenName: showForm.screenName,
        tierPrices: {
          Silver: Number(showForm.silverPrice),
          Gold: Number(showForm.goldPrice),
          Platinum: Number(showForm.platinumPrice),
        },
      });
      setMessage({ text: 'Showtime scheduled successfully', type: 'success' });
      setShowShowModal(false);
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to schedule show', type: 'error' });
    }
  };

  const handleDeleteShow = async (id: string) => {
    if (!window.confirm('Delete this showtime?')) return;
    try {
      await api.deleteShow(id);
      setMessage({ text: 'Showtime deleted', type: 'success' });
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to delete show', type: 'error' });
    }
  };

  // --- Seat Blocking Handlers ---
  const handleSeatAction = async (action: 'block' | 'unblock') => {
    if (!selectedSeatShowId || !seatsToBlock) {
      setMessage({ text: 'Please specify seat numbers (e.g. A1, A2)', type: 'error' });
      return;
    }

    const seatNumbers = seatsToBlock.split(',').map((s) => s.trim().toUpperCase());
    try {
      await api.blockSeats(selectedSeatShowId, seatNumbers, action);
      setMessage({
        text: `Seats ${seatNumbers.join(', ')} marked as ${action}ed`,
        type: 'success',
      });
      setSeatsToBlock('');
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Seat blocking failed', type: 'error' });
    }
  };

  // --- Reset Database Handler ---
  const handleResetDatabase = async () => {
    if (!window.confirm('Reset all movies, shows, and bookings back to clean default college seed?')) return;
    try {
      await api.resetDatabase();
      setMessage({ text: 'Database reset to default seed data successfully', type: 'success' });
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Reset failed', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-[#12151b] border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Cinema Management System
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Monitor real-time cinema revenue, curate movie screenings, schedule showtimes, and inspect seat inventories.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetDatabase}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Reset database to default seed state for college demos"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed</span>
          </button>
          <button
            onClick={loadAllData}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Refresh All"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 shadow-lg ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-600/60 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-600/60 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-zinc-400 hover:text-white underline text-[11px]"
          >
            Close
          </button>
        </div>
      )}

      {/* Analytics Summary Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#12151a] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Total Revenue
            </span>
            <p className="text-2xl font-black text-emerald-400">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-[11px] text-zinc-400">Across {stats.confirmedBookings} confirmed bookings</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12151a] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-rose-400" />
              Tickets Sold
            </span>
            <p className="text-2xl font-black text-white">{stats.totalTicketsSold}</p>
            <p className="text-[11px] text-zinc-400">Reserved seat admissions</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12151a] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              Auditorium Occupancy
            </span>
            <p className="text-2xl font-black text-amber-400">{stats.occupancyRate}%</p>
            <p className="text-[11px] text-zinc-400">Across all active schedules</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12151a] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Active Shows
            </span>
            <p className="text-2xl font-black text-white">{stats.totalShows}</p>
            <p className="text-[11px] text-zinc-400">{stats.activeMovies} currently showing</p>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Recent Bookings' },
          { id: 'movies', label: `Movies (${movies.length})` },
          { id: 'shows', label: `Shows (${shows.length})` },
          { id: 'theatres', label: `Theatres (${theatres.length})` },
          { id: 'seats', label: 'Seat Maintenance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview / Recent Bookings */}
      {activeTab === 'overview' && (
        <div className="bg-[#12151a] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white">All Cinema Reservations</h3>
            <span className="text-xs text-zinc-400">{allBookings.length} total records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Movie</th>
                  <th className="p-3">Theatre / Screen</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Customer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {allBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-400">{b.bookingReference}</td>
                    <td className="p-3 font-semibold text-white">{b.movie?.title}</td>
                    <td className="p-3 text-zinc-400">{b.theatre?.name} · {b.show?.screenFormat}</td>
                    <td className="p-3 font-mono text-rose-300">{b.selectedSeats.join(', ')}</td>
                    <td className="p-3 font-bold text-zinc-200">${b.totalAmount.toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-400">{b.customerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Movies Manager */}
      {activeTab === 'movies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Movies Catalog Management</h3>
            <button
              onClick={handleOpenAddMovie}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-950/50 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Movie</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((m) => (
              <div
                key={m._id}
                className="p-4 rounded-xl bg-[#12151a] border border-zinc-800 flex gap-4 items-start justify-between"
              >
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-16 h-24 object-cover rounded-lg border border-zinc-700 shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      m.status === 'now-showing'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {m.status}
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{m.title}</h4>
                  <p className="text-[11px] text-zinc-400">{m.genre.join(', ')} · {m.duration}m</p>
                  <p className="text-[11px] text-amber-400 font-semibold">★ {m.rating.toFixed(1)} / 10</p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleOpenEditMovie(m)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(m._id, m.title)}
                      className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 text-[11px] flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Shows & Schedules */}
      {activeTab === 'shows' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Showtimes & Screen Scheduling</h3>
            <button
              onClick={handleOpenAddShow}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-950/50 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Show</span>
            </button>
          </div>

          <div className="bg-[#12151a] border border-zinc-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Show ID</th>
                  <th className="p-3">Movie</th>
                  <th className="p-3">Theatre</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Prices (Sil/Gld/Plat)</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {shows.map((s) => (
                  <tr key={s._id} className="hover:bg-zinc-900/50">
                    <td className="p-3 font-mono text-zinc-500 text-[11px]">{s._id}</td>
                    <td className="p-3 font-bold text-white">{s.movie?.title}</td>
                    <td className="p-3 text-zinc-400">{s.theatre?.name}</td>
                    <td className="p-3 text-zinc-200">{s.showDate} at <span className="font-bold text-rose-400">{s.startTime}</span></td>
                    <td className="p-3 font-semibold text-amber-400">{s.screenFormat}</td>
                    <td className="p-3 text-zinc-300 font-mono">
                      ${s.tierPrices.Silver} / ${s.tierPrices.Gold} / ${s.tierPrices.Platinum}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteShow(s._id)}
                        className="p-1.5 rounded bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400"
                        title="Delete Show"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Theatres */}
      {activeTab === 'theatres' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Registered Theatres & Screen Specs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {theatres.map((t) => (
              <div key={t._id} className="p-5 rounded-2xl bg-[#12151a] border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-rose-500">
                  <Building className="w-4 h-4" />
                  <span className="font-bold text-white text-sm">{t.name}</span>
                </div>
                <p className="text-xs text-zinc-400">{t.address}, {t.city}</p>
                <div className="p-3 bg-zinc-900 rounded-xl text-xs space-y-1">
                  <p className="text-zinc-300 font-semibold">Total Capacity: {t.totalSeats} seats</p>
                  <p className="text-zinc-500 text-[11px]">Layout: 6 Rows × 10 Columns</p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-zinc-400">
                  {t.amenities.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Seat Maintenance & Blocking */}
      {activeTab === 'seats' && (
        <div className="p-6 rounded-2xl bg-[#12151a] border border-zinc-800 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Seat Maintenance & VIP Blocking Tool</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Block individual seats for damaged recliners, audio recalibration, or reserved cinema VIPs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Select Show Schedule:
              </label>
              <select
                value={selectedSeatShowId}
                onChange={(e) => setSelectedSeatShowId(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none"
              >
                {shows.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.movie?.title} - {s.theatre?.name} ({s.showDate} @ {s.startTime})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Seat Numbers to Block/Unblock (comma-separated):
              </label>
              <input
                type="text"
                value={seatsToBlock}
                onChange={(e) => setSeatsToBlock(e.target.value)}
                placeholder="e.g. A1, A2, E5"
                className="w-full p-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleSeatAction('block')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Block Specified Seats</span>
            </button>
            <button
              onClick={() => handleSeatAction('unblock')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unblock & Make Available</span>
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Movie Modal */}
      {showMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingMovieId ? 'Edit Movie Details' : 'Add New Movie to Cinema'}
              </h3>
              <button
                onClick={() => setShowMovieModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Genres (comma-separated)</label>
                  <input
                    type="text"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Language</label>
                  <input
                    type="text"
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Rating (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Status</label>
                  <select
                    value={movieForm.status}
                    onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value as any })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="now-showing">Now Showing</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Poster Image URL</label>
                <input
                  type="url"
                  required
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Backdrop Banner URL</label>
                <input
                  type="url"
                  value={movieForm.bannerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Trailer Video URL (YouTube)</label>
                <input
                  type="url"
                  value={movieForm.trailerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowMovieModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Show Modal */}
      {showShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Schedule New Showtime</h3>
              <button onClick={() => setShowShowModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShow} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Select Movie</label>
                <select
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Select Theatre</label>
                <select
                  value={showForm.theatreId}
                  onChange={(e) => setShowForm({ ...showForm, theatreId: e.target.value })}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                >
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Show Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={showForm.showDate}
                    onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={showForm.startTime}
                    onChange={(e) => setShowForm({ ...showForm, startTime: e.target.value })}
                    placeholder="e.g. 07:15 PM"
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Screen Format</label>
                  <input
                    type="text"
                    value={showForm.screenFormat}
                    onChange={(e) => setShowForm({ ...showForm, screenFormat: e.target.value })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Screen Name</label>
                  <input
                    type="text"
                    value={showForm.screenName}
                    onChange={(e) => setShowForm({ ...showForm, screenName: e.target.value })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Silver Price ($)</label>
                  <input
                    type="number"
                    value={showForm.silverPrice}
                    onChange={(e) => setShowForm({ ...showForm, silverPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Gold Price ($)</label>
                  <input
                    type="number"
                    value={showForm.goldPrice}
                    onChange={(e) => setShowForm({ ...showForm, goldPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Platinum Price ($)</label>
                  <input
                    type="number"
                    value={showForm.platinumPrice}
                    onChange={(e) => setShowForm({ ...showForm, platinumPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Schedule Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

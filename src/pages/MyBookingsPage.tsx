import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Printer,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Film,
  RefreshCw,
} from 'lucide-react';

interface MyBookingsPageProps {
  onViewTicket: (booking: Booking) => void;
  onExploreMovies: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  onViewTicket,
  onExploreMovies,
}) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (booking: Booking) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel booking ${booking.bookingReference}? Your reserved seats (${booking.selectedSeats.join(', ')}) will be immediately released back to other cinema patrons.`
    );
    if (!confirmCancel) return;

    try {
      setCancellingId(booking._id);
      setMessage(null);
      const res = await api.cancelBooking(booking._id);
      if (res.success) {
        setMessage({
          text: `Booking ${booking.bookingReference} has been successfully cancelled and your seats released.`,
          type: 'success',
        });
        fetchBookings();
      }
    } catch (err: any) {
      setMessage({
        text: err.message || 'Failed to cancel booking',
        type: 'error',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.bookingStatus === filter;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-[#12151b] border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            My Movie Bookings & E-Tickets
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review your upcoming showtimes, print verified entry passes, or manage cancellations.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-colors"
          title="Refresh Bookings"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Alert Banner */}
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'confirmed'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Confirmed ({bookings.filter((b) => b.bookingStatus === 'confirmed').length})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'cancelled'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Cancelled ({bookings.filter((b) => b.bookingStatus === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-44 bg-zinc-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isConfirmed = b.bookingStatus === 'confirmed';
            return (
              <div
                key={b._id}
                className="p-5 sm:p-6 rounded-2xl bg-[#12151a] border border-zinc-800/90 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left Poster & Details */}
                <div className="flex gap-4 sm:gap-5 items-center">
                  {b.movie?.posterUrl && (
                    <img
                      src={b.movie.posterUrl}
                      alt={b.movie.title}
                      className="w-16 h-24 object-cover rounded-xl border border-zinc-700 shadow-md shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {b.bookingReference}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isConfirmed
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {b.movie?.title || 'Feature Movie'}
                    </h3>

                    <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {b.theatre?.name} · {b.show?.screenFormat || 'Screen 1'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 pt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {b.show?.showDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-zinc-300 font-semibold">
                        <Clock className="w-3 h-3 text-rose-500" />
                        {b.show?.startTime}
                      </span>
                      <span>·</span>
                      <span className="text-white font-mono font-bold">
                        Seats: {b.selectedSeats.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Amount & Actions */}
                <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase text-zinc-500 block">Total Paid</span>
                    <span className="text-lg font-extrabold text-amber-400">
                      ${b.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isConfirmed && (
                      <button
                        onClick={() => handleCancelBooking(b)}
                        disabled={cancellingId === b._id}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-800/60 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        title="Cancel this booking and release seats"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}

                    <button
                      onClick={() => onViewTicket(b)}
                      className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-950/40 transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-8 space-y-4">
          <Film className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            You don't have any {filter !== 'all' ? filter : ''} bookings recorded yet. Browse currently showing movies and pick your favorite seats!
          </p>
          <button
            onClick={onExploreMovies}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-950/50 transition-all inline-flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>Browse Now Showing</span>
          </button>
        </div>
      )}
    </div>
  );
};

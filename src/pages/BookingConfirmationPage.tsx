import React from 'react';
import { Booking } from '../types';
import {
  CheckCircle2,
  Ticket,
  Printer,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface BookingConfirmationPageProps {
  booking: Booking;
  onViewTicket: (booking: Booking) => void;
  onGoToMyBookings: () => void;
  onExploreMovies: () => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({
  booking,
  onViewTicket,
  onGoToMyBookings,
  onExploreMovies,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 pb-16">
      {/* Success Hero Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/40 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Your seats are locked and reserved in the cinema system. We have issued your unique booking reference below.
        </p>
      </div>

      {/* Confirmation Ticket Card */}
      <div className="bg-[#12151a] border border-zinc-700/80 rounded-3xl overflow-hidden shadow-2xl">
        {/* Banner Top */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-rose-200">
              Booking Confirmation Reference
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-white mt-0.5">
              {booking.bookingReference}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewTicket(booking)}
              className="px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-rose-600" />
              <span>Print / View Pass</span>
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex gap-5 items-center">
            {booking.movie?.posterUrl && (
              <img
                src={booking.movie.posterUrl}
                alt={booking.movie.title}
                className="w-20 h-28 object-cover rounded-xl border border-zinc-700 shadow-lg shrink-0"
              />
            )}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/50 border border-rose-800/60 px-2 py-0.5 rounded">
                {booking.show?.screenFormat || 'IMAX'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {booking.movie?.title || 'Movie'}
              </h3>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                {booking.theatre?.name} · {booking.show?.screenName}
              </p>
            </div>
          </div>

          {/* Grid Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-xs">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-semibold block flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Show Date
              </span>
              <p className="font-bold text-white mt-1">{booking.show?.showDate}</p>
            </div>

            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-semibold block flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Showtime
              </span>
              <p className="font-bold text-white mt-1">{booking.show?.startTime}</p>
            </div>

            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-semibold block">
                Reserved Seats
              </span>
              <p className="font-bold text-rose-400 mt-1 font-mono">
                {booking.selectedSeats.join(', ')}
              </p>
            </div>

            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-semibold block">
                Total Paid
              </span>
              <p className="font-black text-amber-400 mt-1 text-sm">
                ${booking.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Payment & Admission note */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-zinc-500 block">Payment Method:</span>
              <span className="text-zinc-300 font-semibold">{booking.paymentMethod}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block">Customer:</span>
              <span className="text-zinc-300 font-semibold">{booking.customerName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onGoToMyBookings}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Ticket className="w-4 h-4 text-rose-400" />
          <span>Go to My Bookings</span>
        </button>

        <button
          onClick={onExploreMovies}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2"
        >
          <span>Explore More Movies</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

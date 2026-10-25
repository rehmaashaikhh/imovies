import React from 'react';
import { X, Printer, CheckCircle2, QrCode, Film, Calendar, Clock, MapPin, Armchair } from 'lucide-react';
import { Booking } from '../types';

interface TicketModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#14171c] border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            <span className="font-black tracking-wider text-sm uppercase">IMovies E-Ticket Pass</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Body */}
        <div id="printable-ticket" className="p-6 sm:p-8 space-y-6">
          {/* Status banner */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {booking.bookingStatus === 'confirmed' ? 'Confirmed & Validated' : booking.bookingStatus}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Reference</span>
              <span className="font-mono text-xs font-bold text-amber-400">{booking.bookingReference}</span>
            </div>
          </div>

          {/* Movie & Poster Row */}
          <div className="flex gap-4 items-center">
            {booking.movie?.posterUrl && (
              <img
                src={booking.movie.posterUrl}
                alt={booking.movie?.title}
                className="w-16 h-24 object-cover rounded-lg border border-zinc-700 shadow-md shrink-0"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {booking.movie?.title || 'Selected Feature Film'}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {booking.movie?.genre?.join(', ')} · {booking.show?.screenFormat || 'IMAX Laser'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mt-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{booking.theatre?.name || 'Grand Cinema Multiplex'}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-semibold block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-400" />
                Show Date
              </span>
              <p className="font-bold text-zinc-200 mt-0.5">
                {booking.show?.showDate || 'Scheduled Date'}
              </p>
            </div>

            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-semibold block flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" />
                Showtime
              </span>
              <p className="font-bold text-zinc-200 mt-0.5">
                {booking.show?.startTime || 'Evening Show'}
              </p>
            </div>

            <div className="col-span-2 pt-2 border-t border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-semibold block flex items-center gap-1">
                  <Armchair className="w-3 h-3 text-zinc-400" />
                  Assigned Seats ({booking.numberOfTickets})
                </span>
                <div className="flex gap-1.5 flex-wrap mt-1">
                  {booking.selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-2 py-0.5 rounded bg-rose-600/20 text-rose-300 border border-rose-500/30 font-mono font-bold text-xs"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Total Paid</span>
                <span className="text-base font-extrabold text-amber-400">${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Cinema QR and Verification */}
          <div className="border-t border-dashed border-zinc-800 pt-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-200">Admit {booking.numberOfTickets} Guest(s)</p>
              <p className="text-[11px] text-zinc-400 max-w-[220px]">
                Present this QR at theatre entrance kiosk or gate scanner for express entry.
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">
                Booking ID: {booking._id}
              </p>
            </div>

            {/* Visual Simulated QR Box */}
            <div className="p-2 bg-white rounded-xl shadow-lg flex flex-col items-center">
              <QrCode className="w-16 h-16 text-black" />
              <span className="text-[8px] font-mono font-bold text-black tracking-widest mt-1">
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-zinc-950 px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print E-Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};

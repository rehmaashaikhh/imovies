import React, { useState, useEffect } from 'react';
import { Show, SeatItem, Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SeatMap } from '../components/SeatMap';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Film,
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface BookingPageProps {
  show: Show;
  onBack: () => void;
  onBookingSuccess: (booking: Booking) => void;
  onNavigateToAuth: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  show,
  onBack,
  onBookingSuccess,
  onNavigateToAuth,
}) => {
  const { user, demoLogin } = useAuth();
  const [seatInventory, setSeatInventory] = useState<SeatItem[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'applepay'>('card');

  // Load fresh seat inventory from server
  const loadSeats = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await api.getShowSeats(show._id);
      if (res.success) {
        setSeatInventory(res.seatInventory);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch seat inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeats();
  }, [show._id]);

  const handleToggleSeat = (seatNumber: string) => {
    setErrorMessage(null);
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 8) {
        setErrorMessage('You can select a maximum of 8 seats per booking transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Calculate pricing based on selected seats and show tier prices
  const selectedSeatDetails = selectedSeats.map((seatCode) => {
    const item = seatInventory.find((s) => s.seatNumber === seatCode);
    const row = seatCode.charAt(0);
    let tier: 'Silver' | 'Gold' | 'Platinum' = 'Gold';
    if (row === 'A' || row === 'B') tier = 'Silver';
    else if (row === 'E' || row === 'F') tier = 'Platinum';

    const price = item?.price || show.tierPrices[tier] || 16;
    return {
      seatNumber: seatCode,
      tier,
      price,
    };
  });

  const subtotal = selectedSeatDetails.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? parseFloat((2.5 * selectedSeats.length).toFixed(2)) : 0;
  const tax = selectedSeats.length > 0 ? parseFloat((subtotal * 0.08).toFixed(2)) : 0;
  const grandTotal = parseFloat((subtotal + convenienceFee + tax).toFixed(2));

  const handleCompleteBooking = async () => {
    if (selectedSeats.length === 0) {
      setErrorMessage('Please select at least one seat before proceeding.');
      return;
    }

    if (!user) {
      setErrorMessage('Please sign in or use one-click demo login below to complete your booking.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const paymentMethodLabel =
        paymentMethod === 'card'
          ? 'Credit Card (Simulated Gateway)'
          : paymentMethod === 'upi'
          ? 'Instant UPI Transfer'
          : 'Apple Pay / Digital Wallet';

      const res = await api.createBooking({
        showId: show._id,
        selectedSeats,
        paymentMethod: paymentMethodLabel,
      });

      if (res.success && res.data) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
        onBookingSuccess(res.data);
      }
    } catch (err: any) {
      if (err.status === 409) {
        setErrorMessage(
          err.message || 'Selected seats were just booked by another patron. Refreshing availability...'
        );
        // Refresh seats to reflect reality
        loadSeats();
        setSelectedSeats([]);
      } else {
        setErrorMessage(err.message || 'Booking transaction failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Showtime or Movie</span>
        </button>

        {/* Live sync indicator */}
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Seat Inventory Synchronized</span>
        </div>
      </div>

      {/* Show Info Card */}
      <div className="p-5 sm:p-6 bg-[#13161b] border border-zinc-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          {show.movie?.posterUrl && (
            <img
              src={show.movie.posterUrl}
              alt={show.movie.title}
              className="w-14 h-20 object-cover rounded-xl border border-zinc-700 shadow-md shrink-0"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded">
                {show.screenFormat}
              </span>
              <span className="text-xs text-zinc-400">{show.screenName}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {show.movie?.title || 'Selected Movie'}
            </h2>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {show.theatre?.name || 'Grand Multiplex'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {show.showDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-white font-semibold">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                {show.startTime}
              </span>
            </div>
          </div>
        </div>

        {/* Current Selection Pill */}
        <div className="text-left md:text-right w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800">
          <span className="text-xs text-zinc-400 block">Current Selection:</span>
          <p className="text-sm font-bold text-white mt-0.5">
            {selectedSeats.length > 0 ? (
              <span className="text-rose-400">{selectedSeats.join(', ')}</span>
            ) : (
              <span className="text-zinc-500 italic">No seats selected yet</span>
            )}
          </p>
        </div>
      </div>

      {/* Conflict / Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-600/60 text-rose-300 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-zinc-400 hover:text-white text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Interactive Map + Checkout Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Seat Map Column */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="h-96 rounded-2xl bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-500">
              Loading seat layout...
            </div>
          ) : (
            <SeatMap
              seatInventory={seatInventory}
              selectedSeatCodes={selectedSeats}
              onToggleSeat={handleToggleSeat}
              tierPrices={show.tierPrices}
              maxSeats={8}
            />
          )}
        </div>

        {/* Order Summary & Payment Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#12151a] border border-zinc-800 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span>Booking Summary</span>
              <span className="text-xs text-zinc-400 font-normal">
                {selectedSeats.length} ticket(s)
              </span>
            </h3>

            {/* Selected Seats Breakdown */}
            {selectedSeats.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-400 block">Selected Seats:</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedSeatDetails.map((seat) => (
                    <div
                      key={seat.seatNumber}
                      className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-zinc-900 border border-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-400">{seat.seatNumber}</span>
                        <span className="text-zinc-400 text-[11px]">{seat.tier} Tier</span>
                      </div>
                      <span className="font-semibold text-white">${seat.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-zinc-500 text-xs">
                Select your preferred seats on the cinema layout to see fare calculation.
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-zinc-800 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Tickets Subtotal</span>
                <span className="text-zinc-200 font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience Fee ($2.50/seat)</span>
                <span className="text-zinc-200 font-semibold">${convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Cinema Surcharge (8%)</span>
                <span className="text-zinc-200 font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-zinc-800">
                <span>Grand Total</span>
                <span className="text-rose-400 text-base font-black">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Simulated Payment Selector */}
            <div className="pt-3 border-t border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-zinc-300 block">
                Select Payment Method (Simulation)
              </span>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-rose-600/20 border-rose-500 text-white shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-rose-400" />
                  <span className="text-[10px] font-bold block">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-rose-600/20 border-rose-500 text-white shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="text-[10px] font-bold block">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'applepay'
                      ? 'bg-rose-600/20 border-rose-500 text-white shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  <span className="text-[10px] font-bold block">Wallet</span>
                </button>
              </div>
            </div>

            {/* Auth Notice or Checkout Button */}
            <div className="pt-2">
              {!user ? (
                <div className="space-y-2 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-center">
                  <p className="text-xs text-zinc-300">
                    Sign in to book as yourself, or use one-click demo login:
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => demoLogin('user')}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                    >
                      Demo User
                    </button>
                    <button
                      type="button"
                      onClick={onNavigateToAuth}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={submitting || selectedSeats.length === 0}
                  onClick={handleCompleteBooking}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                    submitting || selectedSeats.length === 0
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
                      : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-950/60 hover:scale-[1.01]'
                  }`}
                >
                  {submitting ? (
                    <span>Reserving Seats & Verifying...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pay ${grandTotal.toFixed(2)} & Reserve ({selectedSeats.length})
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Double-booking guarantee notice */}
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Server-authoritative concurrency guarantee against double booking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

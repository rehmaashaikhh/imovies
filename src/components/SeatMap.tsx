import React from 'react';
import { SeatItem } from '../types';
import { Info, AlertCircle, Check } from 'lucide-react';

interface SeatMapProps {
  seatInventory: SeatItem[];
  selectedSeatCodes: string[];
  onToggleSeat: (seatNumber: string) => void;
  maxSeats?: number;
  tierPrices: { Silver: number; Gold: number; Platinum: number };
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seatInventory,
  selectedSeatCodes,
  onToggleSeat,
  maxSeats = 8,
  tierPrices,
}) => {
  // Group seats by row
  const rows = ['F', 'E', 'D', 'C', 'B', 'A']; // Platinum at top/back, Silver in front

  const getTierForSeat = (row: string) => {
    if (row === 'E' || row === 'F') return 'Platinum';
    if (row === 'C' || row === 'D') return 'Gold';
    return 'Silver';
  };

  return (
    <div className="bg-[#101317] border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl">
      {/* Cinema Screen Indicator */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-3/4 max-w-md h-3 bg-gradient-to-r from-transparent via-rose-500/80 to-transparent rounded-full shadow-[0_4px_30px_rgba(244,63,94,0.6)]" />
        <div className="w-5/6 max-w-lg h-8 bg-gradient-to-b from-rose-500/10 to-transparent clip-path-trapezoid flex items-center justify-center -mt-1">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-400">
            Cinema Screen / All Eyes This Way
          </span>
        </div>
      </div>

      {/* Seat Layout Grid */}
      <div className="space-y-4 overflow-x-auto pb-4">
        {rows.map((rowLetter) => {
          const tier = getTierForSeat(rowLetter);
          const price = tierPrices[tier as keyof typeof tierPrices] || 15;
          const rowSeats = seatInventory.filter((s) => s.row === rowLetter).sort((a, b) => a.col - b.col);

          return (
            <div key={rowLetter} className="flex items-center justify-center gap-3 min-w-[580px]">
              {/* Row Label Left */}
              <div className="w-6 text-xs font-bold text-zinc-400 text-center">
                {rowLetter}
              </div>

              {/* Seats container */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {rowSeats.map((seat, index) => {
                  const isSelected = selectedSeatCodes.includes(seat.seatNumber);
                  const isBooked = seat.status === 'booked';
                  const isBlocked = seat.status === 'blocked';
                  const isAvailable = seat.status === 'available';

                  // Add aisle space between seats 5 and 6
                  const hasAisleGap = index === 4;

                  return (
                    <React.Fragment key={seat.seatNumber}>
                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => onToggleSeat(seat.seatNumber)}
                        title={`${seat.seatNumber} (${seat.tier} - $${seat.price}) - ${seat.status}`}
                        className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 scale-105 ring-2 ring-rose-400'
                            : isBooked
                            ? 'bg-zinc-800/60 text-zinc-600 cursor-not-allowed border border-zinc-800'
                            : isBlocked
                            ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-dashed border-zinc-700'
                            : tier === 'Platinum'
                            ? 'bg-amber-950/40 text-amber-200 border border-amber-600/40 hover:bg-amber-600/30 hover:border-amber-400'
                            : tier === 'Gold'
                            ? 'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:border-rose-400'
                            : 'bg-zinc-850 text-zinc-300 border border-zinc-750 hover:bg-zinc-700'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          seat.col
                        )}
                      </button>

                      {hasAisleGap && <div className="w-6 sm:w-8" />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label Right with Tier Tag */}
              <div className="w-16 text-right">
                <span className="text-[10px] font-medium text-zinc-500">
                  {tier}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend & Price Guide */}
      <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Status Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-800 border border-zinc-600" />
            <span className="text-zinc-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-600 shadow-sm shadow-rose-600/40" />
            <span className="text-zinc-300">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-800/60 border border-zinc-800 text-zinc-600 flex items-center justify-center text-[9px] font-bold">
              ✕
            </div>
            <span className="text-zinc-500">Sold / Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-900 border border-dashed border-zinc-700" />
            <span className="text-zinc-500">Blocked</span>
          </div>
        </div>

        {/* Tier Pricing Legend */}
        <div className="flex items-center gap-3 text-zinc-400">
          <span className="text-amber-400 font-semibold">Platinum: ${tierPrices.Platinum}</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-300 font-semibold">Gold: ${tierPrices.Gold}</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-400 font-semibold">Silver: ${tierPrices.Silver}</span>
        </div>
      </div>

      {/* Limit Notice */}
      <div className="mt-4 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-zinc-500" />
          <span>Maximum {maxSeats} seats allowed per transaction.</span>
        </div>
        <span className="font-semibold text-zinc-300">
          {selectedSeatCodes.length} / {maxSeats} Selected
        </span>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Movie, Show, Theatre } from '../types';
import { api } from '../services/api';
import {
  Star,
  Clock,
  Calendar,
  Film,
  Play,
  ArrowLeft,
  MapPin,
  Ticket,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';

interface MovieDetailsPageProps {
  movie: Movie;
  onBack: () => void;
  onStartBooking: (show: Show) => void;
  onWatchTrailer: (trailerUrl: string, title: string) => void;
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({
  movie,
  onBack,
  onStartBooking,
  onWatchTrailer,
}) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Generate next 4 dates
  const availableDates = [0, 1, 2, 3].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayName, monthDay };
  });

  useEffect(() => {
    if (availableDates[0]) {
      setSelectedDate(availableDates[0].dateStr);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [showsRes, theatresRes] = await Promise.all([
          api.getShows({ movieId: movie._id, date: selectedDate }),
          api.getTheatres(),
        ]);

        if (showsRes.success) setShows(showsRes.data);
        if (theatresRes.success) setTheatres(theatresRes.data);
      } catch (err) {
        console.error('Failed to load shows:', err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedDate) {
      loadData();
    }
  }, [movie._id, selectedDate]);

  const isUpcoming = movie.status === 'upcoming';

  // Group shows by theatre
  const showsByTheatre: { [theatreId: string]: Show[] } = {};
  shows.forEach((show) => {
    if (!showsByTheatre[show.theatreId]) {
      showsByTheatre[show.theatreId] = [];
    }
    showsByTheatre[show.theatreId].push(show);
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Back navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Movies</span>
      </button>

      {/* Hero Movie Banner Card */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
        {/* Backdrop Banner */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={movie.bannerUrl}
            alt={movie.title}
            className="w-full h-full object-cover filter brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        {/* Floating Poster & Info Header */}
        <div className="relative p-6 sm:p-8 md:p-10 -mt-32 sm:-mt-40 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Poster */}
          <div className="w-36 sm:w-48 md:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-zinc-700/80 shadow-2xl bg-zinc-900 relative group">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            {movie.trailerUrl && (
              <button
                onClick={() => onWatchTrailer(movie.trailerUrl!, movie.title)}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                title="Watch Trailer"
              >
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </button>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-rose-600/20 border border-rose-500/30 text-rose-300 font-bold text-xs uppercase tracking-wider">
                {movie.certificate || 'PG-13'}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm bg-black/60 px-2.5 py-1 rounded-md border border-amber-500/30">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{movie.rating.toFixed(1)} / 10</span>
              </div>
              <span className="text-zinc-400 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                {movie.duration} minutes
              </span>
              <span className="text-zinc-400 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Released {movie.releaseDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {movie.title}
            </h1>

            {/* Genre tags */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-300 font-medium">
              <span className="text-zinc-500">Genres:</span>
              {movie.genre.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/80">
                  {g}
                </span>
              ))}
              <span className="text-zinc-500 ml-2">Language:</span>
              <span className="text-white font-semibold">{movie.language}</span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {movie.description}
            </p>

            {/* Cast & Director */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs border-t border-zinc-800/80">
              <div>
                <span className="text-zinc-500 uppercase tracking-wider font-semibold block mb-0.5">
                  Director
                </span>
                <p className="font-semibold text-white">{movie.director}</p>
              </div>
              <div>
                <span className="text-zinc-500 uppercase tracking-wider font-semibold block mb-0.5">
                  Main Cast
                </span>
                <p className="font-semibold text-white">{movie.cast.join(', ')}</p>
              </div>
            </div>

            {/* Quick Trailer Trigger */}
            {movie.trailerUrl && (
              <div className="pt-2">
                <button
                  onClick={() => onWatchTrailer(movie.trailerUrl!, movie.title)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4 fill-zinc-200" />
                  <span>Play Official Trailer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Showtimes & Theatres Booking Section */}
      {isUpcoming ? (
        <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
          <Info className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Advanced Bookings Opening Soon</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            This title is in pre-release schedule. Tickets will go live on sale 5 days prior to release date ({movie.releaseDate}).
          </p>
        </div>
      ) : (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-rose-500" />
                <span>Select Theatre & Showtime</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Choose your preferred date, auditorium, and time slot to select seats.
              </p>
            </div>

            {/* Date Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`px-3.5 py-2 rounded-xl text-center transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60 ring-1 ring-rose-400'
                        : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold block">{item.dayName}</span>
                    <span className="text-xs font-black block">{item.monthDay}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theatres List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-36 bg-zinc-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : Object.keys(showsByTheatre).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(showsByTheatre).map(([theatreId, theatreShows]) => {
                const theatre = theatreShows[0]?.theatre || theatres.find((t) => t._id === theatreId);
                return (
                  <div
                    key={theatreId}
                    className="p-5 sm:p-6 rounded-2xl bg-[#12151a] border border-zinc-800/90 shadow-md space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-500" />
                          <span>{theatre?.name || 'Multiplex Cinema'}</span>
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {theatre?.address}
                        </p>
                      </div>

                      {/* Amenities */}
                      {theatre?.amenities && (
                        <div className="flex items-center gap-2 flex-wrap text-[11px] text-zinc-400">
                          {theatre.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Showtimes Grid */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {theatreShows.map((show) => (
                        <button
                          key={show._id}
                          onClick={() => onStartBooking(show)}
                          className="group relative px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-rose-600/20 border border-zinc-700/80 hover:border-rose-500/60 transition-all text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white group-hover:text-rose-400">
                              {show.startTime}
                            </span>
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.2 rounded">
                              {show.screenFormat}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-1 flex items-center justify-between gap-3">
                            <span>From ${show.tierPrices.Silver}</span>
                            <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                              Select <ChevronRight className="w-3 h-3 ml-0.5" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-zinc-900/30 rounded-xl border border-zinc-800 text-zinc-400">
              <p className="text-sm">No shows scheduled for {selectedDate}. Try selecting another date above.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

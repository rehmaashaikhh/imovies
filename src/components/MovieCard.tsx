import React, { useState } from 'react';
import { Star, Clock, Play, Ticket, Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onBookTickets: (movie: Movie) => void;
  onWatchTrailer?: (trailerUrl: string, title: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onBookTickets,
  onWatchTrailer,
}) => {
  const [imageError, setImageError] = useState(false);

  const formatDuration = (mins: number) => {
    if (!mins || isNaN(mins)) return '120m';
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours === 0) return `${m}m`;
    return `${hours}h ${m}m`;
  };

  const isUpcoming = movie.status === 'upcoming';
  const ageRating = movie.ageRating || movie.certificate || 'UA';

  // Specific color accents for Indian / International censor board ratings
  const getBadgeStyle = (rating: string) => {
    const r = rating.trim().toUpperCase();
    if (r === 'A' || r === '18+' || r === 'R') {
      return 'bg-red-950/80 text-rose-300 border-rose-500/50';
    }
    if (r === 'U' || r === 'G') {
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
    }
    // Default UA / PG-13
    return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
  };

  const fallbackPoster = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="group relative bg-[#12151b] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 flex flex-col">
      {/* Poster Container */}
      <div
        className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950 cursor-pointer select-none"
        onClick={() => onSelectMovie(movie)}
      >
        <img
          src={imageError ? fallbackPoster : (movie.posterUrl || fallbackPoster)}
          alt={movie.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Ambient Gradient Shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12151b] via-transparent to-black/30 opacity-90 pointer-events-none" />

        {/* Certificate / Age Rating Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-md backdrop-blur-md border text-[10px] font-black tracking-wider uppercase shadow-md ${getBadgeStyle(
              ageRating
            )}`}
          >
            {ageRating}
          </span>
          {movie.language && (
            <span className="bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-zinc-300 px-1.5 py-0.5 rounded-md">
              {movie.language}
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 z-10 bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-xs px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{(movie.rating || 8.0).toFixed(1)}</span>
        </div>

        {/* Watch Trailer Overlay Button */}
        {movie.trailerUrl && onWatchTrailer && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onWatchTrailer(movie.trailerUrl!, movie.title);
              }}
              className="w-13 h-13 rounded-full bg-rose-600/90 text-white flex items-center justify-center hover:scale-110 hover:bg-rose-500 transition-all duration-200 shadow-xl shadow-rose-950/70 border border-white/20 group/btn"
              title={`Watch ${movie.title} Trailer`}
            >
              <Play className="w-5 h-5 fill-white ml-0.5 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata line: Duration, Language & Status */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
            <span className="flex items-center gap-1 text-zinc-300 font-medium">
              <Clock className="w-3 h-3 text-rose-500" />
              {formatDuration(movie.duration)}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="line-clamp-1 text-zinc-400">{movie.director}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectMovie(movie)}
            className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1 cursor-pointer"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Genre list */}
          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
            {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
          {isUpcoming ? (
            <button
              type="button"
              onClick={() => onSelectMovie(movie)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-colors text-center border border-zinc-700/60"
            >
              Synopsis & Trailer
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onSelectMovie(movie)}
                className="flex-1 py-2 px-2 text-xs font-medium rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors text-center"
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => onBookTickets(movie)}
                className="flex-1 py-2 px-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-950/40 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02]"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

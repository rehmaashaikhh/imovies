import React from 'react';
import { Star, Clock, Play, Ticket } from 'lucide-react';
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
  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  const isUpcoming = movie.status === 'upcoming';

  return (
    <div className="group relative bg-[#13161a] border border-zinc-800/80 rounded-xl overflow-hidden hover:border-zinc-700 hover:shadow-xl hover:shadow-black/50 transition-all duration-300 flex flex-col">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900 cursor-pointer" onClick={() => onSelectMovie(movie)}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13161a] via-transparent to-transparent opacity-90" />

        {/* Certificate Badge */}
        {movie.certificate && (
          <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-zinc-300 px-2 py-0.5 rounded">
            {movie.certificate}
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-xs px-2 py-1 rounded flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* Trailer Play Overlay Button */}
        {movie.trailerUrl && onWatchTrailer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchTrailer(movie.trailerUrl!, movie.title);
            }}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 shadow-lg shadow-rose-950/60"
            title="Watch Trailer"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        )}
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line: zero-pill style with clean typography */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              {formatDuration(movie.duration)}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{movie.language}</span>
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
            {movie.genre.join(', ')}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
          {isUpcoming ? (
            <button
              onClick={() => onSelectMovie(movie)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors text-center"
            >
              View Synopsis & Cast
            </button>
          ) : (
            <>
              <button
                onClick={() => onSelectMovie(movie)}
                className="flex-1 py-2 px-2 text-xs font-medium rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors text-center"
              >
                Details
              </button>
              <button
                onClick={() => onBookTickets(movie)}
                className="flex-1 py-2 px-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-950/40 transition-all flex items-center justify-center gap-1.5"
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

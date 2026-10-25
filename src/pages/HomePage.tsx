import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { api } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { Play, Ticket, Star, Sparkles, Film, ArrowRight, ShieldCheck, Flame, Compass } from 'lucide-react';

interface HomePageProps {
  onSelectMovie: (movie: Movie) => void;
  onBookTickets: (movie: Movie) => void;
  onWatchTrailer: (trailerUrl: string, title: string) => void;
  onExploreMovies: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectMovie,
  onBookTickets,
  onWatchTrailer,
  onExploreMovies,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getMovies();
        if (res.success) {
          setMovies(res.data);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featuredMovie = movies.find((m) => m._id === 'mov_dune2') || movies[0];
  const nowShowing = movies.filter((m) => m.status === 'now-showing');
  const upcoming = movies.filter((m) => m.status === 'upcoming');

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation'];

  const filteredNowShowing = selectedGenre === 'All'
    ? nowShowing
    : nowShowing.filter((m) => m.genre.includes(selectedGenre));

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Showcase Section */}
      {featuredMovie && (
        <section className="relative min-h-[520px] md:h-[620px] w-full rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-end">
          {/* Background Backdrop Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={featuredMovie.bannerUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-center filter brightness-[0.65]"
            />
            {/* Multi-layered Cinema Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d10] via-[#0b0d10]/40 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600/90 text-white font-bold tracking-wider uppercase text-[10px]">
                <Flame className="w-3 h-3 fill-white" />
                Featured Premiere
              </span>
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {featuredMovie.rating.toFixed(1)} Rating
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-300">{featuredMovie.certificate || 'PG-13'}</span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-300">{featuredMovie.duration} mins</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
              {featuredMovie.title}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed max-w-2xl">
              {featuredMovie.description}
            </p>

            <div className="text-xs text-zinc-400 flex items-center gap-2 pt-1">
              <span className="font-semibold text-zinc-300">Starring:</span>
              <span>{featuredMovie.cast.slice(0, 3).join(', ')}</span>
            </div>

            {/* Hero CTA buttons */}
            <div className="pt-3 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onBookTickets(featuredMovie)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets Now</span>
              </button>

              {featuredMovie.trailerUrl && (
                <button
                  onClick={() => onWatchTrailer(featuredMovie.trailerUrl!, featuredMovie.title)}
                  className="px-5 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-md"
                >
                  <Play className="w-4 h-4 fill-zinc-200" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <button
                onClick={() => onSelectMovie(featuredMovie)}
                className="px-4 py-3 rounded-xl text-zinc-300 hover:text-white font-medium text-xs transition-colors"
              >
                More Details
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Now Showing Section with Filter Tabs */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Film className="w-4 h-4" />
              <span>In Theatres Today</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Now Showing
            </h2>
          </div>

          {/* Genre Filter Segmented Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto max-w-full">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedGenre === g
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[2/3] bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredNowShowing.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredNowShowing.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onSelectMovie={onSelectMovie}
                onBookTickets={onBookTickets}
                onWatchTrailer={onWatchTrailer}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-900/40 rounded-xl border border-zinc-800/60 p-6 text-zinc-400">
            <p className="text-sm">No movies match the genre "{selectedGenre}".</p>
            <button
              onClick={() => setSelectedGenre('All')}
              className="mt-3 text-xs text-rose-400 hover:underline font-semibold"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>

      {/* Cinema Experience Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            IMAX
          </div>
          <h3 className="text-base font-bold text-white">IMAX Laser Projection</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Experience next-generation dual 4K laser projection with unmatched sharpness, expanded aspect ratios, and vivid colors.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            ATMOS
          </div>
          <h3 className="text-base font-bold text-white">Dolby Atmos Spatial Audio</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            64-channel surround audio moving all around you with breathtaking precision and bass you can feel.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            FAST
          </div>
          <h3 className="text-base font-bold text-white">Contactless E-Tickets</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Reserve exact seats in real-time. Scan your high-res digital pass directly at the auditorium entrance.
          </p>
        </div>
      </section>

      {/* Upcoming Movies Section */}
      {upcoming.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" />
                <span>Future Attractions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Upcoming Releases
              </h2>
            </div>
            <button
              onClick={onExploreMovies}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 group"
            >
              <span>View All Movies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {upcoming.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onSelectMovie={onSelectMovie}
                onBookTickets={onBookTickets}
                onWatchTrailer={onWatchTrailer}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

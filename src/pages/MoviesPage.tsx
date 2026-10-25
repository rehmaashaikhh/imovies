import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { api } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { Search, SlidersHorizontal, Film, ArrowUpDown, X } from 'lucide-react';

interface MoviesPageProps {
  onSelectMovie: (movie: Movie) => void;
  onBookTickets: (movie: Movie) => void;
  onWatchTrailer: (trailerUrl: string, title: string) => void;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({
  onSelectMovie,
  onBookTickets,
  onWatchTrailer,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'releaseDate' | 'title'>('rating');

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const res = await api.getMovies({
          search: search || undefined,
          genre: selectedGenre !== 'All' ? selectedGenre : undefined,
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
        });
        if (res.success) {
          setMovies(res.data);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchMovies();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedGenre, selectedStatus]);

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Biography', 'Crime'];

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'releaseDate') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-[#14171d] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <Film className="w-4 h-4" />
          <span>Complete Cinema Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Browse All Movies
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Explore critically acclaimed blockbuster features, newly premiered releases, and upcoming cinematic events across all our multiplex screens.
        </p>

        {/* Search Input Bar */}
        <div className="relative max-w-xl pt-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pt-1" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, director, or cast member..."
            className="w-full pl-10 pr-10 py-3 bg-zinc-950/80 border border-zinc-700/80 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
        {/* Genre Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1 shrink-0">
            Genre:
          </span>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGenre === g
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Status & Sort Dropdowns */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-zinc-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-zinc-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All</option>
              <option value="now-showing" className="bg-zinc-900">Now Showing</option>
              <option value="upcoming" className="bg-zinc-900">Upcoming</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-zinc-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="rating" className="bg-zinc-900">Highest Rated</option>
              <option value="releaseDate" className="bg-zinc-900">Release Date</option>
              <option value="title" className="bg-zinc-900">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <p>Showing <span className="font-bold text-white">{sortedMovies.length}</span> movie titles</p>
        {(search || selectedGenre !== 'All' || selectedStatus !== 'All') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedGenre('All');
              setSelectedStatus('All');
            }}
            className="text-rose-400 hover:underline font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-[2/3] bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : sortedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {sortedMovies.map((movie) => (
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
        <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-8 space-y-3">
          <Film className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-300">No Movies Found</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            We couldn't find any movies matching your current search and filter combination. Try adjusting your query or resetting filters.
          </p>
        </div>
      )}
    </div>
  );
};

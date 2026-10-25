import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { TicketModal } from './components/TicketModal';
import { TrailerModal } from './components/TrailerModal';
import { VivaDossierModal } from './components/VivaDossierModal';
import { Movie, Show, Booking } from './types';

function MainAppContent() {
  const { user, isAdmin } = useAuth();

  // Navigation states
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Modals
  const [ticketToView, setTicketToView] = useState<Booking | null>(null);
  const [trailerData, setTrailerData] = useState<{ url: string; title: string } | null>(null);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);

  // Flow handlers
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentTab('movie-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookTickets = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentTab('movie-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBookingShow = (show: Show) => {
    setSelectedShow(show);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (booking: Booking) => {
    setConfirmedBooking(booking);
    setCurrentTab('booking-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchTrailer = (trailerUrl: string, title: string) => {
    setTrailerData({ url: trailerUrl, title });
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-zinc-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenViva={() => setIsVivaModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && (
          <HomePage
            onSelectMovie={handleSelectMovie}
            onBookTickets={handleBookTickets}
            onWatchTrailer={handleWatchTrailer}
            onExploreMovies={() => {
              setCurrentTab('movies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'movies' && (
          <MoviesPage
            onSelectMovie={handleSelectMovie}
            onBookTickets={handleBookTickets}
            onWatchTrailer={handleWatchTrailer}
          />
        )}

        {currentTab === 'movie-details' && selectedMovie && (
          <MovieDetailsPage
            movie={selectedMovie}
            onBack={() => {
              setCurrentTab('movies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartBooking={handleStartBookingShow}
            onWatchTrailer={handleWatchTrailer}
          />
        )}

        {currentTab === 'booking' && selectedShow && (
          <BookingPage
            show={selectedShow}
            onBack={() => {
              setCurrentTab('movie-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookingSuccess={handleBookingSuccess}
            onNavigateToAuth={() => setCurrentTab('login')}
          />
        )}

        {currentTab === 'booking-confirmation' && confirmedBooking && (
          <BookingConfirmationPage
            booking={confirmedBooking}
            onViewTicket={(b) => setTicketToView(b)}
            onGoToMyBookings={() => {
              setCurrentTab('my-bookings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreMovies={() => {
              setCurrentTab('movies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'my-bookings' && (
          <MyBookingsPage
            onViewTicket={(b) => setTicketToView(b)}
            onExploreMovies={() => {
              setCurrentTab('movies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onSuccess={() => {
              setCurrentTab(selectedShow ? 'booking' : 'home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToRegister={() => setCurrentTab('register')}
          />
        )}

        {currentTab === 'register' && (
          <RegisterPage
            onSuccess={() => {
              setCurrentTab(selectedShow ? 'booking' : 'home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToLogin={() => setCurrentTab('login')}
          />
        )}

        {currentTab === 'admin' && (
          isAdmin ? (
            <AdminDashboardPage />
          ) : (
            <div className="py-20 text-center space-y-4">
              <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
              <p className="text-xs text-zinc-400">Please sign in with administrator credentials.</p>
              <button
                onClick={() => setCurrentTab('login')}
                className="px-4 py-2 bg-rose-600 rounded-lg text-xs font-semibold"
              >
                Go to Sign In
              </button>
            </div>
          )
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenViva={() => setIsVivaModalOpen(true)}
      />

      {/* Modals */}
      <TicketModal
        booking={ticketToView}
        onClose={() => setTicketToView(null)}
      />

      <TrailerModal
        isOpen={!!trailerData}
        onClose={() => setTrailerData(null)}
        trailerUrl={trailerData?.url || ''}
        movieTitle={trailerData?.title || ''}
      />

      <VivaDossierModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

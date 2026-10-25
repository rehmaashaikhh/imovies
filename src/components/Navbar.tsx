import React, { useState } from 'react';
import { Film, User as UserIcon, LogOut, ShieldAlert, Ticket, BookOpen, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenViva: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenViva }) => {
  const { user, isAdmin, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    ...(user ? [{ id: 'my-bookings', label: 'My Bookings' }] : []),
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Dashboard' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d0f12]/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-600 to-red-600 flex items-center justify-center shadow-lg shadow-rose-950/40 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider text-white">
                  I<span className="text-rose-500">MOVIES</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold bg-amber-950/50 border border-amber-800/60 px-1.5 py-0.5 rounded">
                  Cinema
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 -mt-0.5">Ticket Booking Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* College Dossier Button */}
            <button
              onClick={onOpenViva}
              className="ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
              title="View College Viva, Architecture, ER & DFD Diagrams"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Viva & System Docs</span>
            </button>
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg pr-3">
                  <div className="w-7 h-7 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-300 flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-zinc-200 leading-tight max-w-[120px] truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-400 capitalize">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentTab('register')}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/50 transition-all"
                >
                  Register
                </button>
                <button
                  onClick={() => demoLogin('admin')}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 transition-all flex items-center gap-1"
                  title="Fast switch to Demo Admin"
                >
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  <span>Admin Demo</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenViva}
              className="p-2 text-amber-400 hover:bg-zinc-800 rounded-lg"
              title="Viva Docs"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === link.id
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => {
              onOpenViva();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20"
          >
            Viva & College Architecture Docs
          </button>

          <div className="pt-3 border-t border-zinc-800">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-zinc-400">{user.email} ({user.role})</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-rose-400 text-xs font-medium"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentTab('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-semibold bg-zinc-800 text-zinc-200 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-semibold bg-rose-600 text-white rounded-lg"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { Film, ShieldCheck, Database, Server, Code2, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenViva: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenViva }) => {
  return (
    <footer className="bg-[#08090b] border-t border-zinc-800/80 text-zinc-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-wider text-white">
                I<span className="text-rose-500">MOVIES</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Online Movie Ticket Booking Platform with server-authoritative seat reservation, real-time availability checks, and cinema administrative controls.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Express API & MongoDB Architecture Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-rose-400 transition-colors">
                  Now Showing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('movies')} className="hover:text-rose-400 transition-colors">
                  All Movies Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my-bookings')} className="hover:text-rose-400 transition-colors">
                  My Bookings & Tickets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-rose-400 transition-colors">
                  Admin Control Center
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack for College */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3">System Architecture</h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>MongoDB & Mongoose Schemas</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>Express.js REST API with JWT</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-amber-400" />
                <span>React 19 + TypeScript + Tailwind</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Double-Booking Concurrency Guards</span>
              </div>
            </div>
          </div>

          {/* College Submission Helper */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <span>College Viva Ready</span>
            </h4>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              Includes full ER Diagram, DFD Levels 0 & 1, schema definitions, and sample viva answers.
            </p>
            <button
              onClick={onOpenViva}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
            >
              Open Project Documentation
            </button>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
          <p>© {new Date().getFullYear()} IMovies Cinema Network. Academic & Demonstration Platform.</p>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Crafted for B.Tech Final Project Defense</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { X, Film, ExternalLink } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  movieTitle: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailerUrl,
  movieTitle,
}) => {
  if (!isOpen) return null;

  // Robust YouTube ID extraction handling all formats:
  // - https://www.youtube.com/embed/XYZ
  // - https://www.youtube.com/watch?v=XYZ
  // - https://youtu.be/XYZ
  // - Raw video ID (e.g. Way9Dexny3w)
  const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    try {
      const trimmed = url.trim();

      // Check embed URL format
      if (trimmed.includes('youtube.com/embed/')) {
        const id = trimmed.split('youtube.com/embed/')[1]?.split('?')[0]?.split('&')[0];
        if (id) return id;
      }

      // Check standard watch format
      if (trimmed.includes('youtube.com/watch')) {
        const match = trimmed.match(/[?&]v=([^&]+)/);
        if (match && match[1]) return match[1];
      }

      // Check short youtu.be format
      if (trimmed.includes('youtu.be/')) {
        const id = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
        if (id) return id;
      }

      // If it's already an 11-char alphanumeric YouTube video ID
      if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
      }

      return '';
    } catch {
      return '';
    }
  };

  const videoId = extractYouTubeId(trailerUrl);
  // YouTube embed URL with autoplay and modestbranding
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : trailerUrl.startsWith('https://')
    ? trailerUrl
    : '';

  const watchUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : trailerUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500">
            <Film className="w-4 h-4 shrink-0" />
            <span className="text-sm font-bold text-white tracking-wide truncate max-w-md">
              Official Trailer: {movieTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {watchUrl && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                title="Open trailer in new tab"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${movieTitle} Official Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 p-6 text-center space-y-3">
              <Film className="w-12 h-12 text-zinc-700" />
              <p className="text-sm font-medium text-zinc-300">
                Trailer currently unavailable for embedding.
              </p>
              {watchUrl && (
                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Video Directly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

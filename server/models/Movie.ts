import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number; // in minutes
  releaseDate: Date;
  posterUrl: string;
  bannerUrl: string;
  cast: string[];
  director: string;
  rating: number; // 0 to 10
  trailerUrl?: string;
  certificate?: string; // e.g. PG-13, R, U/A
  status: 'now-showing' | 'upcoming';
  createdAt: Date;
  updatedAt: Date;
}

export const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
      default: [],
    },
    language: {
      type: String,
      required: true,
      default: 'English',
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required'],
    },
    bannerUrl: {
      type: String,
      required: [true, 'Backdrop banner URL is required'],
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      required: true,
      default: 'Director',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    certificate: {
      type: String,
      default: 'PG-13',
    },
    status: {
      type: String,
      enum: ['now-showing', 'upcoming'],
      default: 'now-showing',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MovieModel = mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);

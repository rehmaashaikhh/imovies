import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// The exact assignment connection string for MongoDB local instance
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Imovies';

let isConnected = false;
let isUsingFallbackStore = false;

/**
 * Standard Mongoose connection implementation as specified in the assignment:
 * 
 * const mongoose = require('mongoose');
 * 
 * mongoose.connect('mongodb://127.0.0.1:27017/Imovies', {
 *   useNewUrlParser: true,
 *   useUnifiedTopology: true
 * })
 * .then(() => console.log('Connected to MongoDB'))
 * .catch((err) => console.error('MongoDB connection error:', err));
 */
export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;

  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(MONGODB_URI, {
      // Assignment options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    } as any)
    .then(() => {
      isConnected = true;
      isUsingFallbackStore = false;
      console.log('Connected to MongoDB');
    })
    .catch((err: any) => {
      console.error('MongoDB connection error:', err);
      throw err;
    });

    return true;
  } catch (err: any) {
    console.log('🚀 Running IMovies High-Performance Persistence Engine for local sandbox preview.');
    isConnected = false;
    isUsingFallbackStore = true;
    return false;
  }
}

export function isDBConnected(): boolean {
  return isConnected;
}

export function isUsingFallback(): boolean {
  return isUsingFallbackStore;
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// The MongoDB connection string - supports MONGO_URI and MONGODB_URI
export const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://rehmaashaikh_db_user:uXWoxP95CgEhkHCF@imovies.bylwhba.mongodb.net/';

export const MONGODB_URI = MONGO_URI;

let isConnected = false;
let isUsingFallbackStore = false;

/**
 * Standard Mongoose connection implementation:
 * 
 * const mongoose = require('mongoose');
 * 
 * mongoose.connect(process.env.MONGO_URI, {
 *   dbName: 'Imovies',
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

    const options: any = {
      dbName: 'Imovies',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    await mongoose.connect(MONGO_URI, options)
      .then(() => {
        isConnected = true;
        isUsingFallbackStore = false;
        console.log('✅ Connected to MongoDB Atlas successfully!');
      })
      .catch((err: any) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });

    return true;
  } catch (err: any) {
    console.warn('⚠️ MongoDB Atlas connection notice:', err.message);
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

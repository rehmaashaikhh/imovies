import { connectDB, isDBConnected } from '../config/db.js';
import { dbStore } from '../services/dbStore.js';
import { UserModel } from '../models/User.js';
import { MovieModel } from '../models/Movie.js';
import { TheatreModel } from '../models/Theatre.js';
import { ShowModel } from '../models/Show.js';
import { BookingModel } from '../models/Booking.js';
import bcrypt from 'bcryptjs';

async function runSeed() {
  console.log('🌱 Starting IMovies Database Seeding Process...');

  const mongoConnected = await connectDB();

  if (mongoConnected && isDBConnected()) {
    console.log('⚡ Seeding directly into MongoDB instance...');
    try {
      await UserModel.deleteMany({});
      await MovieModel.deleteMany({});
      await TheatreModel.deleteMany({});
      await ShowModel.deleteMany({});
      await BookingModel.deleteMany({});

      const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
      const userPasswordHash = await bcrypt.hash('User@123', 10);

      await UserModel.create([
        {
          name: 'Cinema Administrator',
          email: 'admin@imovies.com',
          passwordHash: adminPasswordHash,
          role: 'admin',
          phone: '+1 (555) 019-2831',
        },
        {
          name: 'Rehma Shaikh',
          email: 'user@imovies.com',
          passwordHash: userPasswordHash,
          role: 'user',
          phone: '+1 (555) 014-9923',
        },
      ]);
      console.log('✅ Users seeded into MongoDB');
    } catch (err: any) {
      console.error('Error writing to MongoDB:', err.message);
    }
  }

  // Also seed the unified data store
  dbStore.seedDefaultData(true);
  console.log('🎉 Seeding completed successfully! Ready for college demo.');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Seed script encountered error:', err);
  process.exit(1);
});

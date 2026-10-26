import { connectDB, isDBConnected } from '../config/db.js';
import { dbStore } from '../services/dbStore.js';
import { UserModel } from '../models/User.js';
import { MovieModel } from '../models/Movie.js';
import { TheatreModel } from '../models/Theatre.js';
import { ShowModel } from '../models/Show.js';
import { BookingModel } from '../models/Booking.js';
import { INITIAL_MOVIES, INITIAL_THEATRES, generateSeatInventory } from './sampleData.js';
import bcrypt from 'bcryptjs';

async function runSeed() {
  console.log('🌱 Starting IMovies Database Seeding Process...');

  const mongoConnected = await connectDB();

  if (mongoConnected && isDBConnected()) {
    console.log('⚡ Seeding directly into MongoDB Atlas Cluster...');
    try {
      await UserModel.deleteMany({});
      await MovieModel.deleteMany({});
      await TheatreModel.deleteMany({});
      await ShowModel.deleteMany({});
      await BookingModel.deleteMany({});

      const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
      const userPasswordHash = await bcrypt.hash('User@123', 10);

      const createdUsers = await UserModel.create([
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
      console.log('✅ Users seeded into MongoDB Atlas');

      // Seed movies (omitting custom string _id to let MongoDB generate ObjectIds, or preserving them)
      const movieDocs = await MovieModel.insertMany(
        INITIAL_MOVIES.map((m) => {
          const { _id, ...rest } = m;
          return rest;
        })
      );
      console.log(`✅ ${movieDocs.length} Movies seeded into MongoDB Atlas`);

      // Seed theatres
      const theatreDocs = await TheatreModel.insertMany(
        INITIAL_THEATRES.map((t) => {
          const { _id, ...rest } = t;
          return rest;
        })
      );
      console.log(`✅ ${theatreDocs.length} Theatres seeded into MongoDB Atlas`);

      // Generate dynamic shows
      const dates = [0, 1, 2, 3].map((offset) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return d.toISOString().split('T')[0];
      });

      const showsToInsert: any[] = [];
      for (const movie of movieDocs.filter((m: any) => m.status === 'now-showing')) {
        for (const theatre of theatreDocs) {
          for (const showDate of dates) {
            const times = [
              { time: '11:00 AM', format: 'IMAX 3D', screen: 'Screen 1', booked: ['C4', 'C5'] },
              { time: '02:45 PM', format: 'Dolby Atmos', screen: 'Screen 2', booked: ['D3', 'D4', 'D5'] },
              { time: '06:30 PM', format: 'IMAX with Laser', screen: 'Screen 1', booked: ['C5', 'C6', 'E4', 'E5'] },
              { time: '09:45 PM', format: 'Luxury Recliner', screen: 'Screen 3 VIP', booked: ['E2', 'E3'] },
            ];

            for (const item of times) {
              const tierPrices = {
                Silver: theatre.seatLayout.tiers.find((t: any) => t.name === 'Silver')?.price || 12,
                Gold: theatre.seatLayout.tiers.find((t: any) => t.name === 'Gold')?.price || 16,
                Platinum: theatre.seatLayout.tiers.find((t: any) => t.name === 'Platinum')?.price || 22,
              };

              const inventory = generateSeatInventory(theatre.seatLayout, item.booked, ['A1', 'F10']);

              showsToInsert.push({
                movieId: movie._id,
                theatreId: theatre._id,
                showDate,
                startTime: item.time,
                screenFormat: item.format,
                screenName: item.screen,
                basePrice: tierPrices.Gold,
                tierPrices,
                seatInventory: inventory,
                status: 'active',
              });
            }
          }
        }
      }

      const createdShows = await ShowModel.insertMany(showsToInsert);
      console.log(`✅ ${createdShows.length} Shows seeded into MongoDB Atlas`);

      // Seed sample booking
      if (createdShows.length > 0 && createdUsers.length > 1) {
        const sampleShow = createdShows[0];
        const sampleUser = createdUsers[1];
        await BookingModel.create({
          bookingReference: 'IMV-2026-8942',
          userId: sampleUser._id,
          showId: sampleShow._id,
          movieId: sampleShow.movieId,
          theatreId: sampleShow.theatreId,
          selectedSeats: ['C4', 'C5'],
          seatsDetail: [
            { seatNumber: 'C4', tier: 'Gold', price: 16 },
            { seatNumber: 'C5', tier: 'Gold', price: 16 },
          ],
          numberOfTickets: 2,
          subtotal: 32,
          convenienceFee: 2.5,
          tax: 1.6,
          totalAmount: 36.1,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card (Visa ending in 4242)',
          bookedAt: new Date(Date.now() - 3600000 * 4),
          qrCodeData: 'IMOVIES-TICKET-IMV-2026-8942-USER-REHMA-2-TICKETS',
          customerName: sampleUser.name,
          customerEmail: sampleUser.email,
        });
        console.log('✅ Sample Booking seeded into MongoDB Atlas');
      }
    } catch (err: any) {
      console.error('Error writing to MongoDB Atlas:', err.message);
    }
  }

  // Also seed the in-memory/file store
  dbStore.seedDefaultData(true);
  console.log('🎉 Seeding completed successfully! Ready for college demo.');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Seed script encountered error:', err);
  process.exit(1);
});

/**
 * IMovies Database Seed Script
 * File: server/seed.js
 * 
 * Uses Mongoose to connect to MongoDB Atlas database 'Imovies'
 * and populate it with real blockbuster movies featuring verified
 * TMDb poster URLs, high-resolution backdrop URLs, official YouTube embed links,
 * real plot descriptions, age ratings (UA, A, U), and durations.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://rehmaashaikh_db_user:uXWoxP95CgEhkHCF@imovies.bylwhba.mongodb.net/';

// Define Movie Mongoose Schema
const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre: { type: [String], required: true },
    language: { type: String, default: 'English' },
    duration: { type: Number, required: true }, // duration in minutes
    releaseDate: { type: Date, required: true },
    posterUrl: { type: String, required: true },
    bannerUrl: { type: String, required: true },
    cast: { type: [String], default: [] },
    director: { type: String, required: true },
    rating: { type: Number, default: 8.0 },
    trailerUrl: { type: String, default: '' },
    certificate: { type: String, default: 'UA' },
    ageRating: { type: String, default: 'UA' },
    status: { type: String, enum: ['now-showing', 'upcoming'], default: 'now-showing' },
  },
  { timestamps: true }
);

const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

// Real Blockbuster Movies Dataset with verified TMDb assets & official YouTube embed URLs
const BLOCKBUSTER_MOVIES = [
  {
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    duration: 166, // 2h 46m
    releaseDate: new Date('2024-03-01'),
    posterUrl: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler', 'Florence Pugh'],
    director: 'Denis Villeneuve',
    rating: 8.8,
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    certificate: 'UA',
    ageRating: 'UA',
    status: 'now-showing',
  },
  {
    title: 'Interstellar',
    description:
      'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    language: 'English',
    duration: 169, // 2h 49m
    releaseDate: new Date('2014-11-07'),
    posterUrl: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine', 'Matt Damon'],
    director: 'Christopher Nolan',
    rating: 8.7,
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    certificate: 'UA',
    ageRating: 'UA',
    status: 'now-showing',
  },
  {
    title: 'Oppenheimer',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral and political turmoil that followed.',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180, // 3h 0m
    releaseDate: new Date('2023-07-21'),
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh', 'Josh Hartnett'],
    director: 'Christopher Nolan',
    rating: 8.9,
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    certificate: 'A',
    ageRating: 'A',
    status: 'now-showing',
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    genre: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    language: 'English',
    duration: 140, // 2h 20m
    releaseDate: new Date('2023-06-02'),
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya', 'Jake Johnson'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    rating: 8.7,
    trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
    certificate: 'U',
    ageRating: 'U',
    status: 'now-showing',
  },
  {
    title: 'The Dark Knight',
    description:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the city streets.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152, // 2h 32m
    releaseDate: new Date('2008-07-18'),
    posterUrl: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Morgan Freeman', 'Gary Oldman'],
    director: 'Christopher Nolan',
    rating: 9.0,
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    certificate: 'UA',
    ageRating: 'UA',
    status: 'now-showing',
  },
  {
    title: 'Avatar: The Way of Water',
    description:
      'Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, and the battles they fight to stay alive.',
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    language: 'English',
    duration: 192, // 3h 12m
    releaseDate: new Date('2022-12-16'),
    posterUrl: 'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang', 'Kate Winslet'],
    director: 'James Cameron',
    rating: 7.8,
    trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
    certificate: 'UA',
    ageRating: 'UA',
    status: 'now-showing',
  },
  {
    title: 'Gladiator II',
    description:
      'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    genre: ['Action', 'Drama', 'Adventure'],
    language: 'English',
    duration: 148, // 2h 28m
    releaseDate: new Date('2024-11-22'),
    posterUrl: 'https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen', 'Joseph Quinn'],
    director: 'Ridley Scott',
    rating: 8.2,
    trailerUrl: 'https://www.youtube.com/embed/4rgYUipGJNo',
    certificate: 'A',
    ageRating: 'A',
    status: 'upcoming',
  },
];

async function seedDatabase() {
  console.log('🎬 Connecting to MongoDB Atlas database Imovies...');
  console.log(`📡 URI: ${MONGO_URI.replace(/:([^:@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'Imovies',
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Successfully connected to MongoDB Atlas!');

    // Clear existing movies and populate with fresh blockbuster titles
    console.log('🗑️  Clearing previous movies from collection...');
    await Movie.deleteMany({});

    console.log('📥 Inserting blockbuster movies with official YouTube embed URLs...');
    const insertedMovies = await Movie.insertMany(BLOCKBUSTER_MOVIES);

    console.log(`\n🎉 Successfully populated ${insertedMovies.length} blockbuster movies into MongoDB Atlas!`);
    console.log('------------------------------------------------------------');
    insertedMovies.forEach((m, idx) => {
      console.log(
        `${idx + 1}. ${m.title} | Rating: ${m.ageRating} | Duration: ${m.duration}m | Certificate: ${m.certificate}`
      );
      console.log(`   Poster:   ${m.posterUrl}`);
      console.log(`   Backdrop: ${m.bannerUrl}`);
      console.log(`   Embed:    ${m.trailerUrl}\n`);
    });
    console.log('------------------------------------------------------------');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MongoDB Atlas database:', error);
    process.exit(1);
  }
}

seedDatabase();

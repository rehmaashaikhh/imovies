/**
 * IMovies - MongoDB Database Connection Script
 * Project: Online Movie Ticket Booking Web Application
 * Student: Rehma Fatema Shaikh
 * 
 * Line-by-Line Breakdown:
 * -------------------------------------------------------------
 * 1. const mongoose = require('mongoose');
 *    Purpose: Loads the Mongoose library so you can use it in your application.
 *    Mongoose is a powerful Object Data Modeling (ODM) tool that helps interact
 *    with MongoDB using JavaScript objects.
 * 
 * 2. mongoose.connect(MONGO_URI, { ... })
 *    mongodb+srv://: Specifies the MongoDB SRV connection protocol for MongoDB Atlas clusters.
 *    rehmaashaikh_db_user: Authenticated database user.
 *    imovies.bylwhba.mongodb.net: Dedicated MongoDB Atlas cluster address.
 *    dbName: 'Imovies': Name of the database to store movies, theatres, shows, and bookings.
 * 
 * 3. .then(() => console.log('Connected to MongoDB'))
 *    If the connection is successful, this code runs.
 *    It prints a confirmation message to your console: "Connected to MongoDB"
 * 
 * 4. .catch((err) => console.error('MongoDB connection error:', err));
 *    If the connection fails, the error is caught here.
 *    Helps with debugging by printing the error details.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://rehmaashaikh_db_user:uXWoxP95CgEhkHCF@imovies.bylwhba.mongodb.net/';

mongoose.connect(MONGO_URI, {
  dbName: 'Imovies',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

module.exports = mongoose;

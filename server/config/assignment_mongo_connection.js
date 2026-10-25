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
 * 2. mongoose.connect('mongodb://127.0.0.1:27017/Imovies', { ... })
 *    mongodb://: Specifies the MongoDB protocol.
 *    127.0.0.1: Localhost IP address – means the database is running on your local machine.
 *    27017: Default port for MongoDB.
 *    Imovies: Name of the database you want to use.
 *    (If this database doesn't exist, MongoDB will create it once data is inserted.)
 *    useNewUrlParser: true: Uses MongoDB's updated URL string parser.
 *    useUnifiedTopology: true: Enables the new connection engine, which improves connection stability and performance.
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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Imovies';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

module.exports = mongoose;

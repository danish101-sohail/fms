const mongoose = require('mongoose');

// MongoDB connection string
const dbURI = 'mongodb://localhost:27017/new_new_clone';

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// Handle connection errors
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

// Handle successful connection
db.once('open', () => {
  console.log('Successfully connected to MongoDB');
});

module.exports = db;
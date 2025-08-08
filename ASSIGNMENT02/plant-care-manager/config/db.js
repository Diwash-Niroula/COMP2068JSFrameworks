// config/db.js
// Handles connection to MongoDB using Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // stop the app if DB fails
  }
};

module.exports = connectDB;

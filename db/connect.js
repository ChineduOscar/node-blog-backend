const mongoose = require('mongoose');

// Connect DB
const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;

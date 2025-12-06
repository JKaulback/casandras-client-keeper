const mongoose = require('mongoose');

async function connectDB(uri) {
  mongoose.set('strictQuery', true); // optional; avoids deprecation warnings
  return mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 5000,
  });
}

module.exports = connectDB;

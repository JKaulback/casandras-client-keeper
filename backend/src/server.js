const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connectDB');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:19006' }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Casandra\'s Client Keeper API' });
});

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();


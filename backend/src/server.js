const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connectDB');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// CORS configuration - allows localhost and deployed frontend
const allowedOrigins = [
  'http://localhost:19006',
  'http://localhost:8081',
  process.env.FRONTEND_URL // Add your deployed frontend URL as environment variable
].filter(Boolean);

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Routes
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');

app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);

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


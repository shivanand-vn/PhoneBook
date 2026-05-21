const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const searchRoutes = require('./routes/searchRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading images from server locally or from Cloudinary without issues
}));

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Request Logger in dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if necessary
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);

// Catch 404
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;

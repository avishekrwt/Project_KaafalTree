require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting - general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
const publicRoutes = require('./routes/publicRoutes');
const { bookingRouter, contactRouter } = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api', publicRoutes);
app.use('/api/bookings', bookingRouter);
app.use('/api/contact', contactRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.error('Error 💥:', err);
    res.status(statusCode).json({
      status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production
    if (err.isOperational) {
      res.status(statusCode).json({
        status,
        message: err.message,
      });
    } else {
      console.error('ERROR 💥:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    console.log('Starting server initialization...');
    
    // 1. Validate environment variables
    const requiredEnvs = ['DB_NAME', 'DB_USER', 'JWT_SECRET'];
    const missingEnvs = requiredEnvs.filter(env => process.env[env] === undefined || process.env[env] === '');
    if (missingEnvs.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
    }
    
    if (process.env.DB_PASS === undefined) {
      console.warn('WARNING: DB_PASS is not set. Assuming empty password.');
    }

    // 2. Validate DB connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // 3. Sync database safely (dev only)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync();
      console.log('Database synced.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('CRITICAL STARTUP FAILURE:', error.message);
    if (error.original) {
      console.error('Database Error Details:', error.original);
    }
    process.exit(1);
  }
}

startServer();

module.exports = app;

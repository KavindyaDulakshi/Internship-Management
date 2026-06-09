const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const internshipRouter = require('./routes/internshipRoutes');
const aiRouter = require('./routes/aiRoutes');

const app = express();

// 1. GLOBAL MIDDLEWARES
// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // In production, customize this to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 2. HEALTH CHECK ROUTE
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'InternHub API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// 3. API ROUTES
app.use('/api/internships', internshipRouter);
app.use('/api/ai', aiRouter);

// 4. FALLBACK ROUTE (UNHANDLED ROUTES)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

module.exports = app;

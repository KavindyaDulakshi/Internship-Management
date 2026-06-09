// Handle uncaught exceptions globally before any other code runs
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

require('dotenv').config();
const app = require('./app');

// Configure listening port
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`===================================================`);
  console.log(`🚀 InternHub Backend running on port ${port}`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===================================================`);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});

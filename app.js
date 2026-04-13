const express = require('express');
const cors = require('cors');
const appEventEmitter = require('./middleware/eventEmitter');
const LogSubscriber = require('./subscribers/logSubscriber');
const timingMiddleware = require('./middleware/timingMiddleware');
const statsMiddleware = require('./middleware/statsMiddleware');
const teachersRouter = require('./routes/teachers');

const app = express();

// Initialize subscriber (Part E)
new LogSubscriber(appEventEmitter, { 
  logFilePath: './logs/stats.json',
  console: process.env.NODE_ENV !== 'production'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(timingMiddleware(appEventEmitter)); // Part B
app.use(statsMiddleware(appEventEmitter));  // Part C

// Routes
app.use('/api/teachers', teachersRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
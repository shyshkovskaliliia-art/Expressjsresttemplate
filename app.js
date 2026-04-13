const express = require('express');
const cors = require('cors');
const appEventEmitter = require('./middleware/eventEmitters');
const timingMiddleware = require('./middleware/timingMiddleware');
const statsMiddleware = require('./middleware/statsMiddleware');
const teachersRouter = require('./routes/teachers');

const app = express();

// Ініціалізація subscriber
new LogSubscriber(appEventEmitter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(timingMiddleware(appEventEmitter));
app.use(statsMiddleware(appEventEmitter));

// Routes
app.use('/api/teachers', teachersRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

module.exports = app;
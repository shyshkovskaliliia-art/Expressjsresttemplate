const express = require('express');
const cors = require('cors');
require('dotenv').config();

const appEventEmitter = require('./middleware/eventEmitter');
const LogSubscriber = require('./subscribers/logSubscriber');
const timingMiddleware = require('./middleware/timingMiddleware');
const statsMiddleware = require('./middleware/statsMiddleware');

const teachersRouter = require('./routes/users');

const app = express();

new LogSubscriber(appEventEmitter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(timingMiddleware(appEventEmitter));
app.use(statsMiddleware(appEventEmitter));

app.use('/api/teachers', teachersRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});


app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;
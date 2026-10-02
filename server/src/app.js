const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const logger = require('./config/logger');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Enable CORS for client app
app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost, configured CLIENT_URL, or direct tool requests (origin === undefined)
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger middleware
app.use((req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.url}`, {
    event: 'http_request',
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

// Mount main API
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

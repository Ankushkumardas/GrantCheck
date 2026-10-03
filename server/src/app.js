const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const logger = require('./config/logger');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');

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

// Apply global rate limiting to all requests
app.use(globalLimiter);

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

// Root health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Grant Application Completeness Assistant API is running successfully on Render! 🚀',
    version: '1.0.0'
  });
});

// Mount main API
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

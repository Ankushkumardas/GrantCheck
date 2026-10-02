const winston = require('winston');

// Custom format to mask sensitive tokens if any
const sanitizeFormat = winston.format((info) => {
  const sanitized = { ...info };
  if (sanitized.password) sanitized.password = '***REDACTED***';
  if (sanitized.apiKey) sanitized.apiKey = '***REDACTED***';
  if (sanitized.token) sanitized.token = '***REDACTED***';
  return sanitized;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    sanitizeFormat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'grant-completeness-assistant' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, event, ...meta }) => {
          const eventTag = event ? ` [${event}]` : '';
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} ${level}${eventTag}: ${message}${metaStr}`;
        })
      )
    })
  ]
});

module.exports = logger;

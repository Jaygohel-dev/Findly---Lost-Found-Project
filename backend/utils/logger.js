const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: process.env.NODE_ENV === 'development'
    ? format.combine(format.colorize(), format.timestamp({ format: 'HH:mm:ss' }), format.errors({ stack: true }),
        format.printf(({ level, message, timestamp, stack }) => `${timestamp} [${level}]: ${stack || message}`)
      )
    : format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [new transports.Console()],
});

module.exports = logger;

/**
 * Logger utility for Z-KERNEL components
 */

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'z-kernel' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'z-kernel.log' }),
  ],
});

module.exports = logger;

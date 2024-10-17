import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, 'logs');

// Ensure the 'logs' directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Create the logger instance
const logger = winston.createLogger({
    level: 'debug', // Adjust log level if needed
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // Log general info messages to transactions.log
        new winston.transports.File({
            filename: path.join(logDir, 'transactions.log'),
            level: 'info', // Log info level and above
        }),
        // Log error messages to errors.log
        new winston.transports.File({
            filename: path.join(logDir, 'errors.log'),
            level: 'error',
        }),
        // Optionally log to console for real-time feedback
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

// Test the logger
logger.info('Logger initialized.');

// Function to log transaction details
export const logTransaction = (transaction) => {
    logger.info(`Transaction executed: ${JSON.stringify(transaction)}`);
};

// Function to log errors
export const logError = (error) => {
    logger.error(`Error occurred: ${error.message || error}`);
};

export default logger;
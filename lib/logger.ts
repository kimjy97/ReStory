enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

import dbConnect from './mongodb';
import Log from '../models/Log';

const log = async (level: LogLevel, message: string, metadata?: Record<string, any>) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`, metadata || '');

  // Only attempt to save to MongoDB if running on the server
  if (typeof window === 'undefined') {
    try {
      await dbConnect();
      const logEntry = new Log({
        level,
        message,
        timestamp: new Date(),
        metadata,
      });
      await logEntry.save();
    } catch (error) {
      console.error(`[${timestamp}] [ERROR] Failed to save log to MongoDB:`, error);
    }
  }
};

export const logger = {
  debug: (message: string, metadata?: Record<string, any>) => log(LogLevel.DEBUG, message, metadata),
  info: (message: string, metadata?: Record<string, any>) => log(LogLevel.INFO, message, metadata),
  warn: (message: string, metadata?: Record<string, any>) => log(LogLevel.WARN, message, metadata),
  error: (message: string, metadata?: Record<string, any>) => log(LogLevel.ERROR, message, metadata),
};

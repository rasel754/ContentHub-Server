import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

let server: http.Server;

// Uncaught exceptions listener
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

const startServer = async (): Promise<void> => {
  // 1. Establish DB Connection
  await connectDatabase();

  // 2. Start listening
  const port = env.PORT;
  server = app.listen(port, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${port}`);
  });

  // Unhandled rejections listener
  process.on('unhandledRejection', (reason: any) => {
    logger.error(`UNHANDLED REJECTION: ${reason?.message || reason}`, {
      stack: reason?.stack,
    });
    
    if (server) {
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDatabase();
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });

  // Graceful shutdown on termination signals
  const shutdownHandler = (signal: string) => {
    logger.info(`[${signal}] signal received. Starting graceful shutdown...`);
    if (server) {
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDatabase();
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
  process.on('SIGINT', () => shutdownHandler('SIGINT'));
};

startServer();

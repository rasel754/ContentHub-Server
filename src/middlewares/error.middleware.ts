import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // Format common Mongoose errors
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  } else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    error = new AppError(`Validation failure: ${messages.join(', ')}`, 400);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new AppError(`Duplicate field error: The ${field} value already exists.`, 400);
  }

  // Ensure status and isOperational are preserved
  const statusCode = error.statusCode;
  const isOperational = error.isOperational || err.isOperational || false;
  const message = error.message || 'Something went wrong';

  if (env.NODE_ENV === 'development') {
    logger.error(`[Error] StatusCode: ${statusCode} - ${message}`, { stack: err.stack });
    res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
      error: err,
    });
  } else {
    // Production Mode
    if (isOperational) {
      res.status(statusCode).json({
        success: false,
        message,
      });
    } else {
      // Log critical framework or infrastructure errors
      logger.error(`[Critical Server Error] ${err.name || 'Error'}: ${err.message}`, { stack: err.stack });
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred.',
      });
    }
  }
};

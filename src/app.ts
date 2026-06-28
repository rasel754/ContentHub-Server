import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import { rateLimiter } from './middlewares/rateLimit.middleware';
import { globalErrorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';
import { env } from './config/env';

const app: Application = express();

// 1. Security Headers via Helmet
app.use(helmet());

// 2. Cross-Origin Resource Sharing
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// 3. Request Parsers with limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Rate Limiting for all API requests
app.use('/api', rateLimiter);

// 5. Mount API Router aggregator
app.use('/api', router);

// 6. Basic Health Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Service is healthy and running.',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the ContentHub API Server.',
    timestamp: new Date().toISOString(),
  });
});

// 7. Match-all 404 Route handler
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

// 8. Centralized Global Error Interceptor
app.use(globalErrorHandler);

export default app;

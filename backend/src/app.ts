import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler, notFound } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rate-limit.middleware';
import { logger } from './utils/logger';

// Import routes
import authRoutes from './routes/auth.routes';
import codeRoutes from './routes/code.routes';
import reviewRoutes from './routes/review.routes';
import progressRoutes from './routes/progress.routes';
import plagiarismRoutes from './routes/plagiarism.routes';
import practiceRoutes from './routes/practice.routes';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes with rate limiting
app.use('/api/auth', authRoutes);
app.use('/api/code', apiLimiter, codeRoutes);
app.use('/api/review', apiLimiter, reviewRoutes);
app.use('/api/progress', apiLimiter, progressRoutes);
app.use('/api/plagiarism', apiLimiter, plagiarismRoutes);
app.use('/api/practice', apiLimiter, practiceRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;

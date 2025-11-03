import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requestIdMiddleware } from './middleware/requestId.middleware';
import { requestLoggerMiddleware } from './middleware/requestLogger.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import patientRoutes from './routes/patient.routes';
import voiceNoteRoutes from './routes/voiceNote.routes';
import summaryRoutes from './routes/summary.routes';
import healthRoutes from './routes/health.routes';
import { logger } from './utils/logger';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import openApiDocument from './config/openapi';

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(process.cwd(), 'data');
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

app.use('/health', healthRoutes);

const apiKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => {
    return (req.headers['x-api-key'] as string) || req.ip || 'unknown';
  },
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Serve OpenAPI JSON
app.get('/api-docs.json', (req, res) => {
  res.json(openApiDocument);
});

app.use('/api', apiKeyLimiter);
app.use('/api', authMiddleware);

// API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/voice-notes', voiceNoteRoutes);
app.use('/api/summaries', summaryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API Base URL: http://localhost:${PORT}/api`);
});

export default app;

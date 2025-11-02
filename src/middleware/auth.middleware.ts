import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const VALID_API_KEYS = new Set(['test-api-key-123', 'test-key-456', 'prod-key-789']);

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    logger.warn(JSON.stringify({ requestId: req.id }), 'Missing API key');
    return res.status(401).json({ error: 'API key is required' });
  }

  if (!VALID_API_KEYS.has(apiKey)) {
    logger.warn('Invalid API key', { requestId: req.id, apiKey });
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};

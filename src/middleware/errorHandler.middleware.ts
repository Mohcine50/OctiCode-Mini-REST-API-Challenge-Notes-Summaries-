import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', { requestId: req.id, error: err.message, stack: err.stack });

  res.status(500).json({
    error: 'Internal server error',
    requestId: req.id,
  });
};

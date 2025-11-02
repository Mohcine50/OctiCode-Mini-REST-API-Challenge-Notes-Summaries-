import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      requestId: req.id,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};

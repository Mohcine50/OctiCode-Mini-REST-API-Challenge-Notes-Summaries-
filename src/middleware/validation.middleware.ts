import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { logger } from '../utils/logger';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      logger.warn('Validation error', { requestId: req.id, error: error.errors });
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
  };
};

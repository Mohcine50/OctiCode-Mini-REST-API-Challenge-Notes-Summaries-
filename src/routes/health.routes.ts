import { Router, Request, Response } from 'express';
import DatabaseService from '../db/database';
import getDb from '../db/db';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/ready', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const patients = db.getAllPatients();
    db.close();

    res.json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;

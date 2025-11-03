import { z } from 'zod';

export const HealthCheckSchema = z.object({
  status: z.string().describe('Service status'),
  timestamp: z.string().datetime().describe('Current timestamp'),
  uptime: z.number().describe('Process uptime in seconds'),
});

export const ReadyCheckSchema = z.object({
  status: z.string().describe('Readiness status'),
  database: z.string().describe('Database connection status'),
  timestamp: z.string().datetime().describe('Current timestamp'),
});

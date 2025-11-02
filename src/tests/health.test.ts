import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('Health Endpoints', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });

  it('should return readiness status', async () => {
    const response = await request(app).get('/health/ready').expect(200);

    expect(response.body).toHaveProperty('status', 'ready');
    expect(response.body).toHaveProperty('database');
  });
});

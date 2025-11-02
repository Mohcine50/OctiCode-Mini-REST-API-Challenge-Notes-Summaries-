import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import DatabaseService from '../db/database';
import path from 'path';
import fs from 'fs';
import * as patientController from '../controllers/patient.controller';
import * as voiceNoteController from '../controllers/voiceNote.controller';
import * as summaryController from '../controllers/summary.controller';

const TEST_DB_PATH = path.join(process.cwd(), 'data', 'test.db');
const API_KEY = process.env.API_KEY || 'test-api-key-123';

describe('Patient API', () => {
  let db: DatabaseService;

  beforeAll(() => {
    // Clean up test database if exists
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    // Initialize test database
    db = new DatabaseService(TEST_DB_PATH);
    // Inject test DB into controllers
    patientController.initializeDb(db);
    voiceNoteController.initializeDb(db);
    summaryController.initializeDb(db);
  });

  beforeEach(() => {
    // Clear all tables before each test
    db['db'].exec('DELETE FROM summaries');
    db['db'].exec('DELETE FROM voice_notes');
    db['db'].exec('DELETE FROM patients');
  });

  afterAll(() => {
    if (db) db.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  describe('POST /api/patients', () => {
    it('should create a new patient with valid data', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      };

      const response = await request(app)
        .post('/api/patients')
        .set('x-api-key', API_KEY)
        .send(patientData)
        .expect(201);

      expect(response.body).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        email: 'john.doe@example.com',
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should fail without API key', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
      };

      await request(app).post('/api/patients').send(patientData).expect(401);
    });

    it('should fail with invalid data', async () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
      };

      const response = await request(app)
        .post('/api/patients')
        .set('x-api-key', API_KEY)
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body).toHaveProperty('details');
    });
  });

  describe('GET /api/patients', () => {
    it('should return empty array when no patients exist', async () => {
      const response = await request(app)
        .get('/api/patients')
        .set('x-api-key', API_KEY)
        .expect(200);

      expect(response.body).toEqual({ data: [], count: 0 });
    });

    it('should return all patients', async () => {
      // Create test patients
      db.createPatient({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
      });
      db.createPatient({
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1985-06-20',
      });

      const response = await request(app)
        .get('/api/patients')
        .set('x-api-key', API_KEY)
        .expect(200);

      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/patients/:id', () => {
    it('should return a specific patient', async () => {
      const patient = db.createPatient({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
      });

      const response = await request(app)
        .get(`/api/patients/${patient.id}`)
        .set('x-api-key', API_KEY)
        .expect(200);

      expect(response.body).toMatchObject({
        id: patient.id,
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should return 404 for non-existent patient', async () => {
      await request(app)
        .get('/api/patients/550e8400-e29b-41d4-a716-446655440000')
        .set('x-api-key', API_KEY)
        .expect(404);
    });
  });

  describe('PATCH /api/patients/:id', () => {
    it('should update patient data', async () => {
      const patient = db.createPatient({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
      });

      const response = await request(app)
        .patch(`/api/patients/${patient.id}`)
        .set('x-api-key', API_KEY)
        .send({ firstName: 'Johnny' })
        .expect(200);

      expect(response.body.firstName).toBe('Johnny');
      expect(response.body.lastName).toBe('Doe');
    });
  });

  describe('DELETE /api/patients/:id', () => {
    it('should delete a patient', async () => {
      const patient = db.createPatient({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
      });

      await request(app)
        .delete(`/api/patients/${patient.id}`)
        .set('x-api-key', API_KEY)
        .expect(204);

      const deleted = db.getPatientById(patient.id);
      expect(deleted).toBeUndefined();
    });
  });
});

import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import DatabaseService from '../db/database';
import path from 'path';
import fs from 'fs';
import * as patientController from '../controllers/patient.controller';
import * as voiceNoteController from '../controllers/voiceNote.controller';
import * as summaryController from '../controllers/summary.controller';

const TEST_DB_PATH = path.join(process.cwd(), 'data', 'test-voice.db');
const API_KEY = process.env.API_KEY || 'test-api-key-123';

describe('Voice Note API', () => {
  let db: DatabaseService;
  let patientId: string;

  beforeAll(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    db = new DatabaseService(TEST_DB_PATH);

    patientController.initializeDb(db);
    voiceNoteController.initializeDb(db);
    summaryController.initializeDb(db);
  });

  beforeEach(() => {
    db['db'].exec('DELETE FROM summaries');
    db['db'].exec('DELETE FROM voice_notes');
    db['db'].exec('DELETE FROM patients');
    const patient = db.createPatient({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
    });
    patientId = patient.id;
  });

  afterAll(() => {
    if (db) db.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  describe('POST /api/voice-notes', () => {
    it('should create a voice note', async () => {
      const voiceNoteData = {
        patientId,
        title: 'Consultation Session 1',
        duration: 180,
        recordedAt: new Date().toISOString(),
        metadata: {
          fileSize: 1024000,
          format: 'wav',
          deviceInfo: 'iPhone 12',
        },
      };

      const response = await request(app)
        .post('/api/voice-notes')
        .set('x-api-key', API_KEY)
        .send(voiceNoteData)
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'Consultation Session 1',
        duration: 180,
      });
      expect(response.body.metadata).toBeDefined();
      expect(response.body).toHaveProperty('id');
    });

    it('should fail with non-existent patient', async () => {
      const voiceNoteData = {
        patientId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test',
        duration: 100,
        recordedAt: new Date().toISOString(),
      };

      await request(app)
        .post('/api/voice-notes')
        .set('x-api-key', API_KEY)
        .send(voiceNoteData)
        .expect(404);
    });
  });

  describe('GET /api/voice-notes/patient/:patientId', () => {
    it('should return voice notes for a patient', async () => {
      db.createVoiceNote({
        patientId,
        title: 'Session 1',
        duration: 120,
        recordedAt: new Date().toISOString(),
      });

      const response = await request(app)
        .get(`/api/voice-notes/patient/${patientId}`)
        .set('x-api-key', API_KEY)
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].title).toBe('Session 1');
    });
  });
});

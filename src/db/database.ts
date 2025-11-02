import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceNote {
  id: string;
  patientId: string;
  title: string;
  duration: number;
  recordedAt: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  id: string;
  voiceNoteId: string;
  content: string;
  keyPoints?: string;
  sentiment?: string;
  confidence?: number;
  createdAt: string;
  updatedAt: string;
}

class DatabaseService {
  private db: Database.Database;

  constructor(dbPath: string = path.join(process.cwd(), 'data', 'app.db')) {
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize() {
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          dateOfBirth TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );
  
        CREATE TABLE IF NOT EXISTS voice_notes (
          id TEXT PRIMARY KEY,
          patientId TEXT NOT NULL,
          title TEXT NOT NULL,
          duration REAL NOT NULL,
          recordedAt TEXT NOT NULL,
          metadata TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
        );
  
        CREATE TABLE IF NOT EXISTS summaries (
          id TEXT PRIMARY KEY,
          voiceNoteId TEXT NOT NULL,
          content TEXT NOT NULL,
          keyPoints TEXT,
          sentiment TEXT,
          confidence REAL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (voiceNoteId) REFERENCES voice_notes(id) ON DELETE CASCADE
        );
      `);
  }

  // Patients
  createPatient(data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient {
    const id = randomUUID();
    const now = new Date().toISOString();
    const query = this.db.prepare(`
        INSERT INTO patients (id, firstName, lastName, dateOfBirth, email, phone, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
    query.run(
      id,
      data.firstName,
      data.lastName,
      data.dateOfBirth,
      data.email,
      data.phone,
      now,
      now
    );
    return this.getPatientById(id)!;
  }

  getPatientById(id: string): Patient | undefined {
    const query = this.db.prepare('SELECT * FROM patients WHERE id = ?');
    return query.get(id) as Patient | undefined;
  }

  getAllPatients(): Patient[] {
    const query = this.db.prepare('SELECT * FROM patients ORDER BY createdAt DESC');
    return query.all() as Patient[];
  }

  updatePatient(
    id: string,
    data: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>
  ): Patient | undefined {
    const existing = this.getPatientById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return existing;

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const query = this.db.prepare(`UPDATE patients SET ${updates.join(', ')} WHERE id = ?`);
    query.run(...values);
    return this.getPatientById(id);
  }

  deletePatient(id: string): boolean {
    const query = this.db.prepare('DELETE FROM patients WHERE id = ?');
    const result = query.run(id);
    return result.changes > 0;
  }

  // Voice Notes
  createVoiceNote(data: Omit<VoiceNote, 'id' | 'createdAt' | 'updatedAt'>): VoiceNote {
    const id = randomUUID();
    const now = new Date().toISOString();
    const query = this.db.prepare(`
        INSERT INTO voice_notes (id, patientId, title, duration, recordedAt, metadata, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
    query.run(
      id,
      data.patientId,
      data.title,
      data.duration,
      data.recordedAt,
      data.metadata,
      now,
      now
    );
    return this.getVoiceNoteById(id)!;
  }

  getVoiceNoteById(id: string): VoiceNote | undefined {
    const query = this.db.prepare('SELECT * FROM voice_notes WHERE id = ?');
    return query.get(id) as VoiceNote | undefined;
  }

  getVoiceNotesByPatientId(patientId: string): VoiceNote[] {
    const query = this.db.prepare(
      'SELECT * FROM voice_notes WHERE patientId = ? ORDER BY recordedAt DESC'
    );
    return query.all(patientId) as VoiceNote[];
  }

  getAllVoiceNotes(): VoiceNote[] {
    const query = this.db.prepare('SELECT * FROM voice_notes ORDER BY recordedAt DESC');
    return query.all() as VoiceNote[];
  }

  updateVoiceNote(
    id: string,
    data: Partial<Omit<VoiceNote, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>>
  ): VoiceNote | undefined {
    const existing = this.getVoiceNoteById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return existing;

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const query = this.db.prepare(`UPDATE voice_notes SET ${updates.join(', ')} WHERE id = ?`);
    query.run(...values);
    return this.getVoiceNoteById(id);
  }

  deleteVoiceNote(id: string): boolean {
    const query = this.db.prepare('DELETE FROM voice_notes WHERE id = ?');
    const result = query.run(id);
    return result.changes > 0;
  }

  // Summaries
  createSummary(data: Omit<Summary, 'id' | 'createdAt' | 'updatedAt'>): Summary {
    const id = randomUUID();
    const now = new Date().toISOString();
    const query = this.db.prepare(`
        INSERT INTO summaries (id, voiceNoteId, content, keyPoints, sentiment, confidence, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
    query.run(
      id,
      data.voiceNoteId,
      data.content,
      data.keyPoints,
      data.sentiment,
      data.confidence,
      now,
      now
    );
    return this.getSummaryById(id)!;
  }

  getSummaryById(id: string): Summary | undefined {
    const query = this.db.prepare('SELECT * FROM summaries WHERE id = ?');
    return query.get(id) as Summary | undefined;
  }

  getSummaryByVoiceNoteId(voiceNoteId: string): Summary | undefined {
    const query = this.db.prepare('SELECT * FROM summaries WHERE voiceNoteId = ?');
    return query.get(voiceNoteId) as Summary | undefined;
  }

  getAllSummaries(): Summary[] {
    const query = this.db.prepare('SELECT * FROM summaries ORDER BY createdAt DESC');
    return query.all() as Summary[];
  }

  updateSummary(
    id: string,
    data: Partial<Omit<Summary, 'id' | 'voiceNoteId' | 'createdAt' | 'updatedAt'>>
  ): Summary | undefined {
    const existing = this.getSummaryById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return existing;

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const query = this.db.prepare(`UPDATE summaries SET ${updates.join(', ')} WHERE id = ?`);
    query.run(...values);
    return this.getSummaryById(id);
  }

  deleteSummary(id: string): boolean {
    const query = this.db.prepare('DELETE FROM summaries WHERE id = ?');
    const result = query.run(id);
    return result.changes > 0;
  }

  close() {
    this.db.close();
  }
}

export default DatabaseService;

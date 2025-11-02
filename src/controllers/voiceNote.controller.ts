import { Request, Response } from 'express';
import DatabaseService from '../db/database';
import { logger } from '../utils/logger';
import getDb from '../db/db';

let db!: DatabaseService;

export const initializeDb = (dbInstance?: DatabaseService) => {
  db = dbInstance || getDb();
};

if (!db) {
  initializeDb();
}

export const createVoiceNote = (req: Request, res: Response) => {
  try {
    const patient = db.getPatientById(req.body.patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const metadata = req.body.metadata ? JSON.stringify(req.body.metadata) : undefined;
    const voiceNote = db.createVoiceNote({ ...req.body, metadata });

    logger.info('Voice note created', { requestId: req.id, voiceNoteId: voiceNote.id });

    const response = {
      ...voiceNote,
      metadata: voiceNote.metadata ? JSON.parse(voiceNote.metadata) : undefined,
    };

    res.status(201).json(response);
  } catch (error: any) {
    logger.error('Error creating voice note', { requestId: req.id, error: error.message });
    res.status(500).json({ error: 'Failed to create voice note' });
  }
};

export const getVoiceNote = (req: Request, res: Response) => {
  const voiceNote = db.getVoiceNoteById(req.params.id);
  if (!voiceNote) {
    return res.status(404).json({ error: 'Voice note not found' });
  }

  const response = {
    ...voiceNote,
    metadata: voiceNote.metadata ? JSON.parse(voiceNote.metadata) : undefined,
  };

  res.json(response);
};

export const getAllVoiceNotes = (req: Request, res: Response) => {
  const voiceNotes = db.getAllVoiceNotes().map((vn) => ({
    ...vn,
    metadata: vn.metadata ? JSON.parse(vn.metadata) : undefined,
  }));
  res.json({ data: voiceNotes, count: voiceNotes.length });
};

export const getVoiceNotesByPatient = (req: Request, res: Response) => {
  const patient = db.getPatientById(req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const voiceNotes = db.getVoiceNotesByPatientId(req.params.patientId).map((vn) => ({
    ...vn,
    metadata: vn.metadata ? JSON.parse(vn.metadata) : undefined,
  }));

  res.json({ data: voiceNotes, count: voiceNotes.length });
};

export const updateVoiceNote = (req: Request, res: Response) => {
  const metadata = req.body.metadata ? JSON.stringify(req.body.metadata) : undefined;
  const voiceNote = db.updateVoiceNote(req.params.id, { ...req.body, metadata });

  if (!voiceNote) {
    return res.status(404).json({ error: 'Voice note not found' });
  }

  logger.info('Voice note updated', { requestId: req.id, voiceNoteId: voiceNote.id });

  const response = {
    ...voiceNote,
    metadata: voiceNote.metadata ? JSON.parse(voiceNote.metadata) : undefined,
  };

  res.json(response);
};

export const deleteVoiceNote = (req: Request, res: Response) => {
  const deleted = db.deleteVoiceNote(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Voice note not found' });
  }
  logger.info('Voice note deleted', { requestId: req.id, voiceNoteId: req.params.id });
  res.status(204).send();
};

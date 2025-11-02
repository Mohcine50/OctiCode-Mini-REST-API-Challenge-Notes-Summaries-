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

export const createSummary = (req: Request, res: Response) => {
  try {
    const voiceNote = db.getVoiceNoteById(req.body.voiceNoteId);
    if (!voiceNote) {
      return res.status(404).json({ error: 'Voice note not found' });
    }

    const existing = db.getSummaryByVoiceNoteId(req.body.voiceNoteId);
    if (existing) {
      return res.status(409).json({ error: 'Summary already exists for this voice note' });
    }

    const keyPoints = req.body.keyPoints ? JSON.stringify(req.body.keyPoints) : undefined;
    const summary = db.createSummary({ ...req.body, keyPoints });

    logger.info('Summary created', { requestId: req.id, summaryId: summary.id });

    const response = {
      ...summary,
      keyPoints: summary.keyPoints ? JSON.parse(summary.keyPoints) : undefined,
    };

    res.status(201).json(response);
  } catch (error: any) {
    logger.error('Error creating summary', { requestId: req.id, error: error.message });
    res.status(500).json({ error: 'Failed to create summary' });
  }
};

export const getSummary = (req: Request, res: Response) => {
  const summary = db.getSummaryById(req.params.id);
  if (!summary) {
    return res.status(404).json({ error: 'Summary not found' });
  }

  const response = {
    ...summary,
    keyPoints: summary.keyPoints ? JSON.parse(summary.keyPoints) : undefined,
  };

  res.json(response);
};

export const getSummaryByVoiceNote = (req: Request, res: Response) => {
  const summary = db.getSummaryByVoiceNoteId(req.params.voiceNoteId);
  if (!summary) {
    return res.status(404).json({ error: 'Summary not found' });
  }

  const response = {
    ...summary,
    keyPoints: summary.keyPoints ? JSON.parse(summary.keyPoints) : undefined,
  };

  res.json(response);
};

export const getAllSummaries = (req: Request, res: Response) => {
  const summaries = db.getAllSummaries().map((s) => ({
    ...s,
    keyPoints: s.keyPoints ? JSON.parse(s.keyPoints) : undefined,
  }));
  res.json({ data: summaries, count: summaries.length });
};

export const updateSummary = (req: Request, res: Response) => {
  const keyPoints = req.body.keyPoints ? JSON.stringify(req.body.keyPoints) : undefined;
  const summary = db.updateSummary(req.params.id, { ...req.body, keyPoints });

  if (!summary) {
    return res.status(404).json({ error: 'Summary not found' });
  }

  logger.info('Summary updated', { requestId: req.id, summaryId: summary.id });

  const response = {
    ...summary,
    keyPoints: summary.keyPoints ? JSON.parse(summary.keyPoints) : undefined,
  };

  res.json(response);
};

export const deleteSummary = (req: Request, res: Response) => {
  const deleted = db.deleteSummary(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Summary not found' });
  }
  logger.info('Summary deleted', { requestId: req.id, summaryId: req.params.id });
  res.status(204).send();
};

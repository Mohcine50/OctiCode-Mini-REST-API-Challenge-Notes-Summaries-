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

export const createPatient = (req: Request, res: Response) => {
  try {
    const patient = db.createPatient(req.body);
    logger.info('Patient created', { requestId: req.id, patientId: patient.id });
    res.status(201).json(patient);
  } catch (error: any) {
    logger.error('Error creating patient', { requestId: req.id, error: error.message });
    res.status(500).json({ error: 'Failed to create patient' });
  }
};

export const getPatient = (req: Request, res: Response) => {
  const patient = db.getPatientById(req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  res.json(patient);
};

export const getAllPatients = (req: Request, res: Response) => {
  const patients = db.getAllPatients();
  res.json({ data: patients, count: patients.length });
};

export const updatePatient = (req: Request, res: Response) => {
  const patient = db.updatePatient(req.params.id, req.body);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  logger.info('Patient updated', { requestId: req.id, patientId: patient.id });
  res.json(patient);
};

export const deletePatient = (req: Request, res: Response) => {
  const deleted = db.deletePatient(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  logger.info('Patient deleted', { requestId: req.id, patientId: req.params.id });
  res.status(204).send();
};

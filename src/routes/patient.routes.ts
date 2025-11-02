import { Router } from 'express';
import * as patientController from '../controllers/patient.controller';
import { validateBody } from '../middleware/validation.middleware';
import { createPatientSchema, updatePatientSchema } from '../schemas/patient.schema';

const router = Router();

router.post('/', validateBody(createPatientSchema), patientController.createPatient);
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatient);
router.patch('/:id', validateBody(updatePatientSchema), patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

export default router;

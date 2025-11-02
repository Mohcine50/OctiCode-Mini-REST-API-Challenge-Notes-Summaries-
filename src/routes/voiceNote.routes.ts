import { Router } from 'express';
import * as voiceNoteController from '../controllers/voiceNote.controller';
import { validateBody } from '../middleware/validation.middleware';
import { createVoiceNoteSchema, updateVoiceNoteSchema } from '../schemas/voiceNote.schema';

const router = Router();

router.post('/', validateBody(createVoiceNoteSchema), voiceNoteController.createVoiceNote);
router.get('/', voiceNoteController.getAllVoiceNotes);
router.get('/:id', voiceNoteController.getVoiceNote);
router.get('/patient/:patientId', voiceNoteController.getVoiceNotesByPatient);
router.patch('/:id', validateBody(updateVoiceNoteSchema), voiceNoteController.updateVoiceNote);
router.delete('/:id', voiceNoteController.deleteVoiceNote);

export default router;

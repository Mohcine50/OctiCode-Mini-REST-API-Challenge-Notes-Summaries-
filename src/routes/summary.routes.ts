import { Router } from 'express';
import * as summaryController from '../controllers/summary.controller';
import { validateBody } from '../middleware/validation.middleware';
import { createSummarySchema, updateSummarySchema } from '../schemas/summary.schema';

const router = Router();

router.post('/', validateBody(createSummarySchema), summaryController.createSummary);
router.get('/', summaryController.getAllSummaries);
router.get('/:id', summaryController.getSummary);
router.get('/voice-note/:voiceNoteId', summaryController.getSummaryByVoiceNote);
router.patch('/:id', validateBody(updateSummarySchema), summaryController.updateSummary);
router.delete('/:id', summaryController.deleteSummary);

export default router;

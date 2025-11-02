import { z } from 'zod';

export const createSummarySchema = z.object({
  voiceNoteId: z.string().uuid('Invalid voice note ID'),
  content: z.string().min(1, 'Summary content is required'),
  keyPoints: z.array(z.string()).optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const updateSummarySchema = createSummarySchema.partial().omit({ voiceNoteId: true });

export type CreateSummaryInput = z.infer<typeof createSummarySchema>;
export type UpdateSummaryInput = z.infer<typeof updateSummarySchema>;

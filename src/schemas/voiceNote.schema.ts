import { z } from 'zod';

export const createVoiceNoteSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  title: z.string().min(1).max(200),
  duration: z.number().positive('Duration must be positive'),
  recordedAt: z.string().datetime(),
  metadata: z
    .object({
      fileSize: z.number().optional(),
      format: z.string().optional(),
      deviceInfo: z.string().optional(),
    })
    .optional(),
});

export const updateVoiceNoteSchema = createVoiceNoteSchema.partial().omit({ patientId: true });

export type CreateVoiceNoteInput = z.infer<typeof createVoiceNoteSchema>;
export type UpdateVoiceNoteInput = z.infer<typeof updateVoiceNoteSchema>;

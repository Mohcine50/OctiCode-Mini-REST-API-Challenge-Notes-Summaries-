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

export const VoiceNoteSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  audioUrl: z.string().optional(),
  transcription: z.string().optional(),
  duration: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const updateVoiceNoteSchema = createVoiceNoteSchema.partial().omit({ patientId: true });

export type CreateVoiceNoteInput = z.infer<typeof createVoiceNoteSchema>;
export type UpdateVoiceNoteInput = z.infer<typeof updateVoiceNoteSchema>;

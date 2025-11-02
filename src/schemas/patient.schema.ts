import { z } from 'zod';

export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  dateOfBirth: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(20).optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;

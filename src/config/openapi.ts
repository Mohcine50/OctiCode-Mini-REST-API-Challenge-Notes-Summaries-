import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  createVoiceNoteSchema,
  updateVoiceNoteSchema,
  VoiceNoteSchema,
} from '../schemas/voiceNote.schema';
import { createPatientSchema, PatientSchema, updatePatientSchema } from '../schemas/patient.schema';
import { createSummarySchema, SummarySchema, updateSummarySchema } from '../schemas/summary.schema';
import { HealthCheckSchema, ReadyCheckSchema } from '../schemas/health.schema';

const PatientsListSchema = z.object({
  data: z.array(PatientSchema),
  count: z.number().int(),
});

const VoiceNotesListSchema = z.object({
  data: z.array(VoiceNoteSchema),
  count: z.number().int(),
});

const SummariesListSchema = z.object({
  data: z.array(SummarySchema),
  count: z.number().int(),
});

const ErrorSchema = z.object({
  error: z.string(),
});

const toJsonSchema = (schema: z.ZodType<any>) => {
  return zodToJsonSchema(schema, { $refStrategy: 'none' });
};

// Generate OpenAPI document
export const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Notes & Summaries',
    version: '1.0.0',
    description: 'API for managing patients, voice notes, and AI-generated summaries',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        description: 'Check if the service is running',
        tags: ['Health'],
        operationId: 'healthCheck',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: toJsonSchema(HealthCheckSchema),
              },
            },
          },
        },
      },
    },
    '/health/ready': {
      get: {
        summary: 'Readiness check',
        description: 'Check if the service is ready to accept requests',
        tags: ['Health'],
        operationId: 'readyCheck',
        responses: {
          '200': {
            description: 'Service is ready',
            content: {
              'application/json': {
                schema: toJsonSchema(ReadyCheckSchema),
              },
            },
          },
          '503': {
            description: 'Service is not ready',
            content: {
              'application/json': {
                schema: toJsonSchema(ReadyCheckSchema),
              },
            },
          },
        },
      },
    },
    '/patients': {
      get: {
        summary: 'Get all patients',
        description: 'Retrieve a list of all patients',
        tags: ['Patients'],
        operationId: 'getAllPatients',
        responses: {
          '200': {
            description: 'List of patients',
            content: {
              'application/json': {
                schema: toJsonSchema(PatientsListSchema),
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new patient',
        description: 'Create a new patient record',
        tags: ['Patients'],
        operationId: 'createPatient',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: toJsonSchema(createPatientSchema),
            },
          },
        },
        responses: {
          '201': {
            description: 'Patient created successfully',
            content: {
              'application/json': {
                schema: toJsonSchema(PatientSchema),
              },
            },
          },
          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
          '500': {
            description: 'Failed to create patient',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
    },
    '/patients/{id}': {
      get: {
        summary: 'Get patient by ID',
        description: 'Retrieve a specific patient',
        tags: ['Patients'],
        operationId: 'getPatient',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Patient ID',
          },
        ],
        responses: {
          '200': {
            description: 'Patient found',
            content: {
              'application/json': {
                schema: toJsonSchema(PatientSchema),
              },
            },
          },
          '404': {
            description: 'Patient not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
      put: {
        summary: 'Update patient',
        description: 'Update an existing patient',
        tags: ['Patients'],
        operationId: 'updatePatient',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Patient ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: toJsonSchema(updatePatientSchema),
            },
          },
        },
        responses: {
          '200': {
            description: 'Patient updated successfully',
            content: {
              'application/json': {
                schema: toJsonSchema(PatientSchema),
              },
            },
          },
          '404': {
            description: 'Patient not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete patient',
        description: 'Delete a patient from the system',
        tags: ['Patients'],
        operationId: 'deletePatient',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Patient ID',
          },
        ],
        responses: {
          '204': {
            description: 'Patient deleted successfully',
          },
          '404': {
            description: 'Patient not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
    },
    '/voice-notes': {
      get: {
        summary: 'Get all voice notes',
        description: 'Retrieve a list of all voice notes',
        tags: ['Voice Notes'],
        operationId: 'getAllVoiceNotes',
        responses: {
          '200': {
            description: 'List of voice notes',
            content: {
              'application/json': {
                schema: toJsonSchema(VoiceNotesListSchema),
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new voice note',
        description: 'Create a new voice note for a patient',
        tags: ['Voice Notes'],
        operationId: 'createVoiceNote',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: toJsonSchema(createVoiceNoteSchema),
            },
          },
        },
        responses: {
          '201': {
            description: 'Voice note created successfully',
            content: {
              'application/json': {
                schema: toJsonSchema(VoiceNoteSchema),
              },
            },
          },
          '404': {
            description: 'Patient not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
          '500': {
            description: 'Failed to create voice note',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
    },
    '/voice-notes/{id}': {
      get: {
        summary: 'Get voice note by ID',
        description: 'Retrieve a specific voice note',
        tags: ['Voice Notes'],
        operationId: 'getVoiceNote',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Voice note ID',
          },
        ],
        responses: {
          '200': {
            description: 'Voice note found',
            content: {
              'application/json': {
                schema: toJsonSchema(VoiceNoteSchema),
              },
            },
          },
          '404': {
            description: 'Voice note not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
      put: {
        summary: 'Update voice note',
        description: 'Update an existing voice note',
        tags: ['Voice Notes'],
        operationId: 'updateVoiceNote',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Voice note ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: toJsonSchema(updateVoiceNoteSchema),
            },
          },
        },
        responses: {
          '200': {
            description: 'Voice note updated successfully',
            content: {
              'application/json': {
                schema: toJsonSchema(VoiceNoteSchema),
              },
            },
          },
          '404': {
            description: 'Voice note not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete voice note',
        description: 'Delete a voice note',
        tags: ['Voice Notes'],
        operationId: 'deleteVoiceNote',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Voice note ID',
          },
        ],
        responses: {
          '204': {
            description: 'Voice note deleted successfully',
          },
          '404': {
            description: 'Voice note not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
    },
    '/patients/{patientId}/voice-notes': {
      get: {
        summary: 'Get voice notes by patient',
        description: 'Retrieve all voice notes for a specific patient',
        tags: ['Voice Notes'],
        operationId: 'getVoiceNotesByPatient',
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Patient ID',
          },
        ],
        responses: {
          '200': {
            description: 'List of voice notes for the patient',
            content: {
              'application/json': {
                schema: toJsonSchema(VoiceNotesListSchema),
              },
            },
          },
          '404': {
            description: 'Patient not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
    },
    '/summaries': {
      get: {
        summary: 'Get all summaries',
        description: 'Retrieve a list of all summaries',
        tags: ['Summaries'],
        operationId: 'getAllSummaries',
        responses: {
          '200': {
            description: 'List of summaries',
            content: {
              'application/json': {
                schema: toJsonSchema(SummariesListSchema),
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new summary',
        description: 'Create a new summary for a voice note',
        tags: ['Summaries'],
        operationId: 'createSummary',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: toJsonSchema(createSummarySchema),
            },
          },
        },
        responses: {
          '201': {
            description: 'Summary created successfully',
            content: {
              'application/json': {
                schema: toJsonSchema(SummarySchema),
              },
            },
          },
          '404': {
            description: 'Voice note not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
          '409': {
            description: 'Summary already exists for this voice note',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
          '500': {
            description: 'Failed to create summary',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
    },
    '/summaries/{id}': {
      get: {
        summary: 'Get summary by ID',
        description: 'Retrieve a specific summary',
        tags: ['Summaries'],
        operationId: 'getSummary',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Summary ID',
          },
        ],
        responses: {
          '200': {
            description: 'Summary found',
            content: {
              'application/json': {
                schema: toJsonSchema(SummarySchema),
              },
            },
          },
          '404': {
            description: 'Summary not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
      put: {
        summary: 'Update summary',
        description: 'Update an existing summary',
        tags: ['Summaries'],
        operationId: 'updateSummary',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Summary ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: toJsonSchema(updateSummarySchema),
            },
          },
        },
        responses: {
          '200': {
            description: 'Summary updated successfully',
            content: {
              'application/json': {
                schema: toJsonSchema(SummarySchema),
              },
            },
          },
          '404': {
            description: 'Summary not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete summary',
        description: 'Delete a summary',
        tags: ['Summaries'],
        operationId: 'deleteSummary',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Summary ID',
          },
        ],
        responses: {
          '204': {
            description: 'Summary deleted successfully',
          },
          '404': {
            description: 'Summary not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
    },
    '/voice-notes/{voiceNoteId}/summary': {
      get: {
        summary: 'Get summary by voice note',
        description: 'Retrieve the summary for a specific voice note',
        tags: ['Summaries'],
        operationId: 'getSummaryByVoiceNote',
        parameters: [
          {
            name: 'voiceNoteId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Voice note ID',
          },
        ],
        responses: {
          '200': {
            description: 'Summary found',
            content: {
              'application/json': {
                schema: toJsonSchema(SummarySchema),
              },
            },
          },
          '404': {
            description: 'Summary not found',
            content: {
              'application/json': {
                schema: toJsonSchema(ErrorSchema),
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Patient: toJsonSchema(PatientSchema),
      CreatePatient: toJsonSchema(createPatientSchema),
      UpdatePatient: toJsonSchema(updatePatientSchema),
      PatientsList: toJsonSchema(PatientsListSchema),
      VoiceNote: toJsonSchema(VoiceNoteSchema),
      CreateVoiceNote: toJsonSchema(createVoiceNoteSchema),
      UpdateVoiceNote: toJsonSchema(updateVoiceNoteSchema),
      VoiceNotesList: toJsonSchema(VoiceNotesListSchema),
      Summary: toJsonSchema(SummarySchema),
      CreateSummary: toJsonSchema(createSummarySchema),
      UpdateSummary: toJsonSchema(updateSummarySchema),
      SummariesList: toJsonSchema(SummariesListSchema),
      HealthCheck: toJsonSchema(HealthCheckSchema),
      ReadyCheck: toJsonSchema(ReadyCheckSchema),
      Error: toJsonSchema(ErrorSchema),
    },
  },
  tags: [
    {
      name: 'Health',
      description: 'Health check and readiness endpoints',
    },
    {
      name: 'Patients',
      description: 'Patient management endpoints',
    },
    {
      name: 'Voice Notes',
      description: 'Voice note management endpoints',
    },
    {
      name: 'Summaries',
      description: 'AI-generated summary management endpoints',
    },
  ],
};

export default openApiDocument;

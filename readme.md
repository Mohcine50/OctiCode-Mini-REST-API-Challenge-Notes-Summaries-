Notes & Summaries REST API

A REST API for managing patients, voice note metadata, and AI-generated summaries. Built with Node.js, TypeScript, Express, and SQLite.

# 🔧 Installation

## Install dependencies

```bash
npm install
```

## Run in development mode

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Start production server

```bash
npm start
```

## Run tests

```bash
npm test
```

## Lint code

```bash
npm run lint
```

## Format code

npm run format
🔑 API Authentication
All API endpoints (except /health) require an API key header:
x-api-key: test-api-key-123

## API documentaion:

- Swagger UI: http://localhost:3000/api-docs
- OpenAPI JSON: http://localhost:3000/api-docs.json

# 🛠️ Development

The project uses:

- TypeScript for type safety
- Express for HTTP server
- Zod for runtime validation
- Winston for structured logging
- SQLite via better-sqlite3
- Vitest for testing
- ESLint for linting
- Prettier for formatting

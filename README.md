# AI Content Generator & Chat Assistant Backend

A scalable, production-ready Node.js backend built with Express, TypeScript, and MongoDB. It follows Clean Architecture principles and incorporates Clerk Authentication with Role-Based Access Control (RBAC), rate limiting, Winston logging, Zod validation, and OpenAI GPT integrations.

## Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Auth**: Clerk
- **AI Integration**: OpenAI SDK (GPT-4o-mini)
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest, Supertest

## Directory Structure

```
backend/
├── src/
│   ├── app.ts                  # Express configuration
│   ├── server.ts               # Server bootstrap & connection logic
│   ├── config/                 # App environment configurations
│   ├── constants/              # System-wide static variables/enums
│   ├── middlewares/            # Centralized express middlewares (auth, validation, error)
│   ├── routes/                 # Endpoint aggregator router
│   ├── utils/                  # Common helpers (logger, response formats, errors)
│   ├── types/                  # Global TypeScript type declaration modifications
│   ├── modules/                # Feature-based clean architecture modules
│   │   ├── user/               # User profiles & synchronization
│   │   ├── content/            # Saved generated content CRUD
│   │   ├── chat/               # Conversations database history
│   │   └── ai/                 # OpenAI Generator and Chat completions
│   ├── scripts/                # Utility scripts (database seeding)
│   └── tests/                  # Unit and Integration test suits
├── docs/                       # API docs (api.md)
├── package.json
├── tsconfig.json
├── nodemon.json
└── jest.config.ts
```

## Setup & Configuration

### Prerequisites
- Running MongoDB instance (local or Atlas)
- Clerk account and setup keys
- OpenAI account API key

### Installation
1. Clone the project and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy environment sample file and configure variables:
   ```bash
   cp .env.example .env
   ```
   *Open `.env` and fill in your connection strings and secret keys.*

## Running the Application

### Development Mode (with hot-reloads)
```bash
npm run dev
```

### Production Build
1. Build the TypeScript compiler:
   ```bash
   npm run build
   ```
2. Start compiled JavaScript output:
   ```bash
   npm run start
   ```

### Database Seeding
To seed the database with mock accounts, content items, and chat history:
```bash
npm run seed
```

## Testing

Run the test suite (Jest + Supertest):
```bash
npm run test
```

For watch mode:
```bash
npm run test:watch
```

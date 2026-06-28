# 🧠 ContentHub Server — AI-Powered Content Generator & Chat Assistant

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

A scalable, production-ready Node.js backend built with **Express**, **TypeScript**, and **MongoDB (Mongoose)**. It follows Clean Architecture/Module-based structure principles and incorporates **Clerk Authentication** with session token verification, role-based access control, request validation via **Zod**, database seeding, **Winston** logging, and **OpenAI GPT** completions for generation and chat capabilities.

---

## 📖 1. Project Overview

**ContentHub Server** serves as the API backbone for the ContentHub ecosystem. Creators, marketers, and developers often face content blockages and the challenge of scaling high-quality text production. This backend solves these problems by providing:
* **AI Content Generation**: Automated generation of blogs, social media captions, and text summaries using OpenAI GPT models.
* **Contextual Chat Assistant**: An interactive AI chat companion capable of multi-session conversations with persistent message history.
* **Content Management**: An organized database repository to retrieve, update, and manage previously generated AI content.
* **User Profile Synchronization**: Instant onboarding and metadata synchronization with Clerk auth triggers.

---

## 🧰 2. Technologies Used

* **Runtime & Language**: `Node.js` (>=18.0.0) & `TypeScript` for type safety, maintainability, and compilation checks.
* **Framework**: `Express.js` — minimalist web framework for routing and middleware execution.
* **Database**: `MongoDB` using `Mongoose` ODM for flexible, document-based data modeling.
* **Authentication**: `Clerk SDK` for secure token validation and user identity management.
* **AI Engine**: `OpenAI SDK` for direct access to powerful Large Language Models (LLMs) like `gpt-4o-mini`.
* **Security & Utility**:
  * `Helmet` for setting essential security-related HTTP headers.
  * `CORS` configured with flexible whitelist-based origin checks.
  * `express-rate-limit` to prevent brute force attacks and API spam.
  * `Zod` for runtime request validation.
  * `Winston` for structured, level-based console logging.
  * `Jest` & `Supertest` for comprehensive unit and integration testing.

---

## ✨ 3. Main Features

🔒 **Secure Authentication & Authorization**
* Powered by Clerk JWT middleware. Validates incoming requests using Clerk's session tokens to isolate data access per user account.

🛡️ **Role-Based Access Control (RBAC)**
* Supports distinct user roles: `USER`, `MANAGER`, and `ADMIN`. Includes reusable express route middleware to restrict endpoint access depending on the logged-in user's role metadata.

🧠 **AI Generation & Dialogues**
* Generate context-specific content (blog posts, captions, or summaries) with custom prompts.
* Chat with a persistent AI assistant across multiple threads/sessions. Dialogue histories are saved to MongoDB to keep context intact.

📝 **Full CRUD Operations & Paginated Search**
* Manage generated text history with flexible updates and deletion endpoints.
* Paginated and sorted lists for all saved content items and active chat sessions.

⚙️ **Webhook Synchronization**
* Endpoint to sync profile data from the frontend identity provider to the localized MongoDB database automatically upon registration.

---

## 📦 4. Core Dependencies

Here is a summary of the primary dependencies defined in `package.json`:

| Package Name | Version | Description |
| :--- | :--- | :--- |
| **`@clerk/clerk-sdk-node`** | `^5.0.7` | Clerk backend SDK for authentication and session processing. |
| **`express`** | `^4.19.2` | Fast, unopinionated, minimalist web framework. |
| **`mongoose`** | `^8.3.1` | MongoDB object modeling tool. |
| **`openai`** | `^4.38.3` | Official library for OpenAI API integration. |
| **`zod`** | `^3.22.4` | TypeScript-first schema declaration and validation library. |
| **`express-rate-limit`** | `^7.2.0` | Basic rate-limiting middleware for Express. |
| **`helmet`** | `^7.1.0` | Secure Express apps by setting various HTTP headers. |
| **`cors`** | `^2.8.5` | Middleware to enable Cross-Origin Resource Sharing. |
| **`winston`** | `^3.13.0` | A logger for just about everything. |

---

## ⚙️ 5. Installation & Setup (Local)

Follow these steps to run the server on your local environment:

### Step 1: Clone the Repository
```bash
git clone https://github.com/rasel754/ContentHub-Server.git
cd ContentHub-Server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory by copying the template file:
```bash
cp .env.example .env
```
Fill out the required parameters inside `.env` (see the [Environment Variables](#-6-environment-variables) section below).

### Step 4: Seed Mock Database Data (Optional)
To quickly pre-populate your local database with mock users, contents, and chat logs:
```bash
npm run seed
```

### Step 5: Start the Server
* **Development Mode** (Hot Reloading via `ts-node-dev`):
  ```bash
  npm run dev
  ```
* **Production Mode** (Build and Run):
  ```bash
  npm run build
  npm run start
  ```

### Step 6: Running Tests
```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🔐 6. Environment Variables

The server relies on the following configurations inside your `.env` file:

```env
# Server Configuration
PORT=5000                                 # Port to host the Express server locally
NODE_ENV=development                      # Application environment (development | production)
CORS_ORIGIN=http://localhost:3000         # Allowed frontend client origins (comma-separated)

# Database Configuration
MONGO_URI=mongodb://localhost:27017/...   # MongoDB connection string (local or Atlas cluster)

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_...         # Clerk Publishable Key from your dashboard
CLERK_SECRET_KEY=sk_test_...              # Clerk Secret Key for validating requests

# AI Integration (OpenAI)
OPENAI_API_KEY=sk-proj-...                # Your OpenAI API key
OPENAI_MODEL=gpt-4o-mini                  # GPT Model variant to use (defaults to gpt-4o-mini)

# Security (Rate Limiting)
RATE_LIMIT_WINDOW_MS=900000               # Rate limit window in milliseconds (e.g. 15 minutes)
RATE_LIMIT_MAX=100                        # Maximum request limit per window
```

---

## 🌐 7. API Endpoints

All requests should target the base endpoint: `https://content-hub-server.vercel.app/api` (or `http://localhost:5000/api` locally).

### System & Health Check
* **`GET /health`** | public | Check the server API health status.

### User Profile Module
* **`POST /users/sync`** | public | Syncs Clerk auth metadata to MongoDB on user register/login.
* **`GET /users/profile`** | 🔑 protected | Retrieves the logged-in user's profile details.
* **`PATCH /users/profile`** | 🔑 protected | Updates user profile fields (e.g., `firstName`, `lastName`).

### AI Module
* **`POST /ai/generate`** | 🔑 protected | Accepts a prompt and content `type` (`blog`, `caption`, or `summary`) to generate text.
* **`POST /ai/chat`** | 🔑 protected | Sends a prompt to the AI Assistant referencing an active `conversationId`.

### Content Management (CRUD)
* **`GET /content`** | 🔑 protected | Fetches user's saved generations (with sorting, filtering, and pagination support).
* **`GET /content/:id`** | 🔑 protected | Fetch a single generated content item by ID.
* **`PATCH /content/:id`** | 🔑 protected | Edit the title/prompt details of a saved content item.
* **`DELETE /content/:id`** | 🔑 protected | Remove a saved content item from the database.

### Chat Assistant Sessions
* **`POST /chat/sessions`** | 🔑 protected | Instantiates a new chat dialogue session with a specified title.
* **`GET /chat/sessions`** | 🔑 protected | Fetch all active chat sessions belonging to the user.
* **`GET /chat/sessions/:sessionId/messages`** | 🔑 protected | Fetch chronological messages under a specific session.
* **`DELETE /chat/sessions/:sessionId`** | 🔑 protected | Delete a chat session and all its associated messages.

---

## 🚀 8. Live Link

The production API is deployed and accessible at:
👉 **[https://content-hub-server.vercel.app](https://content-hub-server.vercel.app)**

---

## 🔗 9. Relevant Links

* **GitHub Repository**: [https://github.com/rasel754/ContentHub-Server](https://github.com/rasel754/ContentHub-Server)
* **Client Frontend Application**: [https://content-hub-client.vercel.app](https://content-hub-client.vercel.app)

---
*Developed with ❤️ as part of the ContentHub Ecosystem.*

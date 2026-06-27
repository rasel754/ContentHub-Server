# AI-Powered Content Generator & Chat Assistant API

This API is built using Node.js, Express, TypeScript, Mongoose, Clerk, and OpenAI. It follows Clean Architecture principles.

## Global Headers & Configuration

- **Host URL**: `http://localhost:5000/api`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token via Clerk Session JWT
  - `Authorization: Bearer <your_clerk_session_token>`

---

## 1. Health and System Status

### Health Check
- **Endpoint**: `GET /health`
- **Auth Required**: No
- **Response**:
```json
{
  "success": true,
  "message": "Service is healthy and running.",
  "timestamp": "2026-06-26T11:00:00.000Z"
}
```

---

## 2. User Profile Module

### Get User Profile
- **Endpoint**: `GET /users/profile`
- **Auth Required**: Yes
- **Response**:
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "_id": "603d2b7f0e9f1a001fb1e9d1",
    "clerkId": "user_normal_clerk_id_456",
    "email": "john.doe@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "profileImageUrl": "https://example.com/image.png",
    "createdAt": "2026-06-26T11:00:00.000Z",
    "updatedAt": "2026-06-26T11:00:00.000Z"
  }
}
```

### Update User Profile
- **Endpoint**: `PATCH /users/profile`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "firstName": "Jonathan",
  "lastName": "Doel"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "_id": "603d2b7f0e9f1a001fb1e9d1",
    "clerkId": "user_normal_clerk_id_456",
    "email": "john.doe@gmail.com",
    "firstName": "Jonathan",
    "lastName": "Doel",
    "role": "user",
    "profileImageUrl": "https://example.com/image.png",
    "createdAt": "2026-06-26T11:00:00.000Z",
    "updatedAt": "2026-06-26T11:05:00.000Z"
  }
}
```

### Sync User Profile (Webhook/Post-Login)
- **Endpoint**: `POST /users/sync`
- **Auth Required**: No (Open/Webhook access)
- **Request Body**:
```json
{
  "clerkId": "user_normal_clerk_id_456",
  "email": "john.doe@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "profileImageUrl": "https://example.com/image.png"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User profile synced successfully",
  "data": {
    "clerkId": "user_normal_clerk_id_456",
    "email": "john.doe@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "profileImageUrl": "https://example.com/image.png"
  }
}
```

---

## 3. AI Module

### AI Content Generator
- **Endpoint**: `POST /ai/generate`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "prompt": "Create a post about the benefits of modular clean code in software projects.",
  "type": "blog"
}
```
*Note*: `type` must be one of: `blog`, `caption`, `summary`.
- **Response**:
```json
{
  "success": true,
  "message": "AI Content generated and saved successfully",
  "data": {
    "_id": "603d2b7f0e9f1a001fb1e9fa",
    "userId": "user_normal_clerk_id_456",
    "prompt": "Create a post about the benefits of modular clean code in software projects.",
    "type": "blog",
    "output": "Clean code and modular architecture provide three primary benefits...",
    "metadata": {
      "model": "gpt-4o-mini",
      "generationTimeMs": 1420,
      "wordCount": 156
    },
    "createdAt": "2026-06-26T11:10:00.000Z",
    "updatedAt": "2026-06-26T11:10:00.000Z"
  }
}
```

### AI Chat Assistant (Contextual Dialogue)
- **Endpoint**: `POST /ai/chat`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "conversationId": "603d2b7f0e9f1a001fb1e9f1",
  "message": "What is the second principle of SOLID?"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Message sent and processed successfully",
  "data": {
    "response": "The second SOLID principle is the Open-Closed Principle, which states...",
    "userMessage": {
      "sessionId": "603d2b7f0e9f1a001fb1e9f1",
      "role": "user",
      "content": "What is the second principle of SOLID?",
      "_id": "603d2b7f0e9f1a001fb1e9fc",
      "createdAt": "2026-06-26T11:12:00.000Z"
    },
    "assistantMessage": {
      "sessionId": "603d2b7f0e9f1a001fb1e9f1",
      "role": "assistant",
      "content": "The second SOLID principle is the Open-Closed Principle, which states...",
      "_id": "603d2b7f0e9f1a001fb1e9fd",
      "createdAt": "2026-06-26T11:12:01.000Z"
    }
  }
}
```

---

## 4. Content CRUD Module

### Get All User Content
- **Endpoint**: `GET /content`
- **Auth Required**: Yes
- **Query Parameters**:
  - `type`: filter by type (`blog`, `caption`, `summary`)
  - `page`: default `1`
  - `limit`: default `10`
  - `sortBy`: default `createdAt`
  - `sortOrder`: `asc` or `desc` (default `desc`)
- **Response**:
```json
{
  "success": true,
  "message": "Content fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPage": 1
  },
  "data": [
    {
      "_id": "603d2b7f0e9f1a001fb1e9fa",
      "userId": "user_normal_clerk_id_456",
      "prompt": "Create a post about the benefits of modular clean code in software projects.",
      "type": "blog",
      "output": "Clean code and modular architecture provide...",
      "metadata": {
        "model": "gpt-4o-mini",
        "generationTimeMs": 1420,
        "wordCount": 156
      },
      "createdAt": "2026-06-26T11:10:00.000Z"
    }
  ]
}
```

### Get Single Content Item
- **Endpoint**: `GET /content/:id`
- **Auth Required**: Yes
- **Response**:
```json
{
  "success": true,
  "message": "Content fetched successfully",
  "data": {
    "_id": "603d2b7f0e9f1a001fb1e9fa",
    "userId": "user_normal_clerk_id_456",
    "prompt": "Create a post about the benefits of modular clean code in software projects.",
    "type": "blog",
    "output": "Clean code and modular architecture...",
    "metadata": {
      "model": "gpt-4o-mini"
    },
    "createdAt": "2026-06-26T11:10:00.000Z"
  }
}
```

### Update Saved Content
- **Endpoint**: `PATCH /content/:id`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "prompt": "Updated custom prompt title"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Content updated successfully",
  "data": {
    "_id": "603d2b7f0e9f1a001fb1e9fa",
    "prompt": "Updated custom prompt title",
    "type": "blog",
    "output": "Clean code and modular architecture..."
  }
}
```

### Delete Saved Content
- **Endpoint**: `DELETE /content/:id`
- **Auth Required**: Yes
- **Response**:
```json
{
  "success": true,
  "message": "Content deleted successfully"
}
```

---

## 5. Chat History Module

### Create Chat Session
- **Endpoint**: `POST /chat/sessions`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "title": "Programming FAQ"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Chat session created successfully",
  "data": {
    "_id": "603d2b7f0e9f1a001fb1e9f1",
    "userId": "user_normal_clerk_id_456",
    "title": "Programming FAQ",
    "createdAt": "2026-06-26T11:11:00.000Z",
    "updatedAt": "2026-06-26T11:11:00.000Z"
  }
}
```

### Get User Sessions
- **Endpoint**: `GET /chat/sessions`
- **Auth Required**: Yes
- **Query Parameters**:
  - `page`: default `1`
  - `limit`: default `10`
- **Response**:
```json
{
  "success": true,
  "message": "Chat history retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPage": 1
  },
  "data": [
    {
      "_id": "603d2b7f0e9f1a001fb1e9f1",
      "userId": "user_normal_clerk_id_456",
      "title": "Programming FAQ",
      "createdAt": "2026-06-26T11:11:00.000Z"
    }
  ]
}
```

### Get Session Messages
- **Endpoint**: `GET /chat/sessions/:sessionId/messages`
- **Auth Required**: Yes
- **Response**:
```json
{
  "success": true,
  "message": "Chat history retrieved successfully",
  "data": [
    {
      "_id": "603d2b7f0e9f1a001fb1e9fc",
      "sessionId": "603d2b7f0e9f1a001fb1e9f1",
      "role": "user",
      "content": "What is the second principle of SOLID?",
      "createdAt": "2026-06-26T11:12:00.000Z"
    },
    {
      "_id": "603d2b7f0e9f1a001fb1e9fd",
      "sessionId": "603d2b7f0e9f1a001fb1e9f1",
      "role": "assistant",
      "content": "The second SOLID principle is the Open-Closed Principle...",
      "createdAt": "2026-06-26T11:12:01.000Z"
    }
  ]
}
```

### Delete Chat Session
- **Endpoint**: `DELETE /chat/sessions/:sessionId`
- **Auth Required**: Yes
- **Response**:
```json
{
  "success": true,
  "message": "Chat session deleted successfully"
}
```

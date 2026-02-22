# CHAT-APPLICATION Backend

A Real-time one-on-one chat backend built with:

- Go (Gin)
- MongoDB
- JWT Authentication
- WebSocket Realtime Layer
- Clean Layered Architecture
- Conversation-First Design
- Multi-device WebSocket support

---

# Features

## Authentication

- User registration
- Unique username enforcement
- Unique email enforcement
- Bcrypt password hashing
- JWT login (24h expiry)
- Logout with token revocation
- Protected route middleware

---

## Conversations

- Explicit conversation creation
- Direct conversation type
- Duplicate conversation prevention
- Participant validation enforced in service layer
- Secure access control

---

## Messaging (HTTP)

- Send message to conversation
- Fetch conversation messages
- Service-layer authorization
- MongoDB persistence

---

## Realtime WebSocket Layer

- JWT-protected WebSocket endpoint
- Multi-tab support
- Multi-device support
- Proper client lifecycle management
- Secure participant validation
- DB persistence before broadcast
- Clean hub-based architecture

---

# Architecture

```
Controller → Service → Repository → MongoDB
                  ↓
                WebSocket Hub
```

### Layers

**Controllers**

- Handle HTTP & WebSocket upgrade

**Services**

- Business logic
- Authorization checks
- Conversation validation
- Message persistence

**Repositories**

- MongoDB access
- Query abstraction

**Middleware**

- JWT validation
- Token revocation check

**WebSocket Hub**

- Multi-connection per user
- Safe broadcast
- Proper unregister cleanup

---

# Project Structure

```
server/
├── app/
│   ├── app.go
│   └── dependencies.go
├── config/
├── controllers/
│   ├── auth_controller.go
│   ├── conversation_controller.go
│   ├── message_controller.go
│   └── ws_controller.go
├── services/
│   ├── auth_service.go
│   ├── conversation_service.go
│   ├── message_service.go
│   ├── token_service.go
│   └── ws_service.go
├── repositories/
│   ├── auth_repository.go
│   ├── conversation_repository.go
│   ├── message_repository.go
│   └── token_repository.go
├── middleware/
│   └── auth_middleware.go
├── models/
│   ├── user.go
│   ├── conversation.go
│   ├── message.go
│   └── revoked_token.go
├── routes/
│   ├── auth_routes.go
│   ├── conversation_routes.go
│   ├── message_routes.go
│   └── ws_routes.go
├── ws/
│   ├── hub.go
│   └── client.go
├── utils/
│   └── jwt.go
├── database/
│   └── mongo.go
├── cmd/api/main.go
├── .env
├── go.mod
└── README.md
```

---

# API Routes

## Authentication

| Method | Endpoint       | Auth Required |
| ------ | -------------- | ------------- |
| POST   | /auth/register | no            |
| POST   | /auth/login    | no            |
| POST   | /auth/logout   | yes           |

---

## Conversations

| Method | Endpoint       | Auth Required |
| ------ | -------------- | ------------- |
| POST   | /conversations | yes           |
| GET    | /conversations | yes           |

---

## Messages (HTTP)

| Method | Endpoint                    | Auth Required |
| ------ | --------------------------- | ------------- |
| POST   | /conversations/:id/messages | yes           |
| GET    | /conversations/:id/messages | yes           |

---

## WebSocket

| Endpoint | Auth Required |
| -------- | ------------- |
| GET /ws  | yes           |

JWT must be passed via header:

```
Authorization: Bearer <token>
```

---

# WebSocket Message Format

Client → Server:

```json
{
  "conversation_id": "OBJECT_ID",
  "content": "Hello"
}
```

Server → Clients:

```json
{
  "conversation_id": "OBJECT_ID",
  "sender_id": "USER_ID",
  "content": "Hello"
}
```

---

# Database Schema

## users

```json
{
  "_id": ObjectId,
  "username": "unique",
  "display_name": "string",
  "email": "unique",
  "password": "bcrypt_hash",
  "created_at": Date
}
```

---

## conversations

```json
{
  "_id": ObjectId,
  "type": "direct",
  "participants": ["userA_id", "userB_id"],
  "created_at": Date
}
```

---

## messages

```json
{
  "_id": ObjectId,
  "conversation_id": ObjectId,
  "sender_id": "user_id",
  "content": "text",
  "created_at": Date
}
```

---

# Setup

## 1️. Install

```
go mod tidy
```

---

## 2️. Configure `.env`

```
PORT=8080
MONGO_URI=mongodb://localhost:27017
DB_NAME=yapphere
JWT_SECRET=supersecretkey

CORS_ORIGINS=http://localhost:
```

---

## 3️. Run

```
go run cmd/api/main.go
```

Server:

```
http://localhost:8080
```

---

# Security Implemented

- JWT authentication
- Token revocation
- Middleware validation
- Service-layer conversation access check
- Duplicate conversation prevention
- Unique username enforcement
- Multi-connection WebSocket support
- Automatic socket cleanup

---

# Realtime Behavior

- User logs in
- Frontend connects to `/ws`
- Hub registers client
- Messages persist in DB first
- Then broadcast to all active connections of participants
- Multiple tabs supported
- Multiple devices supported

---

# Current Scope (MVP Realtime)

- No typing indicators
- No read receipts
- No presence system
- No pagination
- No rate limiting
- No Redis scaling

---

# Next Possible Improvements

- Online/offline presence
- Typing indicators
- Read receipts
- Message pagination
- Redis pub/sub scaling
- Horizontal scaling support
- Delivery acknowledgment
- Message queue system
- File uploads

---

# Status

- Secure authentication
- Direct conversations
- HTTP messaging
- Realtime WebSocket messaging
- Multi-device support
- Modular architecture
- Frontend-ready

---

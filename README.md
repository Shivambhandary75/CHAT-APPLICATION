#  CHAT-APPLICATION

A modern real-time chat platform that connects users with one-to-one and group messaging, secure authentication, and live WebSocket communication.



##  Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **Axios** - API requests
- **Zustand** - State management
- **Framer Motion** - UI animations

### Backend

- **Go 1.25** - Runtime language
- **Gin** - Web framework
- **MongoDB** - Database
- **MongoDB Go Driver v2** - Database driver
- **JWT** - Authentication
- **Bcrypt (x/crypto)** - Password hashing
- **Gorilla WebSocket** - Realtime messaging

### External Services

- **Cloudinary** - Media storage
- **MongoDB Atlas / Local MongoDB** - Persistent data

---

##  Installation

### Prerequisites

- Node.js **v20.19+** or **v22.12+**
- Go **1.25+**
- MongoDB (local or Atlas)
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/Shivambhandary75/CHAT-APPLICATION.git
cd CHAT-APPLICATION
```

### Step 2: Backend Setup

```bash
cd server
go mod tidy
```

Create a `.env` file in the `server` directory:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017
DB_NAME=chatapp
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGINS=http://localhost:5173
CLOUDINARY_URL=your_cloudinary_url_here
```

Start the backend server:

```bash
go run cmd/api/main.go
```

Backend will run on **http://localhost:8080**

### Step 3: Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend will run on **http://localhost:5173**

Optional `client/.env` (if backend URL differs):

```env
VITE_API_URL=http://localhost:8080
```

---

## Features

- User authentication (signup/login/logout)
-  Profile management with avatar upload
- One-to-one real-time messaging
- Group chat creation and management
-  Friend request system (send/accept/reject/cancel/remove)
-  WebSocket live message delivery
-  Conversation and message history
-  Live stats stream support
-  Protected routes with JWT and token revocation

---

##  Usage

1. **Sign Up** - Create a new account
2. **Login** - Authenticate and enter dashboard/chat
3. **Add Friends** - Search users and send friend requests
4. **Start Chatting** - Open direct conversations and exchange messages in real time
5. **Create Groups** - Build group conversations and manage participants
6. **Track Activity** - View conversations, messages, and stats updates

---


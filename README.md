<<<<<<< HEAD
# Student – Ntando

This repository contains all approved work, learning material, and project contributions completed by David as part of the Biko Today programme.

## Purpose
- Track skill development over time
- Store verifiable proof of work
- Maintain professional project documentation

## Rules (Non-Negotiable)
- Do not upload client credentials, API keys, tokens, or secrets.
- Do not upload raw client databases, exports, or private customer information.
- All client work must be anonymised unless written approval is given.
- Keep work structured and documented — no random uploads.

Failure to follow these rules may result in removal from the Biko Today programme and access revoked.
=======
# BIFA Platform

## Prerequisites
- Node.js (v18+)
- MySQL database

## Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```


3. Run Prisma migrations:
```bash
npx prisma migrate dev
```

4. Start backend:
```bash
cd projects
cd bifa-platform
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend:
```bash
cd projects
cd bifa-platform
cd frontend
npm run dev
  
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Running Both

Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
>>>>>>> a45aea49a30d9d26ae7466ad479ada7b294dd693

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

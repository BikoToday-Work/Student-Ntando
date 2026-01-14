# BIFA Platform - Setup Guide

## Quick Start

### 1. Start PostgreSQL Database

Using Docker Compose:
```bash
docker-compose up -d
```

This will start PostgreSQL on `localhost:5432` with:
- Database: `bifa_platform`
- User: `bifa_user`
- Password: `bifa_dev_password`

### 2. Backend Setup

```bash
cd backend

# Copy environment file
copy .env.example .env

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

## Portal Routes

- **Admin Portal**: http://localhost:3000/admin
- **Referee Portal**: http://localhost:3000/referee
- **Secretariat Portal**: http://localhost:3000/secretariat
- **Public Portal**: http://localhost:3000/public

## Database Management

View database with Prisma Studio:
```bash
cd backend
npx prisma studio
```

## CI/CD

GitHub Actions will automatically:
- Run tests on push/PR
- Check linting
- Validate TypeScript types
- Build frontend

## Architecture

See [architecture.md](./architecture.md) for system design details.

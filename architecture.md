# BIFA Platform - High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Admin   │  │ Referee  │  │  Public  │  │ Secretariat  │   │
│  │  Portal  │  │  Portal  │  │  Portal  │  │   Portal     │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │             │              │                │            │
│       └─────────────┴──────────────┴────────────────┘            │
│                            │                                      │
│                    Next.js Frontend                              │
│                    (Port 3000)                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS/REST API
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                      APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Express.js API Server                        │  │
│  │                  (Port 5000)                              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Auth      │  Users   │  Teams   │  Athletes │  Comps   │  │
│  │  Routes    │  Routes  │  Routes  │  Routes   │  Routes  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Middleware Layer                             │  │
│  │  • JWT Authentication                                     │  │
│  │  • Role-Based Access Control (RBAC)                      │  │
│  │  • Request Validation                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Prisma ORM                                   │  │
│  │  • Schema Management                                      │  │
│  │  • Query Builder                                          │  │
│  │  • Migrations                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ SQL Queries
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                          │  │
│  │                                                            │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────────┐    │  │
│  │  │ Users  │  │ Roles  │  │ Teams  │  │  Athletes  │    │  │
│  │  └────────┘  └────────┘  └────────┘  └────────────┘    │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ Competitions │  │   Results    │  │   Events     │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       CI/CD PIPELINE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  GitHub Actions                                                  │
│  ├─ Lint Check (ESLint)                                         │
│  ├─ Type Check (TypeScript)                                     │
│  ├─ Test Run (Jest/Vitest)                                      │
│  └─ Build Validation                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components

### Frontend (Next.js)
- **Admin Portal**: User management, system configuration
- **Referee Portal**: Match scoring, result submission
- **Public Portal**: Competition viewing, results
- **Secretariat Portal**: Competition management, scheduling

### Backend (Express.js + Prisma)
- RESTful API endpoints
- JWT-based authentication
- Role-based authorization
- Database abstraction via Prisma ORM

### Database (PostgreSQL)
- User authentication & authorization
- Team and athlete management
- Competition and event tracking
- Results and scoring data

### CI/CD (GitHub Actions)
- Automated testing
- Code quality checks
- Build validation
- Deployment automation

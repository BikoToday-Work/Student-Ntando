# API Routing Setup

## Frontend Routes (React Router)

### Public Routes
- `/` - Landing page
- `/login` - User authentication
- `/register` - User registration
- `/architecture` - System architecture view

### Protected Routes (Authentication Required)

#### Dashboard Routes
- `/dashboard` - Main dashboard
- `/dashboard/team-manager` - Team manager dashboard
- `/dashboard/governance` - Governance management

#### Competition Management
- `/dashboard/competitions` - Competitions list
- `/dashboard/create-competition` - Create new competition
- `/dashboard/competition-entries` - Competition entries
- `/dashboard/competition-entries/:id` - Manage specific competition entries

#### Team & Player Management
- `/dashboard/teams` - Teams management
- `/dashboard/players` - Players registry
- `/dashboard/squad-management` - Squad management (admin)
- `/dashboard/squad-management-team` - Squad management (team)
- `/dashboard/player-transfer` - Player transfers (admin)
- `/dashboard/player-transfer-team` - Player transfers (team)
- `/dashboard/player-suspension` - Player suspensions

#### Match Management
- `/dashboard/match-scheduling` - Schedule matches
- `/dashboard/match-results` - Match results
- `/dashboard/match-reports` - Match reports

#### Referee Management
- `/dashboard/referees` - Referee registry
- `/dashboard/assign-referees` - Assign referees to matches
- `/dashboard/referee-assignments` - Referee assignments
- `/dashboard/referee-suspensions` - Referee suspensions
- `/dashboard/referee-dashboard` - Referee dashboard
- `/dashboard/referee-debug` - Referee debug tools

#### Administrative
- `/dashboard/disciplinary` - Disciplinary cases
- `/dashboard/issue-sanction` - Issue sanctions
- `/dashboard/secretariat` - Secretariat tasks
- `/dashboard/user-management` - User management
- `/dashboard/audit-logs` - Audit logs
- `/dashboard/federation-management` - Federation management
- `/dashboard/document-upload` - Document uploads
- `/dashboard/stats` - Statistics
- `/dashboard/change-password` - Change password

#### Error Handling
- `*` - 404 Not Found page

## Backend API Endpoints (Supabase)

### Teams API
- `GET /teams` - Fetch all teams (ordered by points)
- `POST /teams` - Create new team
- `PATCH /teams/:id` - Update team

### Players API
- `GET /players` - Fetch all players (ordered by rating)
- `POST /players` - Create new player
- `PATCH /players/:id` - Update player

### Matches API
- `GET /matches` - Fetch all matches (ordered by kickoff time)
- `GET /matches?status=live` - Fetch live matches
- `POST /matches` - Create new match
- `PATCH /matches/:id` - Update match score
- `DELETE /matches/:id` - Delete match

### Referees API
- `GET /referees` - Fetch all referees (ordered by rating)
- `POST /referees` - Create new referee
- `PATCH /referees/:id` - Update referee
- `GET /referee_suspensions` - Fetch suspensions (optional: filter by referee_id)
- `POST /referee_suspensions` - Create suspension
- `PATCH /referee_suspensions/:id` - Update suspension status
- `GET /referee_assignments` - Fetch assignments (optional: filter by referee_id)
- `POST /referee_assignments` - Assign referee to match
- `PATCH /referee_assignments/:id` - Respond to assignment (accept/decline)
- `GET /match_reports` - Fetch match reports (optional: filter by referee_id)
- `POST /match_reports` - Create match report
- `PATCH /match_reports/:id` - Update match report
- `PATCH /match_reports/:id/submit` - Submit match report

### Disciplinary API
- `GET /disciplinary_cases` - Fetch all cases (ordered by date)
- `POST /disciplinary_cases` - Create new case
- `PATCH /disciplinary_cases/:id` - Update case status

### Secretariat API
- `GET /secretariat_tasks` - Fetch all tasks (ordered by due date)
- `POST /secretariat_tasks` - Create new task
- `PATCH /secretariat_tasks/:id` - Update task status

### Audit API
- `POST /audit_logs` - Create audit log entry
- `GET /audit_logs?limit=50` - Fetch recent logs

### Notifications API
- `GET /notifications` - Fetch all notifications (optional: filter by user_name)
- `POST /notifications` - Create notification
- `PATCH /notifications/:id` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read for user

## Authentication

Protected routes use `ProtectedRoute` component that checks authentication status via `AuthContext`. Unauthenticated users are redirected to `/login`.

## Environment Variables

```
VITE_SUPABASE_URL=<supabase_project_url>
VITE_SUPABASE_ANON_KEY=<supabase_anon_key>
```

## API Client

All API calls use Supabase client (`@/lib/supabase`) with automatic error handling and data transformation.

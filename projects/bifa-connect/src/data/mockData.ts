// ============================================
// BIFA Mock Data — All timestamps in UTC ISO 8601
// ============================================

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  competition: string;
  kickoffUtc: string; // Always UTC ISO 8601
  venue: string;
  venueCountry: string;
  venueTimezone: string;
  refereeId: string;
  refereeName: string;
  status: 'scheduled' | 'live' | 'completed' | 'postponed';
  homeScore?: number;
  awayScore?: number;
  round: string;
}

export interface Player {
  id: string;
  name: string;
  country: string;
  flag: string;
  teamId: string;
  teamName: string;
  position: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
  age: number;
  nationality: string;
  status: 'active' | 'suspended' | 'injured';
  registeredAt: string; // UTC ISO 8601
}

export interface Team {
  id: string;
  name: string;
  country: string;
  flag: string;
  league: string;
  manager: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: string[];
}

export interface Referee {
  id: string;
  name: string;
  country: string;
  flag: string;
  timezone: string;
  level: 'FIFA' | 'Continental' | 'National';
  matchesOfficiated: number;
  yellowCardsIssued: number;
  redCardsIssued: number;
  status: 'active' | 'suspended' | 'retired';
  registeredAt: string;
  certifications: string[];
}

export interface DisciplinaryCase {
  id: string;
  playerId: string;
  playerName: string;
  teamName: string;
  type: 'yellow_card' | 'red_card' | 'misconduct' | 'doping' | 'match_fixing';
  description: string;
  matchId: string;
  reportedAt: string; // UTC ISO 8601
  status: 'open' | 'under_review' | 'hearing_scheduled' | 'resolved' | 'appealed';
  sanction?: string;
  reportedBy: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface GovernanceDocument {
  id: string;
  title: string;
  category: 'statute' | 'regulation' | 'circular' | 'resolution' | 'policy' | 'report';
  version: string;
  status: 'draft' | 'under_review' | 'approved' | 'archived';
  uploadedBy: string;
  uploadedAt: string; // UTC ISO 8601
  approvedBy?: string;
  approvedAt?: string;
  description: string;
  fileSize: string;
  changeLog: Array<{ version: string; changedAt: string; changedBy: string; notes: string }>;
}

export interface SecretariatTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  dueDate: string; // UTC ISO 8601
  createdAt: string;
  category: 'correspondence' | 'governance' | 'competition' | 'finance' | 'hr' | 'technical';
  completedAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  entityId?: string;
  timestampUtc: string; // UTC ISO 8601
  userTimezone: string;
  ipAddress: string;
  details: string;
}

// ============================================
// MATCHES — Demonstrating cross-timezone scheduling
// ============================================
export const matches: Match[] = [
  {
    id: 'match_001',
    homeTeam: 'Flamengo',
    awayTeam: 'Mumbai City FC',
    homeFlag: '🇧🇷',
    awayFlag: '🇮🇳',
    competition: 'BIFA Champions Cup 2026',
    kickoffUtc: '2026-07-21T18:30:00Z', // 15:30 São Paulo | 00:00 Mumbai (next day)
    venue: 'Maracanã Stadium',
    venueCountry: 'Brazil',
    venueTimezone: 'America/Sao_Paulo',
    refereeId: 'ref_001',
    refereeName: 'Chen Wei',
    status: 'scheduled',
    round: 'Group Stage - MD1',
  },
  {
    id: 'match_002',
    homeTeam: 'CSKA Moscow',
    awayTeam: 'Chennayin FC',
    homeFlag: '🇷🇺',
    awayFlag: '🇮🇳',
    competition: 'BIFA Champions Cup 2026',
    kickoffUtc: '2026-07-22T14:00:00Z', // 17:00 Moscow | 19:30 Mumbai
    venue: 'Luzhniki Stadium',
    venueCountry: 'Russia',
    venueTimezone: 'Europe/Moscow',
    refereeId: 'ref_002',
    refereeName: 'Sipho Dlamini',
    status: 'scheduled',
    round: 'Group Stage - MD1',
  },
  {
    id: 'match_003',
    homeTeam: 'Mamelodi Sundowns',
    awayTeam: 'Beijing Guoan',
    homeFlag: '🇿🇦',
    awayFlag: '🇨🇳',
    competition: 'BIFA Champions Cup 2026',
    kickoffUtc: '2026-07-20T15:00:00Z', // 17:00 Johannesburg | 23:00 Beijing
    venue: 'FNB Stadium',
    venueCountry: 'South Africa',
    venueTimezone: 'Africa/Johannesburg',
    refereeId: 'ref_003',
    refereeName: 'Raj Kumar',
    status: 'completed',
    homeScore: 2,
    awayScore: 1,
    round: 'Group Stage - MD0',
  },
  {
    id: 'match_004',
    homeTeam: 'Shanghai Port',
    awayTeam: 'Fluminense',
    homeFlag: '🇨🇳',
    awayFlag: '🇧🇷',
    competition: 'BIFA U-23 League',
    kickoffUtc: '2026-07-23T10:00:00Z', // 18:00 Shanghai | 07:00 São Paulo
    venue: 'Hongkou Stadium',
    venueCountry: 'China',
    venueTimezone: 'Asia/Shanghai',
    refereeId: 'ref_001',
    refereeName: 'Chen Wei',
    status: 'scheduled',
    round: 'Quarter Final',
  },
  {
    id: 'match_005',
    homeTeam: 'Mohun Bagan',
    awayTeam: 'Spartak Moscow',
    homeFlag: '🇮🇳',
    awayFlag: '🇷🇺',
    competition: 'BIFA Champions Cup 2026',
    kickoffUtc: '2026-07-19T12:30:00Z',
    venue: 'Salt Lake Stadium',
    venueCountry: 'India',
    venueTimezone: 'Asia/Kolkata',
    refereeId: 'ref_004',
    refereeName: 'Ana Oliveira',
    status: 'live',
    homeScore: 1,
    awayScore: 1,
    round: 'Group Stage - MD0',
  },
];

export const players: Player[] = [
  { id: 'p001', name: 'Gabriel Santos', country: 'Brazil', flag: '🇧🇷', teamId: 't001', teamName: 'Flamengo', position: 'Forward', goals: 18, assists: 7, yellowCards: 3, redCards: 0, appearances: 24, age: 26, nationality: 'Brazilian', status: 'active', registeredAt: '2025-01-15T08:00:00Z' },
  { id: 'p002', name: 'Arjun Mehta', country: 'India', flag: '🇮🇳', teamId: 't002', teamName: 'Mumbai City FC', position: 'Midfielder', goals: 8, assists: 14, yellowCards: 5, redCards: 1, appearances: 22, age: 24, nationality: 'Indian', status: 'active', registeredAt: '2025-01-20T09:30:00Z' },
  { id: 'p003', name: 'Dmitri Volkov', country: 'Russia', flag: '🇷🇺', teamId: 't003', teamName: 'CSKA Moscow', position: 'Defender', goals: 2, assists: 3, yellowCards: 7, redCards: 0, appearances: 20, age: 28, nationality: 'Russian', status: 'active', registeredAt: '2025-02-01T07:00:00Z' },
  { id: 'p004', name: 'Li Xiao Ming', country: 'China', flag: '🇨🇳', teamId: 't004', teamName: 'Shanghai Port', position: 'Goalkeeper', goals: 0, assists: 0, yellowCards: 1, redCards: 0, appearances: 23, age: 30, nationality: 'Chinese', status: 'active', registeredAt: '2025-01-10T06:00:00Z' },
  { id: 'p005', name: 'Thabo Nkosi', country: 'South Africa', flag: '🇿🇦', teamId: 't005', teamName: 'Mamelodi Sundowns', position: 'Winger', goals: 12, assists: 9, yellowCards: 2, redCards: 0, appearances: 21, age: 22, nationality: 'South African', status: 'active', registeredAt: '2025-03-05T10:00:00Z' },
  { id: 'p006', name: 'Fernando Cruz', country: 'Brazil', flag: '🇧🇷', teamId: 't001', teamName: 'Flamengo', position: 'Forward', goals: 15, assists: 5, yellowCards: 4, redCards: 1, appearances: 20, age: 27, nationality: 'Brazilian', status: 'suspended', registeredAt: '2025-01-18T08:00:00Z' },
  { id: 'p007', name: 'Rahul Singh', country: 'India', flag: '🇮🇳', teamId: 't006', teamName: 'Mohun Bagan', position: 'Midfielder', goals: 6, assists: 11, yellowCards: 3, redCards: 0, appearances: 19, age: 25, nationality: 'Indian', status: 'injured', registeredAt: '2025-02-14T09:00:00Z' },
];

export const teams: Team[] = [
  { id: 't001', name: 'Flamengo', country: 'Brazil', flag: '🇧🇷', league: 'BIFA Champions Cup', manager: 'Carlos Silva', played: 6, won: 5, drawn: 1, lost: 0, goalsFor: 18, goalsAgainst: 6, points: 16, form: ['W','W','W','D','W','W'] },
  { id: 't005', name: 'Mamelodi Sundowns', country: 'South Africa', flag: '🇿🇦', league: 'BIFA Champions Cup', manager: 'Pitso Mosimane', played: 6, won: 4, drawn: 1, lost: 1, goalsFor: 13, goalsAgainst: 7, points: 13, form: ['W','L','W','W','D','W'] },
  { id: 't004', name: 'Shanghai Port', country: 'China', flag: '🇨🇳', league: 'BIFA Champions Cup', manager: 'Zhang Wei', played: 6, won: 4, drawn: 0, lost: 2, goalsFor: 12, goalsAgainst: 9, points: 12, form: ['W','W','L','W','W','L'] },
  { id: 't003', name: 'CSKA Moscow', country: 'Russia', flag: '🇷🇺', league: 'BIFA Champions Cup', manager: 'Ivan Sorokin', played: 6, won: 3, drawn: 2, lost: 1, goalsFor: 10, goalsAgainst: 6, points: 11, form: ['D','W','W','D','L','W'] },
  { id: 't002', name: 'Mumbai City FC', country: 'India', flag: '🇮🇳', league: 'BIFA Champions Cup', manager: 'Raj Shetty', played: 6, won: 3, drawn: 1, lost: 2, goalsFor: 9, goalsAgainst: 10, points: 10, form: ['W','L','W','D','W','L'] },
  { id: 't006', name: 'Mohun Bagan', country: 'India', flag: '🇮🇳', league: 'BIFA Champions Cup', manager: 'Anand Kumar', played: 6, won: 2, drawn: 2, lost: 2, goalsFor: 8, goalsAgainst: 9, points: 8, form: ['D','W','L','W','D','L'] },
  { id: 't007', name: 'Beijing Guoan', country: 'China', flag: '🇨🇳', league: 'BIFA Champions Cup', manager: 'Li Ming', played: 6, won: 2, drawn: 1, lost: 3, goalsFor: 7, goalsAgainst: 12, points: 7, form: ['W','L','D','L','W','L'] },
  { id: 't008', name: 'Spartak Moscow', country: 'Russia', flag: '🇷🇺', league: 'BIFA Champions Cup', manager: 'Pavel Morozov', played: 6, won: 1, drawn: 2, lost: 3, goalsFor: 6, goalsAgainst: 11, points: 5, form: ['L','D','L','W','D','L'] },
];

export const referees: Referee[] = [
  { id: 'ref_001', name: 'Chen Wei', country: 'China', flag: '🇨🇳', timezone: 'Asia/Shanghai', level: 'FIFA', matchesOfficiated: 87, yellowCardsIssued: 312, redCardsIssued: 18, status: 'active', registeredAt: '2020-03-15T00:00:00Z', certifications: ['FIFA Elite Panel', 'VAR Certified', 'Anti-Doping'] },
  { id: 'ref_002', name: 'Sipho Dlamini', country: 'South Africa', flag: '🇿🇦', timezone: 'Africa/Johannesburg', level: 'Continental', matchesOfficiated: 54, yellowCardsIssued: 198, redCardsIssued: 12, status: 'active', registeredAt: '2021-06-20T00:00:00Z', certifications: ['BIFA Continental Panel', 'Anti-Doping'] },
  { id: 'ref_003', name: 'Raj Kumar', country: 'India', flag: '🇮🇳', timezone: 'Asia/Kolkata', level: 'FIFA', matchesOfficiated: 102, yellowCardsIssued: 387, redCardsIssued: 24, status: 'active', registeredAt: '2018-09-10T00:00:00Z', certifications: ['FIFA Elite Panel', 'VAR Certified', 'Goal-Line Tech', 'Anti-Doping'] },
  { id: 'ref_004', name: 'Ana Oliveira', country: 'Brazil', flag: '🇧🇷', timezone: 'America/Sao_Paulo', level: 'FIFA', matchesOfficiated: 73, yellowCardsIssued: 256, redCardsIssued: 15, status: 'active', registeredAt: '2019-11-05T00:00:00Z', certifications: ['FIFA Elite Panel', 'Women\'s Football Certified'] },
  { id: 'ref_005', name: 'Alexei Sokolov', country: 'Russia', flag: '🇷🇺', timezone: 'Europe/Moscow', level: 'National', matchesOfficiated: 31, yellowCardsIssued: 124, redCardsIssued: 5, status: 'suspended', registeredAt: '2022-02-18T00:00:00Z', certifications: ['BIFA National Panel'] },
];

export const disciplinaryCases: DisciplinaryCase[] = [
  {
    id: 'disc_001',
    playerId: 'p006',
    playerName: 'Fernando Cruz',
    teamName: 'Flamengo',
    type: 'misconduct',
    description: 'Violent conduct — elbow strike on opponent in minute 78',
    matchId: 'match_001',
    reportedAt: '2026-07-18T20:45:00Z',
    status: 'hearing_scheduled',
    reportedBy: 'Match Referee: Chen Wei',
    severity: 'high',
  },
  {
    id: 'disc_002',
    playerId: 'p002',
    playerName: 'Arjun Mehta',
    teamName: 'Mumbai City FC',
    type: 'yellow_card',
    description: 'Accumulation of 5 yellow cards — automatic suspension',
    matchId: 'match_002',
    reportedAt: '2026-07-17T16:30:00Z',
    status: 'resolved',
    sanction: '1 match ban (served)',
    reportedBy: 'Automated — System',
    severity: 'low',
  },
  {
    id: 'disc_003',
    playerId: 'p003',
    playerName: 'Dmitri Volkov',
    teamName: 'CSKA Moscow',
    type: 'misconduct',
    description: 'Alleged racial abuse directed at opposing player',
    matchId: 'match_004',
    reportedAt: '2026-07-16T18:00:00Z',
    status: 'under_review',
    reportedBy: 'Team Delegate: Mumbai City FC',
    severity: 'critical',
  },
];

export const governanceDocuments: GovernanceDocument[] = [
  {
    id: 'doc_001',
    title: 'BIFA Constitution & Statutes 2026',
    category: 'statute',
    version: '3.2',
    status: 'approved',
    uploadedBy: 'Kofi Mensah (Super Admin)',
    uploadedAt: '2026-01-10T09:00:00Z',
    approvedBy: 'BIFA Executive Committee',
    approvedAt: '2026-01-20T14:00:00Z',
    description: 'Core constitutional document governing all BIFA operations, member rights, and federation structure.',
    fileSize: '2.4 MB',
    changeLog: [
      { version: '3.2', changedAt: '2026-01-10T09:00:00Z', changedBy: 'Kofi Mensah', notes: 'Updated BRICS+ expansion clauses' },
      { version: '3.1', changedAt: '2025-06-15T10:00:00Z', changedBy: 'Legal Team', notes: 'Added anti-doping provisions' },
      { version: '3.0', changedAt: '2025-01-01T00:00:00Z', changedBy: 'BIFA Congress', notes: 'Major revision — 2025 Congress' },
    ],
  },
  {
    id: 'doc_002',
    title: 'BIFA Competition Regulations 2026',
    category: 'regulation',
    version: '2.0',
    status: 'approved',
    uploadedBy: 'Priya Sharma (Fed Admin)',
    uploadedAt: '2026-02-05T11:00:00Z',
    approvedBy: 'Priya Sharma',
    approvedAt: '2026-02-12T16:30:00Z',
    description: 'Complete regulations for all BIFA-sanctioned competitions including Champions Cup and U-23 League.',
    fileSize: '1.8 MB',
    changeLog: [
      { version: '2.0', changedAt: '2026-02-05T11:00:00Z', changedBy: 'Priya Sharma', notes: 'Full revision for 2026 season' },
    ],
  },
  {
    id: 'doc_003',
    title: 'Disciplinary Code & Procedures',
    category: 'regulation',
    version: '1.5',
    status: 'under_review',
    uploadedBy: 'Ivan Petrov (Secretariat)',
    uploadedAt: '2026-02-14T08:30:00Z',
    description: 'Disciplinary procedures, sanctions matrix, and appeals process for all BIFA members.',
    fileSize: '0.9 MB',
    changeLog: [
      { version: '1.5', changedAt: '2026-02-14T08:30:00Z', changedBy: 'Ivan Petrov', notes: 'Added MFA requirement for submissions' },
      { version: '1.4', changedAt: '2025-10-01T09:00:00Z', changedBy: 'Legal Team', notes: 'Updated red card review timelines' },
    ],
  },
  {
    id: 'doc_004',
    title: 'Anti-Doping Policy 2026',
    category: 'policy',
    version: '2.1',
    status: 'approved',
    uploadedBy: 'Kofi Mensah (Super Admin)',
    uploadedAt: '2026-01-25T10:00:00Z',
    approvedBy: 'BIFA Medical Committee',
    approvedAt: '2026-02-01T12:00:00Z',
    description: 'WADA-compliant anti-doping framework for all BIFA-affiliated athletes and support personnel.',
    fileSize: '1.1 MB',
    changeLog: [
      { version: '2.1', changedAt: '2026-01-25T10:00:00Z', changedBy: 'Dr. Sharma', notes: 'Aligned with WADA 2026 code' },
    ],
  },
];

export const secretariatTasks: SecretariatTask[] = [
  {
    id: 'task_001',
    title: 'Prepare BIFA Congress Agenda — July 2026',
    description: 'Draft comprehensive agenda for the BIFA Annual Congress including all submitted motions, financial reports, and election procedures.',
    assignedTo: 'Ivan Petrov',
    assignedBy: 'Kofi Mensah',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-07-10T17:00:00Z',
    createdAt: '2026-06-15T09:00:00Z',
    category: 'governance',
  },
  {
    id: 'task_002',
    title: 'Coordinate Champions Cup Match Officials',
    description: 'Assign and confirm referees, assistant referees, and 4th officials for all Group Stage matches.',
    assignedTo: 'Ivan Petrov',
    assignedBy: 'Priya Sharma',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: '2026-07-19T12:00:00Z',
    createdAt: '2026-07-01T08:00:00Z',
    category: 'competition',
  },
  {
    id: 'task_003',
    title: 'Process New Member Association Applications',
    description: 'Review and process 3 new national association applications — Egypt, Saudi Arabia, UAE.',
    assignedTo: 'Ivan Petrov',
    assignedBy: 'Kofi Mensah',
    priority: 'medium',
    status: 'review',
    dueDate: '2026-07-25T17:00:00Z',
    createdAt: '2026-06-20T10:00:00Z',
    category: 'governance',
  },
  {
    id: 'task_004',
    title: 'Translate Disciplinary Code to Russian & Hindi',
    description: 'Coordinate professional translation of the Disciplinary Code document for Russian and Indian member associations.',
    assignedTo: 'Ivan Petrov',
    assignedBy: 'Ivan Petrov',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-08-01T17:00:00Z',
    createdAt: '2026-07-01T09:00:00Z',
    category: 'correspondence',
  },
  {
    id: 'task_005',
    title: 'Q2 Financial Report Compilation',
    description: 'Compile Q2 2026 financial statements from all 5 member federations and prepare consolidated BIFA report.',
    assignedTo: 'Priya Sharma',
    assignedBy: 'Kofi Mensah',
    priority: 'high',
    status: 'completed',
    dueDate: '2026-07-15T17:00:00Z',
    createdAt: '2026-07-01T08:00:00Z',
    category: 'finance',
    completedAt: '2026-07-13T14:30:00Z',
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: 'log_001',
    userId: 'usr_001',
    userName: 'Kofi Mensah',
    userRole: 'super_admin',
    action: 'DOCUMENT_APPROVED',
    module: 'Governance',
    entityId: 'doc_001',
    timestampUtc: '2026-01-20T14:00:00Z',
    userTimezone: 'Africa/Johannesburg',
    ipAddress: '196.25.x.x',
    details: 'Approved BIFA Constitution & Statutes 2026 v3.2',
  },
  {
    id: 'log_002',
    userId: 'usr_002',
    userName: 'Priya Sharma',
    userRole: 'federation_admin',
    action: 'PLAYER_REGISTERED',
    module: 'Athlete Management',
    entityId: 'p007',
    timestampUtc: '2026-02-14T09:00:00Z',
    userTimezone: 'Asia/Kolkata',
    ipAddress: '103.21.x.x',
    details: 'Registered player Rahul Singh for Mohun Bagan',
  },
  {
    id: 'log_003',
    userId: 'usr_003',
    userName: 'Ivan Petrov',
    userRole: 'secretariat_officer',
    action: 'TASK_COMPLETED',
    module: 'Secretariat',
    entityId: 'task_005',
    timestampUtc: '2026-07-13T11:30:00Z',
    userTimezone: 'Europe/Moscow',
    ipAddress: '77.88.x.x',
    details: 'Completed Q2 Financial Report Compilation',
  },
  {
    id: 'log_004',
    userId: 'usr_001',
    userName: 'Kofi Mensah',
    userRole: 'super_admin',
    action: 'DISCIPLINARY_CASE_OPENED',
    module: 'Disciplinary',
    entityId: 'disc_003',
    timestampUtc: '2026-07-16T18:00:00Z',
    userTimezone: 'Africa/Johannesburg',
    ipAddress: '196.25.x.x',
    details: 'Opened critical misconduct case against Dmitri Volkov — alleged racial abuse',
  },
];

export const competitions = [
  {
    id: 'comp_001',
    name: 'BIFA Champions Cup 2026',
    type: 'Club',
    season: '2025/26',
    status: 'active',
    teams: 8,
    matches: 28,
    startDate: '2026-07-01T00:00:00Z',
    endDate: '2026-09-30T00:00:00Z',
    hostCountry: 'Multiple',
    prize: '$2,000,000',
  },
  {
    id: 'comp_002',
    name: 'BIFA U-23 League 2026',
    type: 'Club',
    season: '2025/26',
    status: 'active',
    teams: 6,
    matches: 15,
    startDate: '2026-07-15T00:00:00Z',
    endDate: '2026-08-31T00:00:00Z',
    hostCountry: 'China',
    prize: '$500,000',
  },
  {
    id: 'comp_003',
    name: 'BRICS Nations Cup 2026',
    type: 'International',
    season: '2026',
    status: 'upcoming',
    teams: 10,
    matches: 22,
    startDate: '2026-11-01T00:00:00Z',
    endDate: '2026-11-20T00:00:00Z',
    hostCountry: 'India',
    prize: '$1,000,000',
  },
];

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://brics-nu3e.vercel.app',
    'https://brics-five.vercel.app', 
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const governanceRoutes = require('./routes/governanceRoutes');
const refereeRoutes = require('./routes/refereeRoutesNew');

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'BIFA Backend API', 
    status: 'running',
    timestamp: new Date().toISOString(),
    features: ['CMS', 'Governance', 'Referee Registry', 'Disciplinary Reports']
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api', refereeRoutes);

// Legacy mock endpoints for backward compatibility
app.get('/api/competitions', (req, res) => {
  res.json([
    { id: 1, name: 'BRICS Cup 2024', season: '2024', teams: [] },
    { id: 2, name: 'Championship League', season: '2024', teams: [] }
  ]);
});

app.get('/api/competitions/matches', (req, res) => {
  res.json([
    { id: 1, homeTeam: 'Brazil', awayTeam: 'Russia', date: '2024-02-15', time: '15:00', venue: 'Stadium A' },
    { id: 2, homeTeam: 'India', awayTeam: 'China', date: '2024-02-16', time: '18:00', venue: 'Stadium B' }
  ]);
});

app.get('/api/football/teams', (req, res) => {
  res.json([
    { id: 1, name: 'Brazil National Team', league: 'International' },
    { id: 2, name: 'Argentina National Team', league: 'International' }
  ]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 BIFA Backend running on http://localhost:${PORT}`);
  console.log('✅ Features: CMS, Governance, Referee Registry, Disciplinary Reports');
});

module.exports = app;

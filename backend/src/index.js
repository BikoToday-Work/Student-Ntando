const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// In-memory storage for testing
let users = [];
let pages = [];
let news = [];

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'BIFA Backend API', 
    status: 'running',
    timestamp: new Date().toISOString(),
    features: ['CMS', 'Governance', 'Referee Registry', 'Disciplinary Reports']
  });
});

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'TEAM_MANAGER' } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      createdAt: new Date()
    };

    users.push(user);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CMS endpoints
app.get('/api/cms/pages', (req, res) => {
  const { language = 'en' } = req.query;
  const filteredPages = pages.filter(p => p.language === language);
  res.json(filteredPages);
});

app.post('/api/cms/pages', (req, res) => {
  const { title, slug, content, language = 'en', status = 'DRAFT' } = req.body;
  
  const page = {
    id: Date.now().toString(),
    title,
    slug,
    content,
    language,
    status,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  pages.push(page);
  res.status(201).json(page);
});

app.get('/api/cms/news', (req, res) => {
  const { language = 'en' } = req.query;
  const filteredNews = news.filter(n => n.language === language);
  res.json({ data: filteredNews });
});

app.post('/api/cms/news', (req, res) => {
  const { title, content, excerpt, language = 'en', status = 'DRAFT', category } = req.body;
  
  const article = {
    id: Date.now().toString(),
    title,
    content,
    excerpt,
    language,
    status,
    category,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: { firstName: 'Admin', lastName: 'User' }
  };
  
  news.push(article);
  res.status(201).json(article);
});

// Legacy endpoints
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

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 BIFA Backend running on http://localhost:${PORT}`);
  console.log('✅ Features: CMS, Auth (simplified for testing)');
});

module.exports = app;
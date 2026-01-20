const express = require('express');
const cors = require('cors');

const app = express();

// Simple CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Health check
app.get("/", (req, res) => {
  try {
    res.json({ 
      message: "BIFA Backend API", 
      status: "running",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello-World" });
});

// Mock API endpoints
app.get("/api/competitions", (req, res) => {
  res.json([
    { id: 1, name: "BRICS Cup 2024", season: "2024", teams: [] },
    { id: 2, name: "Championship League", season: "2024", teams: [] }
  ]);
});

app.get("/api/competitions/matches", (req, res) => {
  res.json([
    { id: 1, homeTeam: "Brazil", awayTeam: "Russia", date: "2024-02-15", time: "15:00", venue: "Stadium A" },
    { id: 2, homeTeam: "India", awayTeam: "China", date: "2024-02-16", time: "18:00", venue: "Stadium B" }
  ]);
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  if (email === "admin@bifa.com" && password === "admin123") {
    res.json({
      token: "mock-jwt-token",
      user: {
        id: 1,
        email: "admin@bifa.com",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN"
      }
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/football/teams", (req, res) => {
  res.json([
    { id: 1, name: "Brazil National Team", league: "International" },
    { id: 2, name: "Argentina National Team", league: "International" }
  ]);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
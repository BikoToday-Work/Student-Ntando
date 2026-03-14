import express from 'express';

const router = express.Router();

// Simple test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is running!', 
    timestamp: new Date().toISOString(),
    endpoints: {
      football: '/api/football/*',
      auth: '/api/auth/*',
      users: '/api/users'
    }
  });
});

export default router;
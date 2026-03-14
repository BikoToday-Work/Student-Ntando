import express from 'express';
import { createMatch, getMatches, getMatchById, updateMatch, deleteMatch } from '../controllers/matchController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getMatches);
router.get('/:id', getMatchById);

// Protected routes
router.post('/', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), createMatch);
router.put('/:id', authenticateToken, requireRole('ADMIN', 'SECRETARIAT', 'REFEREE'), updateMatch);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteMatch);

export default router;

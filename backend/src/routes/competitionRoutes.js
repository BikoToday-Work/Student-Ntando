import express from 'express';
import {
  createCompetition,
  getCompetitions,
  getCompetitionById,
  updateCompetition,
  deleteCompetition,
  getCompetitionStandings,
  createMatch,
  getMatches,
  getMatchById,
  updateMatch,
  deleteMatch,
  getLiveMatches,
  createMatchEvent,
  getMatchEvents,
  createMatchStatistics,
  getMatchStatistics,
  updateMatchScore
} from '../controllers/competitionController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Competition Management
router.post('/competitions', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), createCompetition);
router.get('/competitions', getCompetitions); // Public
router.get('/competitions/:id', getCompetitionById); // Public
router.put('/competitions/:id', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), updateCompetition);
router.delete('/competitions/:id', authenticateToken, requireRole('ADMIN'), deleteCompetition);
router.get('/competitions/:id/standings', getCompetitionStandings); // Public

// Match Management
router.post('/matches', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), createMatch);
router.get('/matches', getMatches); // Public
router.get('/matches/:id', getMatchById); // Public
router.put('/matches/:id', authenticateToken, requireRole('ADMIN', 'SECRETARIAT', 'REFEREE'), updateMatch);
router.delete('/matches/:id', authenticateToken, requireRole('ADMIN'), deleteMatch);
router.get('/matches/live', getLiveMatches); // Public

// Match Events & Statistics
router.post('/matches/:id/events', authenticateToken, requireRole('REFEREE', 'ADMIN'), createMatchEvent);
router.get('/matches/:id/events', getMatchEvents); // Public
router.post('/matches/:id/statistics', authenticateToken, requireRole('REFEREE', 'ADMIN'), createMatchStatistics);
router.get('/matches/:id/statistics', getMatchStatistics); // Public
router.put('/matches/:id/score', authenticateToken, requireRole('REFEREE', 'ADMIN'), updateMatchScore);

export default router;
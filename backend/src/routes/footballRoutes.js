import express from 'express';
import { getLeagues, getSeasons, getTeams, getTeamStatistics, getTeamSeasons, getTeamCountries, getStandings, getFixturePlayers, getFixtures, getTopScorers, getSquad, getTransfers } from '../controllers/footballController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public endpoints
router.get('/leagues', getLeagues);
router.get('/seasons', getSeasons);
router.get('/teams', getTeams);
router.get('/teams/statistics', getTeamStatistics);
router.get('/teams/seasons', getTeamSeasons);
router.get('/teams/countries', getTeamCountries);
router.get('/standings', getStandings);
router.get('/fixtures/players', getFixturePlayers);
router.get('/fixtures', getFixtures);
router.get('/topscorers', getTopScorers);
router.get('/squad', getSquad);
router.get('/transfers', getTransfers);

// Protected endpoints for specific roles
router.get('/admin/leagues', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getLeagues);
router.get('/admin/seasons', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getSeasons);
router.get('/admin/teams', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getTeams);
router.get('/admin/teams/statistics', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getTeamStatistics);
router.get('/admin/teams/seasons', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getTeamSeasons);
router.get('/admin/teams/countries', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getTeamCountries);
router.get('/admin/standings', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getStandings);
router.get('/admin/fixtures/players', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getFixturePlayers);
router.get('/admin/fixtures', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getFixtures);
router.get('/admin/topscorers', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getTopScorers);
router.get('/admin/squad', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getSquad);
router.get('/admin/transfers', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getTransfers);

export default router;
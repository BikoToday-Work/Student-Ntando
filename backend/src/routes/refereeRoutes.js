import express from 'express';
import {
  createReferee,
  getReferees,
  getRefereeById,
  updateReferee,
  deleteReferee,
  getRefereeAssignments,
  createAssignment,
  acceptAssignment,
  declineAssignment,
  createDisciplinaryReport,
  getDisciplinaryReports,
  getDisciplinaryReportById,
  updateDisciplinaryReport,
  approveDisciplinaryReport
} from '../controllers/refereeController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Referee Management
router.post('/referees', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), createReferee);
router.get('/referees', authenticateToken, requireRole('ADMIN', 'SECRETARIAT'), getReferees);
router.get('/referees/:id', authenticateToken, getRefereeById);
router.put('/referees/:id', authenticateToken, requireRole('REFEREE', 'ADMIN'), updateReferee);
router.delete('/referees/:id', authenticateToken, requireRole('ADMIN'), deleteReferee);

// Match Assignments
router.get('/referees/:id/assignments', authenticateToken, requireRole('REFEREE', 'ADMIN', 'SECRETARIAT'), getRefereeAssignments);
router.post('/assignments', authenticateToken, requireRole('SECRETARIAT', 'ADMIN'), createAssignment);
router.put('/assignments/:id/accept', authenticateToken, requireRole('REFEREE'), acceptAssignment);
router.put('/assignments/:id/decline', authenticateToken, requireRole('REFEREE'), declineAssignment);

// Disciplinary Reports
router.post('/disciplinary/reports', authenticateToken, requireRole('REFEREE', 'ADMIN'), createDisciplinaryReport);
router.get('/disciplinary/reports', authenticateToken, requireRole('REFEREE', 'ADMIN', 'SECRETARIAT'), getDisciplinaryReports);
router.get('/disciplinary/reports/:id', authenticateToken, getDisciplinaryReportById);
router.put('/disciplinary/reports/:id', authenticateToken, requireRole('REFEREE', 'ADMIN'), updateDisciplinaryReport);
router.put('/disciplinary/reports/:id/approve', authenticateToken, requireRole('SECRETARIAT', 'ADMIN'), approveDisciplinaryReport);

export default router;
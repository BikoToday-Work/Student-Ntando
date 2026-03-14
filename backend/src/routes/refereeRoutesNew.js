const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const {
  createReferee,
  getReferees,
  getRefereeById,
  updateReferee,
  deleteReferee,
  createDisciplinaryReport,
  getDisciplinaryReports,
  updateDisciplinaryReportStatus
} = require('../controllers/refereeControllerNew');

// Referee Registry - RBAC enforced
router.get('/referees', auth, getReferees); // All authenticated users can view
router.get('/referees/:id', auth, getRefereeById); // All authenticated users can view details
router.post('/referees', auth, requireRole(['ADMIN']), createReferee); // Only Federation Admins
router.put('/referees/:id', auth, requireRole(['ADMIN']), updateReferee); // Only Federation Admins
router.delete('/referees/:id', auth, requireRole(['ADMIN']), deleteReferee); // Only Federation Admins

// Disciplinary Reports
router.post('/disciplinary-reports', auth, requireRole(['REFEREE']), createDisciplinaryReport); // Only Referees
router.get('/disciplinary-reports', auth, getDisciplinaryReports); // Role-based filtering in controller
router.put('/disciplinary-reports/:id/status', auth, requireRole(['ADMIN', 'SECRETARIAT']), updateDisciplinaryReportStatus); // Admin/Secretariat only

module.exports = router;
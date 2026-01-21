const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  approveDocument,
  createTask,
  getTasks,
  updateTaskStatus
} = require('../controllers/governanceController');

// Document routes
router.post('/documents', auth, requireRole(['ADMIN', 'SECRETARIAT']), uploadDocument);
router.get('/documents', auth, getDocuments);
router.get('/documents/:id', auth, getDocumentById);
router.put('/documents/:id/approve', auth, requireRole(['ADMIN', 'SECRETARIAT']), approveDocument);

// Task routes
router.post('/tasks', auth, requireRole(['ADMIN', 'SECRETARIAT']), createTask);
router.get('/tasks', auth, getTasks);
router.put('/tasks/:id/status', auth, requireRole(['ADMIN', 'SECRETARIAT']), updateTaskStatus);

module.exports = router;
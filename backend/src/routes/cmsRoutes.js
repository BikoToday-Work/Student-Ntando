const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const {
  createPage,
  getPages,
  getPageBySlug,
  updatePage,
  deletePage,
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews
} = require('../controllers/cmsController');

// Public routes
router.get('/pages', getPages);
router.get('/pages/:slug', getPageBySlug);
router.get('/news', getNews);
router.get('/news/:id', getNewsById);

// Admin routes
router.post('/pages', auth, requireRole(['ADMIN', 'SECRETARIAT']), createPage);
router.put('/pages/:id', auth, requireRole(['ADMIN', 'SECRETARIAT']), updatePage);
router.delete('/pages/:id', auth, requireRole(['ADMIN']), deletePage);

router.post('/news', auth, requireRole(['ADMIN', 'SECRETARIAT']), createNews);
router.put('/news/:id', auth, requireRole(['ADMIN', 'SECRETARIAT']), updateNews);
router.delete('/news/:id', auth, requireRole(['ADMIN']), deleteNews);

module.exports = router;
const express = require('express');
const router = express.Router();
const { enroll, getMyEnrollments, unenroll, getAllEnrollments, updateProgress } = require('../controllers/enrollmentController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, enroll);
router.post('/enroll/:courseId', auth, async (req, res, next) => {
  req.body.courseId = req.params.courseId;
  enroll(req, res, next);
});
router.get('/my', auth, getMyEnrollments);
router.get('/my-courses', auth, getMyEnrollments);
router.get('/all', auth, adminOnly, getAllEnrollments);
router.put('/:courseId/progress', auth, updateProgress);
router.delete('/:courseId', auth, unenroll);

module.exports = router;

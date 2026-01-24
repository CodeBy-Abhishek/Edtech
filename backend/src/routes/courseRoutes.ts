import { Router } from 'express';
import { createCourse, getCourses, getCourseDetails, addModule, addLesson, getStudentDashboard } from '../controllers/courseController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCourses);
router.get('/:id', getCourseDetails);

// Only instructors and admins can create courses and modules/lessons
router.get('/dashboard', authenticate, getStudentDashboard);
router.post('/', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), createCourse);
router.post('/module', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), addModule);
router.post('/lesson', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), addLesson);

export default router;

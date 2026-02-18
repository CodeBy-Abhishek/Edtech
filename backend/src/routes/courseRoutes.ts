import { Router } from 'express';
import { createCourse, getCourses, getCourseDetails, addModule, addTopic, addLesson, getStudentDashboard, completeLesson } from '../controllers/courseController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCourses);
router.get('/dashboard', authenticate, getStudentDashboard);
router.get('/:id', (req, res, next) => {
    // Optional auth: try to authenticate but don't fail if no token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authenticate(req as any, res, next);
    }
    next();
}, getCourseDetails);
router.post('/complete-lesson', authenticate, completeLesson);

// Only instructors and admins can create courses and modules/lessons
router.post('/', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), createCourse);
router.post('/module', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), addModule);
router.post('/topic', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), addTopic);
router.post('/lesson', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), addLesson);

export default router;

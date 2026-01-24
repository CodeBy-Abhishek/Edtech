import { Router } from 'express';
import { getInstructorStats, getInstructorCourses } from '../controllers/instructorController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Only instructors and admins can access these routes
router.get('/stats', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), getInstructorStats);
router.get('/courses', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), getInstructorCourses);

export default router;

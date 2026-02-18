import { Router } from 'express';
import { getInstructorStats, getInstructorCourses, goLive } from '../controllers/instructorController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate, authorize(['INSTRUCTOR', 'ADMIN']));

router.get('/stats', getInstructorStats);
router.get('/courses', getInstructorCourses);
router.post('/go-live', goLive);

export default router;

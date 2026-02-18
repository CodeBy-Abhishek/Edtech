import { Router } from 'express';
import { getStudentAssignments, createAssignment } from '../controllers/assignmentController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/my-assignments', authenticate, getStudentAssignments);
router.post('/assignment', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), createAssignment);

export default router;

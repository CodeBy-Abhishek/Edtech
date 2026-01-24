import { Router } from 'express';
import { getStudentAssignments } from '../controllers/assignmentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/my-assignments', authenticate, getStudentAssignments);

export default router;

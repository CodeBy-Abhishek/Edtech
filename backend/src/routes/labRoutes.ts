import { Router } from 'express';
import { createLab, submitLab, getLabSubmissions, updateSubmissionStatus } from '../controllers/labController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), createLab);
router.post('/submit', authenticate, submitLab);
router.get('/submissions/:labId', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), getLabSubmissions);
router.patch('/submission/:id', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), updateSubmissionStatus);

export default router;

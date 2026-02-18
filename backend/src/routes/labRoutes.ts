import { Router } from 'express';
import { createLab, submitLab, getLabSubmissions, updateSubmissionStatus, getMyLabs, getLab } from '../controllers/labController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/my-labs', authenticate, getMyLabs);
router.get('/:id', authenticate, getLab);
router.post('/', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), createLab);
router.post('/submit', authenticate, submitLab);
router.get('/submissions/:labId', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), getLabSubmissions);
router.patch('/submission/:id', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), updateSubmissionStatus);

export default router;

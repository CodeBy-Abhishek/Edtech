import { Router } from 'express';
import { getLogs } from '../controllers/securityController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/logs', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), getLogs);

export default router;

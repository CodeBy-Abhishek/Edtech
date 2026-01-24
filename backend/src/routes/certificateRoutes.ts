import { Router } from 'express';
import { issueCertificate, getCertificate, getUserCertificates } from '../controllers/certificateController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/my-certificates', authenticate, getUserCertificates);
router.get('/:id', getCertificate); // Supports public verification
router.post('/issue', authenticate, issueCertificate);

export default router;

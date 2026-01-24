import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/noteController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getNotes);
router.post('/', authenticate, createNote);
router.delete('/:id', authenticate, deleteNote);

export default router;

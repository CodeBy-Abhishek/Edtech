import { Router } from 'express';
import { createQuiz, submitQuiz, getQuizDetails } from '../controllers/quizController';
import { createAssignment, submitAssignment, getAssignmentSubmissions, gradeAssignment } from '../controllers/assignmentController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Quizzes
router.get('/quiz/:id', authenticate, getQuizDetails);
router.post('/quiz', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), createQuiz);
router.post('/quiz/submit', authenticate, submitQuiz);

// Assignments
router.post('/assignment', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), createAssignment);
router.post('/assignment/submit', authenticate, submitAssignment);
router.get('/assignment/submissions/:assignmentId', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), getAssignmentSubmissions);
router.patch('/assignment/grade/:id', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), gradeAssignment);

export default router;

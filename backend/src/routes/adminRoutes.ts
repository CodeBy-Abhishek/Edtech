import { Router } from 'express';
import {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllCourses,
    getAllEnrollments,
    getAllPayments,
    getAllCertificates,
    getSystemStats
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// All routes require ADMIN role
router.use(authenticate, authorize(['ADMIN']));

// System Stats
router.get('/stats', getSystemStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Course Management
router.get('/courses', getAllCourses);

// Enrollment Management
router.get('/enrollments', getAllEnrollments);

// Payment Management
router.get('/payments', getAllPayments);

// Certificate Management
router.get('/certificates', getAllCertificates);

export default router;

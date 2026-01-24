import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

// User Management
export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { enrollments: true, payments: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
    try {
        const { userId, role } = req.body;
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: { id: true, email: true, name: true, role: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Course Management
export const getAllCourses = async (req: AuthRequest, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                instructor: { select: { name: true, email: true } },
                _count: { select: { enrollments: true, modules: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

// Enrollment Management
export const getAllEnrollments = async (req: AuthRequest, res: Response) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enrollments', error });
    }
};

// Payment Management
export const getAllPayments = async (req: AuthRequest, res: Response) => {
    try {
        const payments = await prisma.payment.findMany({
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error });
    }
};

// Certificate Management
export const getAllCertificates = async (req: AuthRequest, res: Response) => {
    try {
        const certificates = await prisma.certificate.findMany({
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } }
            },
            orderBy: { issueDate: 'desc' }
        });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching certificates', error });
    }
};

// System Analytics
export const getSystemStats = async (req: AuthRequest, res: Response) => {
    try {
        const [
            totalUsers,
            totalCourses,
            totalEnrollments,
            totalRevenue,
            recentUsers,
            recentPayments
        ] = await Promise.all([
            prisma.user.count(),
            prisma.course.count(),
            prisma.enrollment.count(),
            prisma.payment.aggregate({
                where: { status: 'SUCCESS' },
                _sum: { amount: true }
            }),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),
            prisma.payment.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    },
                    status: 'SUCCESS'
                }
            })
        ]);

        res.json({
            totalUsers,
            totalCourses,
            totalEnrollments,
            totalRevenue: totalRevenue._sum.amount || 0,
            recentUsers,
            recentPayments
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching system stats', error });
    }
};

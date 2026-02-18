import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

export const getInstructorStats = async (req: AuthRequest, res: Response) => {
    try {
        const instructorId = req.user?.userId;

        const [
            totalStudents,
            totalCourses,
            totalRevenue,
            recentSubmissions
        ] = await Promise.all([
            // Unique students enrolled in instructor's courses
            prisma.enrollment.count({
                where: { course: { instructorId } }
            }),
            prisma.course.count({
                where: { instructorId }
            }),
            prisma.payment.aggregate({
                where: { course: { instructorId }, status: 'SUCCESS' },
                _sum: { amount: true }
            }),
            prisma.assignmentSubmission.findMany({
                where: { assignment: { lesson: { topic: { module: { course: { instructorId } } } } } },
                include: {
                    user: { select: { name: true } },
                    assignment: { select: { title: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: 5
            })
        ]);

        res.json({
            stats: {
                totalStudents,
                totalCourses,
                totalRevenue: totalRevenue._sum.amount || 0,
                avgCompletion: 74 // Logic for completion can be added later
            },
            recentSubmissions
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instructor stats', error });
    }
};

export const getInstructorCourses = async (req: AuthRequest, res: Response) => {
    try {
        const instructorId = req.user?.userId;
        const courses = await prisma.course.findMany({
            where: { instructorId },
            include: {
                _count: { select: { enrollments: true, modules: true } }
            }
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instructor courses', error });
    }
};

export const goLive = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId, title } = req.body;
        const instructorId = req.user?.userId;

        // Fetch instructor name for notification
        const instructor = await prisma.user.findUnique({
            where: { id: instructorId },
            select: { name: true }
        });

        // Create a notification for all enrolled students
        const enrollments = await prisma.enrollment.findMany({
            where: { courseId },
            select: { userId: true }
        });

        const notifications = enrollments.map(e => ({
            userId: e.userId,
            title: '🔴 LIVE NOW',
            message: `Instructor ${instructor?.name || 'Someone'} has started: ${title}`,
            type: 'INFO' as const
        }));

        await prisma.notification.createMany({ data: notifications });

        // Emit socket event globally or to room
        const io = require('../socket/socketService').getSocketIO();
        io.to(courseId).emit('live_session_started', { courseId, title, instructor: instructor?.name });

        res.json({ message: 'Session started successfully' });
    } catch (error) {
        console.error("Go live error:", error);
        res.status(500).json({ message: 'Error starting live session', error });
    }
};

import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getInstructorStats = async (req: AuthRequest, res: Response) => {
    try {
        const instructorId = req.user?.userId;

        if (!instructorId) return res.status(401).json({ message: 'Unauthorized' });

        // 1. Get all courses created by this instructor
        const courses = await prisma.course.findMany({
            where: { instructorId },
            include: {
                enrollments: true,
            }
        });

        const totalCourses = courses.length;
        const totalEnrollments = courses.reduce((acc: number, course: any) => acc + course.enrollments.length, 0);
        const totalRevenue = courses.reduce((acc: number, course: any) => acc + (course.enrollments.length * course.price), 0);

        // 2. Get active students count (unique users enrolled in any of this instructor's courses)
        const activeStudents = await prisma.enrollment.findMany({
            where: {
                course: { instructorId }
            },
            distinct: ['userId']
        });

        res.json({
            totalCourses,
            totalEnrollments,
            totalRevenue,
            activeStudentsCount: activeStudents.length,
            courseStats: courses.map((c: any) => ({
                id: c.id,
                title: c.title,
                enrollments: c.enrollments.length,
                revenue: c.enrollments.length * c.price
            }))
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
                _count: {
                    select: { modules: true, enrollments: true }
                }
            }
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instructor courses', error });
    }
};

import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCourse = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, category, price, thumbnailUrl } = req.body;
        const instructorId = req.user?.userId;

        if (!instructorId) return res.status(401).json({ message: 'Unauthorized' });

        const course = await prisma.course.create({
            data: {
                title,
                description,
                category,
                price: parseFloat(price) || 0,
                thumbnailUrl,
                instructorId,
            },
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error });
    }
};

export const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
            where: { isPublished: true },
            include: {
                instructor: {
                    select: { name: true, email: true }
                }
            }
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

export const getCourseDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        topics: {
                            orderBy: { order: 'asc' },
                            include: {
                                lessons: {
                                    orderBy: { order: 'asc' },
                                    include: { resources: true }
                                }
                            }
                        }
                    }
                },
                instructor: {
                    select: { name: true, email: true }
                }
            },
        });

        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course details', error });
    }
};

export const addModule = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId, title, order } = req.body;
        const module = await prisma.module.create({
            data: { courseId, title, order: parseInt(order) }
        });
        res.status(201).json(module);
    } catch (error) {
        res.status(500).json({ message: 'Error adding module', error });
    }
};

export const addLesson = async (req: AuthRequest, res: Response) => {
    try {
        const { topicId, title, content, videoUrl, type, order } = req.body;
        const lesson = await prisma.lesson.create({
            data: { topicId, title, content, videoUrl, type, order: parseInt(order) }
        });
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Error adding lesson', error });
    }
};

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const enrollments = await prisma.enrollment.findMany({
            where: { userId, status: 'ACTIVE' },
            include: {
                course: {
                    include: {
                        instructor: { select: { name: true } },
                        _count: { select: { modules: true } } // rough estimate of size
                    }
                }
            }
        });

        // Calculate stats
        const activeCourses = enrollments.length;
        const certificatesToken = await prisma.certificate.count({ where: { userId } });

        // Mock data for things we don't track yet
        const hoursLearned = 42;
        const skillPoints = 1250;

        const formattedCourses = enrollments.map(e => ({
            id: e.course.id,
            title: e.course.title,
            instructor: e.course.instructor.name || 'Unknown',
            progress: e.progress,
            image: e.course.thumbnailUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop",
            lessons: 0, // Need deeper query for lesson count, mock for now or use module count * 5
            duration: "Self-Paced",
            category: e.course.category
        }));

        res.json({
            stats: {
                activeCourses,
                hoursLearned,
                certificates: certificatesToken,
                skillPoints
            },
            enrolledCourses: formattedCourses
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard', error });
    }
};

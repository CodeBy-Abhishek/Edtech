import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';

export const issueCertificate = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.body;
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        // 1. Check if certificate already exists
        const existing = await prisma.certificate.findFirst({
            where: { userId, courseId }
        });
        if (existing) return res.json(existing);

        // 2. Check course completion / eligibility
        // Logic: User must have passed all quizzes in the course
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    include: {
                        topics: {
                            include: {
                                lessons: {
                                    include: { quizzes: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!course) return res.status(404).json({ message: 'Course not found' });

        const allQuizzes = course.modules.flatMap(m =>
            m.topics.flatMap(t =>
                t.lessons.flatMap(l => l.quizzes)
            )
        );

        const quizAttempts = await prisma.quizAttempt.findMany({
            where: { userId, passed: true, quizId: { in: allQuizzes.map(q => q.id) } }
        });

        const passedQuizIds = new Set(quizAttempts.map(a => a.quizId));
        const allPassed = allQuizzes.every(q => passedQuizIds.has(q.id));

        if (!allPassed && allQuizzes.length > 0) {
            return res.status(403).json({
                message: 'Not eligible. You must pass all quizzes in the course.',
                required: allQuizzes.length,
                passed: passedQuizIds.size
            });
        }

        // 3. Issue Certificate
        const certificate = await prisma.certificate.create({
            data: {
                certificateId: `CERT-${uuidv4().substring(0, 8).toUpperCase()}`,
                userId,
                courseId,
                metadata: {
                    userName: req.user?.name || 'Student',
                    courseTitle: course.title,
                    grade: 'A+' // Simplified
                }
            }
        });

        res.status(201).json(certificate);
    } catch (error) {
        res.status(500).json({ message: 'Error issuing certificate', error });
    }
};

export const getCertificate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Supports verification by certificateId or DB id
        const certificate = await prisma.certificate.findFirst({
            where: {
                OR: [
                    { id },
                    { certificateId: id }
                ]
            },
            include: {
                user: { select: { name: true } },
                course: { select: { title: true } }
            }
        });

        if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching certificate', error });
    }
};

export const getUserCertificates = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const certificates = await prisma.certificate.findMany({
            where: { userId },
            include: { course: { select: { title: true } } }
        });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user certificates', error });
    }
};

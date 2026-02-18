import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createLab = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, manualUrl, setupCommands, externalLabUrl, lessonId } = req.body;

        const lab = await prisma.lab.create({
            data: {
                title,
                description,
                manualUrl,
                setupCommands,
                externalLabUrl,
                lessonId
            }
        });

        res.status(201).json(lab);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lab', error });
    }
};

export const submitLab = async (req: AuthRequest, res: Response) => {
    try {
        const { labId, submissionUrl } = req.body;
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const submission = await prisma.labSubmission.create({
            data: {
                labId,
                userId,
                submissionUrl,
                status: 'PENDING'
            }
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting lab', error });
    }
};

export const getLabSubmissions = async (req: AuthRequest, res: Response) => {
    try {
        const { labId } = req.params;
        const submissions = await prisma.labSubmission.findMany({
            where: { labId },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error });
    }
};

export const updateSubmissionStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, feedback, score } = req.body;

        const submission = await prisma.labSubmission.update({
            where: { id },
            data: { status, feedback, score }
        });

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error updating submission', error });
    }
};

export const getMyLabs = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const enrollments = await prisma.enrollment.findMany({
            where: { userId },
            select: { courseId: true }
        });

        const courseIds = enrollments.map(e => e.courseId);

        const labs = await prisma.lab.findMany({
            where: {
                lesson: {
                    topic: {
                        module: {
                            courseId: { in: courseIds }
                        }
                    }
                }
            },
            include: {
                submissions: {
                    where: { userId },
                    select: { status: true, score: true }
                }
            }
        });

        res.json(labs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching labs', error });
    }
};
export const getLab = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const lab = await prisma.lab.findUnique({
            where: { id },
            include: {
                submissions: {
                    where: { userId },
                    select: { status: true, score: true, feedback: true, submissionUrl: true }
                }
            }
        });

        if (!lab) return res.status(404).json({ message: 'Lab not found' });

        res.json(lab);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lab details', error });
    }
};

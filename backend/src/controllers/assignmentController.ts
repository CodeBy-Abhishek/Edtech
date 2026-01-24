import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

export const getStudentAssignments = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        // Find courses student is enrolled in
        const enrollments = await prisma.enrollment.findMany({
            where: { userId },
            select: { courseId: true }
        });

        const courseIds = enrollments.map(e => e.courseId);

        // Find assignments in those courses modules -> topics -> lessons -> assignments
        const assignments = await prisma.assignment.findMany({
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
                lesson: {
                    select: {
                        title: true,
                        topic: {
                            select: {
                                module: {
                                    select: {
                                        course: {
                                            select: { title: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                submissions: {
                    where: { userId },
                    select: { status: true, score: true, feedback: true }
                }
            }
        });

        // Transform for frontend
        const formatted = assignments.map(a => ({
            id: a.id,
            title: a.title,
            course: a.lesson.topic.module.course.title,
            dueDate: "No due date", // Schema update needed if date required
            status: a.submissions[0]?.status || 'PENDING',
            grade: a.submissions[0]?.score ? `${a.submissions[0].score}/100` : undefined,
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error });
    }
};

// Create Assignment (for instructors)
export const createAssignment = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, lessonId } = req.body;
        const assignment = await prisma.assignment.create({
            data: { title, description, lessonId }
        });
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating assignment', error });
    }
};

// Submit Assignment
export const submitAssignment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { assignmentId, fileUrl } = req.body;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const submission = await prisma.assignmentSubmission.create({
            data: { assignmentId, userId, fileUrl }
        });
        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assignment', error });
    }
};

// Get Assignment Submissions (for instructors)
export const getAssignmentSubmissions = async (req: AuthRequest, res: Response) => {
    try {
        const { assignmentId } = req.params;
        const submissions = await prisma.assignmentSubmission.findMany({
            where: { assignmentId },
            include: { user: { select: { name: true, email: true } } }
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error });
    }
};

// Grade Assignment
export const gradeAssignment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { score, feedback, status } = req.body;

        const submission = await prisma.assignmentSubmission.update({
            where: { id },
            data: { score, feedback, status }
        });
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error grading assignment', error });
    }
};

import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createQuiz = async (req: AuthRequest, res: Response) => {
    try {
        const { title, lessonId, passingScore, questions } = req.body;

        const quiz = await prisma.quiz.create({
            data: {
                title,
                lessonId,
                passingScore: parseInt(passingScore) || 70,
                questions: {
                    create: questions.map((q: any) => ({
                        text: q.text,
                        order: q.order,
                        options: {
                            create: q.options.map((o: any) => ({
                                text: o.text,
                                isCorrect: o.isCorrect
                            }))
                        }
                    }))
                }
            }
        });

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz', error });
    }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
    try {
        const { quizId, answers } = req.body; // answers: { questionId: string, optionId: string }[]
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    include: { options: true }
                }
            }
        });

        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let correctCount = 0;
        quiz.questions.forEach(q => {
            const userAnswer = answers.find((a: any) => a.questionId === q.id);
            const correctOption = q.options.find(o => o.isCorrect);
            if (userAnswer && userAnswer.optionId === correctOption?.id) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / quiz.questions.length) * 100);
        const passed = score >= quiz.passingScore;

        const attempt = await prisma.quizAttempt.create({
            data: {
                quizId,
                userId,
                score,
                passed
            }
        });

        res.json({ score, passed, attempt });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting quiz', error });
    }
};

export const getQuizDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const quiz = await prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                    include: {
                        // Don't send isCorrect to frontend
                        options: {
                            select: { id: true, text: true }
                        }
                    }
                }
            }
        });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz', error });
    }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

export const getNotes = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const notes = await prisma.note.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error });
    }
};

export const createNote = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { title, content, courseId, lessonId } = req.body;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const note = await prisma.note.create({
            data: { userId, title, content, courseId, lessonId }
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error creating note', error });
    }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        const note = await prisma.note.findUnique({ where: { id } });

        if (!note || note.userId !== userId) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        await prisma.note.delete({ where: { id } });
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error });
    }
};

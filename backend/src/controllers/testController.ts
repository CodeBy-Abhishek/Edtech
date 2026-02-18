import { Request, Response } from 'express';
import { enrollUserInCourse } from '../services/enrollmentService';

export const simulateWebhook = async (req: Request, res: Response) => {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
        return res.status(400).json({ message: "userId and courseId are required" });
    }

    try {
        await enrollUserInCourse(userId, courseId);
        res.status(200).json({ message: `Successfully enrolled user ${userId} in course ${courseId} (Simulation)` });
    } catch (error: any) {
        res.status(500).json({ message: "Error in simulation", error: error.message });
    }
};

import { Response } from 'express';
import { getAuditTrail } from '../services/securityService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getLogs = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        // Admins can see all logs, users only their own
        const logs = await getAuditTrail(req.user?.role === 'ADMIN' ? undefined : userId);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs', error });
    }
};

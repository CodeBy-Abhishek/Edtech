import prisma from '../lib/prisma';

export const logActivity = async (userId: string, action: string, details?: string, ip?: string, device?: string) => {
    try {
        const log = await prisma.activityLog.create({
            data: {
                userId,
                action,
                details,
                ip,
                device
            }
        });
        return log;
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

export const getAuditTrail = async (userId?: string, action?: string) => {
    try {
        return await prisma.activityLog.findMany({
            where: {
                ...(userId && { userId }),
                ...(action && { action })
            },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    } catch (error) {
        console.error('Error fetching audit trail:', error);
    }
};

import prisma from '../lib/prisma';
import { getSocketIO } from '../socket/socketService';

export const createNotification = async (userId: string, title: string, message: string, type: string = 'INFO', link?: string) => {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link
            }
        });

        // Emit socket event
        const io = getSocketIO();
        if (io) {
            io.to(userId).emit('notification', notification);
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

export const sendEmail = async (to: string, subject: string, body: string) => {
    // Service abstraction for Email (could use Nodemailer or Resend)
    console.log(`[Email Service] Sending to: ${to} | Subject: ${subject}`);
    // Implementation for Resend/Nodemailer would go here
};

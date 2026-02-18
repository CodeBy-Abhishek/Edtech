import prisma from '../lib/prisma';

export const enrollUserInCourse = async (userId: string, courseId: string) => {
    try {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year access by default

        const enrollment = await prisma.enrollment.upsert({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId,
                },
            },
            update: {
                status: 'ACTIVE',
                expiresAt: expiresAt,
            },
            create: {
                userId: userId,
                courseId: courseId,
                status: 'ACTIVE',
                expiresAt: expiresAt,
            },
        });
        console.log(`User ${userId} enrolled in course ${courseId}`);
        return enrollment;
    } catch (error) {
        console.error("Error enrolling user:", error);
        throw error;
    }
};

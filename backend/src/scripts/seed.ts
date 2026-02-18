import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    console.log('🌌 Starting Universal Seed...');

    // --- CLEANUP ---
    const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    for (const { tablename } of tablenames) {
        if (tablename !== '_prisma_migrations') {
            try {
                await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
            } catch (error) {
                console.log(`Skipping ${tablename}`);
            }
        }
    }

    // --- 1. USERS ---
    const password = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({
        data: { email: 'admin@edtech.com', password, name: 'Chief Architect', role: 'ADMIN' }
    });

    const instructor = await prisma.user.create({
        data: { email: 'instructor@edtech.com', password, name: 'Dr. Alan Turing', role: 'INSTRUCTOR', bio: 'Pioneer of theoretical computer science.' }
    });

    const student = await prisma.user.create({
        data: { email: 'student@edtech.com', password, name: 'Future Dev', role: 'STUDENT' }
    });

    // --- 2. COUPONS ---
    const coupon = await prisma.coupon.create({
        data: { code: 'ULTIMATE100', discount: 100, type: 'PERCENTAGE', maxUses: 50 }
    });

    // --- 3. COURSES, MODULES, TOPICS, LESSONS ---
    const course = await prisma.course.create({
        data: {
            title: 'Neural Networks & Deep Learning',
            description: 'Master the foundations of modern AI from the ground up.',
            category: 'Data Science',
            price: 4999,
            thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop',
            isPublished: true,
            isTrending: true,
            instructorId: instructor.id,
            modules: {
                create: {
                    title: 'Core Architectures',
                    order: 1,
                    topics: {
                        create: {
                            title: 'Backpropagation',
                            order: 1,
                            lessons: {
                                create: [
                                    {
                                        title: 'Gradient Descent Visualized',
                                        type: 'VIDEO',
                                        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                                        content: 'Detailed explanation of chain rule applications.',
                                        order: 1
                                    },
                                    {
                                        title: 'Mathematic optimization',
                                        type: 'DOCUMENT',
                                        content: '# Optimization PDF\nRefer to standard derivation.',
                                        order: 2
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        include: { modules: { include: { topics: { include: { lessons: true } } } } }
    });

    await prisma.course.create({
        data: {
            title: 'Full Stack Engineering 2026',
            description: 'Build hyper-scalable applications with Next.js 16 and Rust.',
            category: 'Web Development',
            price: 5999,
            thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop',
            isPublished: true,
            isTrending: true,
            instructorId: instructor.id,
        }
    });

    const firstLesson = course.modules[0].topics[0].lessons[0];

    // --- 4. QUIZ, QUESTIONS, OPTIONS ---
    const quiz = await prisma.quiz.create({
        data: {
            title: 'Foundations Quiz',
            lessonId: firstLesson.id,
            passingScore: 70,
            questions: {
                create: {
                    text: 'What is the activation function typically used in hidden layers?',
                    order: 1,
                    options: {
                        create: [
                            { text: 'ReLU', isCorrect: true },
                            { text: 'Softmax', isCorrect: false },
                            { text: 'Sigmoid', isCorrect: false }
                        ]
                    }
                }
            }
        }
    });

    // --- 5. ASSIGNMENTS & LABS ---
    const assignment = await prisma.assignment.create({
        data: {
            title: 'Build your first Perceptron',
            description: 'Implement a perceptron using only NumPy.',
            lessonId: firstLesson.id
        }
    });

    const lab = await prisma.lab.create({
        data: {
            title: 'TensorFlow Runtime Lab',
            description: 'Environment with GPU support.',
            setupCommands: 'pip install tensorflow numpy',
            lessonId: firstLesson.id
        }
    });

    // --- 6. ENROLLMENT & PAYMENTS ---
    await prisma.enrollment.create({
        data: { userId: student.id, courseId: course.id, progress: 25, status: 'ACTIVE' }
    });

    const payment = await prisma.payment.create({
        data: {
            orderId: `ORD_${uuidv4().slice(0, 8)}`,
            userId: student.id,
            courseId: course.id,
            amount: 4999,
            status: 'SUCCESS',
            couponId: coupon.id
        }
    });

    // --- 7. SUBMISSIONS & ATTEMPTS ---
    await prisma.quizAttempt.create({
        data: { quizId: quiz.id, userId: student.id, score: 100, passed: true }
    });

    await prisma.assignmentSubmission.create({
        data: { assignmentId: assignment.id, userId: student.id, fileUrl: 'https://github.com/student/perceptron', status: 'PENDING' }
    });

    await prisma.labSubmission.create({
        data: { labId: lab.id, userId: student.id, submissionUrl: 'container_alpha_99', status: 'APPROVED', score: 95 }
    });

    // --- 8. UTILS (RESOURCES, NOTES, NOTIFICATIONS) ---
    await prisma.resource.create({
        data: { name: 'PyTorch Cheat Sheet', url: 'https://pytorch.org/docs/stable/index.html', lessonId: firstLesson.id }
    });

    await prisma.note.create({
        data: { userId: student.id, title: 'My Thoughts', content: 'Neural nets are powerful but compute intensive.' }
    });

    await prisma.notification.create({
        data: { userId: student.id, title: 'New Course Announcement', message: 'Dive into Quantum AI now!', type: 'INFO' }
    });

    // --- 9. LOGS (SESSIONS, REFRESH, LOGIN, ACTIVITY) ---
    await prisma.session.create({
        data: { userId: student.id, token: uuidv4(), expiresAt: new Date(Date.now() + 3600), device: 'MacOS' }
    });

    await prisma.refreshToken.create({
        data: { userId: student.id, token: uuidv4(), expiresAt: new Date(Date.now() + 7 * 24 * 3600) }
    });

    await prisma.loginHistory.create({
        data: { userId: student.id, device: 'MacOS', ip: '192.168.1.1', status: 'SUCCESS' }
    });

    await prisma.activityLog.create({
        data: { userId: student.id, action: 'COURSE_START', details: JSON.stringify({ courseId: course.id }) }
    });

    // --- 10. SOCIAL (CHAT) ---
    await prisma.chatMessage.create({
        data: { room: course.id, content: 'Excited to start this journey!', userId: student.id, senderName: student.name }
    });

    // --- 11. CERTIFICATE ---
    await prisma.certificate.create({
        data: {
            certificateId: `CERT-${uuidv4().slice(0, 8).toUpperCase()}`,
            userId: student.id,
            courseId: course.id,
            metadata: { grade: 'A+', completionDate: new Date() }
        }
    });

    console.log('🌌 Universal Seed Completed Successfully!');
    console.log('Credentials: student@edtech.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

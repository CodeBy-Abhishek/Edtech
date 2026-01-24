
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Cleanup
    await prisma.labSubmission.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.topic.deleteMany();
    await prisma.module.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create Instructor
    const instructorPassword = await bcrypt.hash('password123', 10);
    const instructor = await prisma.user.create({
        data: {
            email: 'sarah@edtech.com',
            password: instructorPassword,
            name: 'Dr. Sarah Johnson',
            role: 'INSTRUCTOR'
        }
    });

    // 2. Create Student
    const studentPassword = await bcrypt.hash('password123', 10);
    const student = await prisma.user.create({
        data: {
            email: 'rahul@example.com',
            password: studentPassword,
            name: 'Rahul Sharma',
            role: 'STUDENT'
        }
    });

    // 3. Create Course
    const course = await prisma.course.create({
        data: {
            title: 'Advanced Full-Stack Web Development',
            description: 'Master modern web development with Next.js, Node.js, and Cloud Architecture.',
            category: 'Full Stack',
            price: 4999,
            thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop',
            isPublished: true,
            instructorId: instructor.id
        }
    });

    // 4. Create Modules & Lessons
    const module1 = await prisma.module.create({
        data: {
            courseId: course.id,
            title: 'Modern Frontend Architecture',
            order: 1
        }
    });

    const topic1 = await prisma.topic.create({
        data: {
            moduleId: module1.id,
            title: 'React Server Components',
            order: 1
        }
    });

    await prisma.lesson.create({
        data: {
            topicId: topic1.id,
            title: 'Understanding Server vs Client Components',
            type: 'VIDEO',
            videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Test HLS stream
            order: 1,
            content: 'Deep dive into RSC architecture...'
        }
    });

    // 5. Enroll Student
    await prisma.enrollment.create({
        data: {
            userId: student.id,
            courseId: course.id,
            progress: 15,
            status: 'ACTIVE'
        }
    });

    console.log('✅ Seed completed!');
    console.log('Login credentials:');
    console.log('Student: rahul@example.com / password123');
    console.log('Instructor: sarah@edtech.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

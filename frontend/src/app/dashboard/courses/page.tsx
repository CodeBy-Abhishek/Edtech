"use client";

import React from 'react';
import { BookOpen, Search, Filter, PlayCircle } from 'lucide-react';
import { CourseCard } from '@/components/dashboard/CourseCard';

export default function MyCoursesPage() {
    const enrolledCourses = [
        {
            title: "Advanced Full-Stack Web Development",
            instructor: "Dr. Sarah Johnson",
            progress: 68,
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop",
            lessons: 42,
            duration: "24h 15m",
            category: "Full Stack"
        },
        {
            title: "Cyber Security: Modern Attack & Defense",
            instructor: "Marcus Vane",
            progress: 32,
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop",
            lessons: 28,
            duration: "18h 40m",
            category: "Security"
        },
        {
            title: "UI/UX Design Masterclass 2024",
            instructor: "Elena Rivera",
            progress: 85,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1528&auto=format&fit=crop",
            lessons: 56,
            duration: "32h 10m",
            category: "Design"
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 italic flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-indigo-500" />
                        My Learning Path
                    </h1>
                    <p className="text-zinc-500 mt-2">Continuue where you left off and level up your skills.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {enrolledCourses.map((course, i) => (
                    <CourseCard key={i} {...course} />
                ))}
            </div>
        </div>
    );
}

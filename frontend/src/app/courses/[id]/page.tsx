"use client";

import React, { useEffect, useState } from 'react';
import { CourseSidebar } from '@/components/lms/CourseSidebar';
import { LessonPlayer } from '@/components/lms/LessonPlayer';
import { LiveClassInterface } from '@/components/lms/LiveClassInterface';
import { LabInterface } from '@/components/lms/LabInterface';
import { QuizInterface } from '@/components/lms/QuizInterface';
import { AssignmentInterface } from '@/components/lms/AssignmentInterface';
import { NotesSidebar } from '@/components/lms/NotesSidebar';
import { ChevronLeft, Loader2, StickyNote } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useParams } from 'next/navigation';

export default function CoursePlayerPage() {
    const { id } = useParams();
    const courseId = id as string;
    const [course, setCourse] = useState<any>(null);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNotesOpen, setIsNotesOpen] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${courseId}`);
                setCourse(res.data);

                // Set initial active lesson (first lesson of first module/topic)
                const firstModule = res.data.modules?.[0];
                const firstTopic = firstModule?.topics?.[0];
                const firstLesson = firstTopic?.lessons?.[0];
                if (firstLesson) {
                    setActiveLesson(firstLesson);
                }
            } catch (error) {
                console.error("Failed to fetch course details", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleLessonSelect = (lessonId: string) => {
        // Flatten modules -> topics -> lessons to find the selected one
        const allLessons = course.modules?.flatMap((m: any) =>
            m.topics?.flatMap((t: any) => t.lessons)
        );
        const selected = allLessons?.find((l: any) => l.id === lessonId);
        if (selected) {
            setActiveLesson(selected);
        }
    };

    const refreshCourse = async () => {
        try {
            const res = await api.get(`/courses/${courseId}`);
            setCourse(res.data);

            // Update active lesson from the new data to get refreshed progress
            if (activeLesson) {
                const allLessons = res.data.modules?.flatMap((m: any) =>
                    m.topics?.flatMap((t: any) => t.lessons)
                );
                const updatedActive = allLessons?.find((l: any) => l.id === activeLesson.id);
                if (updatedActive) setActiveLesson(updatedActive);
            }
        } catch (error) {
            console.error("Failed to refresh course", error);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold text-zinc-100 mb-4">Course Not Found</h1>
                <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-zinc-900 px-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-4 w-px bg-zinc-800" />
                    <h2 className="text-sm font-semibold text-zinc-200">{course.title}</h2>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsNotesOpen(!isNotesOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isNotesOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
                    >
                        <StickyNote className="w-3.5 h-3.5" />
                        Notes
                    </button>
                    <div className="w-px h-4 bg-zinc-800" />
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider hidden sm:block">
                        Instructor: <span className="text-zinc-300">{course.instructor?.name}</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Left (Navigation) */}
                <CourseSidebar
                    modules={course.modules || []}
                    activeLessonId={activeLesson?.id}
                    onLessonSelect={handleLessonSelect}
                />

                {/* Lesson/Live/Lab/Assessment Player (Center) */}
                <div className="flex-1 overflow-hidden relative">
                    {!activeLesson ? (
                        <div className="flex items-center justify-center h-full text-zinc-500">
                            Select a lesson to start learning
                        </div>
                    ) : activeLesson.type === 'LIVE' ? (
                        <LiveClassInterface roomId={course.id} />
                    ) : activeLesson.type === 'LAB' ? (
                        <LabInterface lab={activeLesson} />
                    ) : activeLesson.type === 'QUIZ' ? (
                        <QuizInterface quiz={activeLesson.quiz || {
                            id: activeLesson.id,
                            title: activeLesson.title,
                            questions: [],
                            passingScore: 70
                        }} />
                    ) : activeLesson.type === 'ASSIGNMENT' ? (
                        <AssignmentInterface assignment={activeLesson} />
                    ) : (
                        <LessonPlayer lesson={activeLesson} onComplete={refreshCourse} />
                    )}
                </div>

                {/* Notes Sidebar (Right) */}
                <NotesSidebar
                    courseId={courseId}
                    lessonId={activeLesson?.id}
                    isOpen={isNotesOpen}
                    onClose={() => setIsNotesOpen(false)}
                />
            </div>
        </div>
    );
}

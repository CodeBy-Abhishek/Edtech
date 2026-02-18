"use client";

import React from 'react';
import { PlayCircle, FileText, Terminal, ChevronDown, CheckCircle2, Lock, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
    id: string;
    title: string;
    type: 'VIDEO' | 'DOCUMENT' | 'LIVE' | 'LAB';
    isCompleted?: boolean;
    isLocked?: boolean;
    lessonProgress?: { isCompleted: boolean }[];
}

interface Topic {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface Module {
    id: string;
    title: string;
    topics: Topic[];
}

export const CourseSidebar = ({ modules, activeLessonId, onLessonSelect }: {
    modules: Module[],
    activeLessonId: string,
    onLessonSelect: (id: string) => void
}) => {
    // Calculate real progress
    const allLessonsList = modules.flatMap(m => m.topics.flatMap(t => t.lessons));
    const totalLessons = allLessonsList.length;
    const completedLessons = allLessonsList.filter(l => l.isCompleted || l.lessonProgress?.[0]?.isCompleted).length;
    const progressPercent = Math.round((completedLessons / (totalLessons || 1)) * 100);

    return (
        <div className="w-80 h-[calc(100vh-64px)] overflow-y-auto bg-card border-l border-border transition-colors duration-300 no-scrollbar">
            <div className="p-6 border-b border-border bg-muted/30 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-foreground uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 italic">
                        <Layers className="w-4 h-4 text-primary" />
                        Course Syllabus
                    </h3>
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        {progressPercent}%
                    </span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                        <span>Completion Rate</span>
                        <span>{completedLessons}/{totalLessons} Units</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-2">
                {modules.map((module, i) => (
                    <div key={module.id} className="mb-2">
                        <div className="px-4 py-4 flex items-center justify-between group cursor-default">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-muted-foreground/30 group-hover:text-primary transition-colors italic">0{i + 1}</span>
                                <span className="text-xs font-black text-foreground uppercase tracking-widest leading-none">{module.title}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                        </div>

                        <div className="space-y-4 pb-4">
                            {module.topics.map((topic) => (
                                <div key={topic.id} className="space-y-1">
                                    <div className="px-6 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic flex items-center gap-2">
                                        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                        {topic.title}
                                    </div>
                                    <div className="space-y-1 px-2">
                                        {topic.lessons.map((lesson) => {
                                            const isLessonDone = lesson.isCompleted || lesson.lessonProgress?.[0]?.isCompleted;
                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => !lesson.isLocked && onLessonSelect(lesson.id)}
                                                    className={cn(
                                                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs transition-all duration-300 group/item",
                                                        activeLessonId === lesson.id
                                                            ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                                                            : lesson.isLocked
                                                                ? "opacity-30 cursor-not-allowed grayscale"
                                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                            activeLessonId === lesson.id ? "bg-white/20" : "bg-muted group-hover/item:bg-card"
                                                        )}>
                                                            {lesson.type === 'VIDEO' ? <PlayCircle className="w-4 h-4" /> :
                                                                lesson.type === 'LAB' ? <Terminal className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                        </div>
                                                        <span className="font-bold tracking-tight text-left leading-tight truncate max-w-[140px]">
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    <div className="shrink-0 ml-2">
                                                        {isLessonDone ? (
                                                            <CheckCircle2 className={cn("w-4 h-4", activeLessonId === lesson.id ? "text-white" : "text-emerald-500")} />
                                                        ) : lesson.isLocked ? (
                                                            <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />
                                                        ) : activeLessonId === lesson.id ? null : (
                                                            <div className="w-4 h-4 rounded-full border-2 border-muted group-hover/item:border-primary/30 transition-colors" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {i < modules.length - 1 && <div className="mx-4 h-px bg-border/50" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

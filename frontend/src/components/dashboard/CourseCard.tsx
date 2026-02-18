"use client";

import React from 'react';
import { PlayCircle, Clock, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
    title: string;
    instructor: string;
    progress: number;
    image: string;
    lessons: number;
    duration: string;
    category: string;
}

export const CourseCard = ({ title, instructor, progress, image, lessons, duration, category }: CourseCardProps) => {
    return (
        <div className="group bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
            <div className="relative h-44 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent flex items-end p-4">
                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-500/30 backdrop-blur-sm">
                        {category}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors line-clamp-1">{title}</h3>
                <p className="text-xs text-zinc-500 mt-1">by {instructor}</p>

                <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-600" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <BarChart className="w-3.5 h-3.5 text-zinc-600" />
                        <span>{lessons} Lessons</span>
                    </div>
                </div>

                <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Progress</span>
                        <span className="text-indigo-400 font-medium">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <button className="w-full mt-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium flex items-center justify-center gap-2 transition-all">
                    <PlayCircle className="w-4 h-4" />
                    Resume Lecture
                </button>
            </div>
        </div>
    );
};

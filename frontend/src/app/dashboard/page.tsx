"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, Trophy, Play, ArrowRight, Zap, Target } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { CourseCard } from '@/components/dashboard/CourseCard';



import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardPage() {
    const { data, isLoading } = useDashboard();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    if (isLoading) {
        return <div className="p-10 text-center text-zinc-500">Loading your personalized dashboard...</div>;
    }

    const stats = [
        { label: 'Active Courses', value: data?.stats?.activeCourses || 0, icon: BookOpen, trend: 'Keep learning!', trendUp: true },
        { label: 'Hours Learned', value: data?.stats?.hoursLearned || 0, icon: Clock, trend: '+5.2h', trendUp: true },
        { label: 'Certificates', value: data?.stats?.certificates || 0, icon: Trophy, trend: 'Updated', trendUp: true },
        { label: 'Skill Points', value: data?.stats?.skillPoints || 0, icon: Zap, trend: '+150', trendUp: true },
    ];

    const enrolledCourses = data?.enrolledCourses || [];
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 italic">Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}! 👋</h1>
                    <p className="text-zinc-500 mt-2">You've completed 75% of your weekly learning goal. Keep it up!</p>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-3 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                    <Play className="w-5 h-5 fill-current" />
                    Resume Last Lesson
                </button>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Enrolled Courses */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-500" />
                            Your Learning Path
                        </h2>
                        <button className="text-zinc-500 hover:text-zinc-100 text-sm font-medium flex items-center gap-1 transition-colors">
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {enrolledCourses.map((course, i) => (
                            <CourseCard key={i} {...course} />
                        ))}
                    </div>
                </section>

                {/* Sidebar Widgets (Announcements, Deadlines) */}
                <section className="space-y-8">
                    {/* Upcoming Sessions */}
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            Upcoming Live Classes
                        </h3>
                        <div className="space-y-4">
                            {[1, 2].map((_, i) => (
                                <div key={i} className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Today at 4:30 PM</p>
                                    <h4 className="font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">React Server Components Deep Dive</h4>
                                    <p className="text-xs text-zinc-500 mt-1">with Dr. Sarah Johnson</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 text-zinc-500 hover:text-zinc-300 text-xs font-semibold py-2 border border-zinc-800 rounded-lg transition-all hover:bg-zinc-900">
                            View Calendar
                        </button>
                    </div>

                    {/* Announcements */}
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Latest Announcements
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="min-w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
                                    ⚠️
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-zinc-200">System Maintenance</h4>
                                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">The Lab environment will be down for 2 hours on Sunday for security patches.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

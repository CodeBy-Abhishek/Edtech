"use client";

import React from 'react';
import { TrendingUp, Users, DollarSign, BookOpen, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function AnalyticsPage() {
    const [stats, setStats] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/instructor/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
                toast.error("Failed to load analytics data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Revenue", value: stats ? `₹${stats.totalRevenue}` : "₹0", change: "+0%", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "Active Students", value: stats?.activeStudentsCount || "0", change: "+0%", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Total Enrollments", value: stats?.totalEnrollments || "0", change: "+0%", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
        { label: "Total Courses", value: stats?.totalCourses || "0", change: "+0%", icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-500/10" }
    ];

    if (isLoading) return <div className="p-8 text-center text-zinc-500">Recalibrating data nodes...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2 italic">Analytics Engine</h1>
                    <p className="text-zinc-400">Monitor your courses logic and student performance.</p>
                </div>
                <select className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:border-indigo-500 outline-none">
                    <option>Real-Time</option>
                    <option>Last 30 Days</option>
                    <option>All Time</option>
                </select>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-500">
                                <ArrowUpRight className="w-3 h-3" />
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600 leading-none">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Overview Chart */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                    <h3 className="font-bold text-zinc-100 mb-6 italic flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                        Revenue Projection
                    </h3>
                    <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-zinc-800/50 gap-4">
                        {[40, 70, 45, 90, 60, 80, 55, 85, 95, 75, 60, 90].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-600/20 hover:bg-indigo-600/40 transition-colors rounded-t-lg relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}k
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-4 px-2">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Top Courses */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-bold text-zinc-100 mb-6 italic flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        Top Assets
                    </h3>
                    <div className="space-y-6">
                        {(stats?.courseStats || []).length > 0 ? stats.courseStats.map((course: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-zinc-300 font-medium line-clamp-1">{course.title}</span>
                                    <span className="text-zinc-500 text-xs">{course.enrollments} Students</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                        style={{ width: `${Math.min((course.enrollments / 100) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10">
                                <p className="text-zinc-600 text-xs italic font-bold">No performance data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Star } from 'lucide-react';

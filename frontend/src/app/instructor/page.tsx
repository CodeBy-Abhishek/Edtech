"use client";

import React from 'react';
import {
    Users,
    BookOpen,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowRight,
    Video,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import Link from 'next/link';

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color }: any) => (
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4 hover:border-zinc-700 transition-all group shadow-sm">
        <div className="flex items-center justify-between">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", color)}>
                <Icon className="w-6 h-6" />
            </div>
            <button className="text-zinc-600 hover:text-zinc-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
        <div>
            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest opacity-60">{label}</p>
            <h3 className="text-3xl font-black text-zinc-100 mt-1 tabular-nums italic tracking-tight">{value}</h3>
        </div>
        <div className="flex items-center gap-2">
            <div className={cn(
                "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trendValue}%
            </div>
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest opacity-40">vs month</span>
        </div>
    </div>
);
export default function InstructorDashboard() {
    const [data, setData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [userData, setUserData] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/instructor/stats');
                setData(res.data);
                const user = localStorage.getItem('user');
                if (user) setUserData(JSON.parse(user));
            } catch (error) {
                console.error("Failed to fetch instructor stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = data ? [
        { icon: Users, label: 'Total Students', value: data.stats.totalStudents, trend: 'up', trendValue: '12.5', color: 'bg-indigo-500/10 text-indigo-400' },
        { icon: BookOpen, label: 'Managed Courses', value: data.stats.totalCourses, trend: 'up', trendValue: '8.2', color: 'bg-blue-500/10 text-blue-400' },
        { icon: DollarSign, label: 'Total Revenue', value: `₹${data.stats.totalRevenue.toLocaleString()}`, trend: 'up', trendValue: '15.7', color: 'bg-emerald-500/10 text-emerald-400' },
        { icon: TrendingUp, label: 'Avg. Completion', value: `${data.stats.avgCompletion}%`, trend: 'up', trendValue: '2.1', color: 'bg-amber-500/10 text-amber-400' },
    ] : [];

    const recentReviews = data?.recentSubmissions?.map((s: any) => ({
        id: s.id,
        user: s.user.name,
        course: s.assignment.title,
        status: s.status,
        time: new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })) || [];

    if (isLoading) return <div className="p-10 text-center text-zinc-500">Scanning pedagogical metrics...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-zinc-100 tracking-tight italic">Dashboard Overview</h1>
                    <p className="text-zinc-500 mt-2">G'day Prof. {userData?.name || 'Instructor'}, here's what's happening with your courses today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Real-time Sync Active
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Assignment Review Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-indigo-500" />
                            Review Queue
                        </h2>
                        <Link href="/instructor/submissions" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">View All</Link>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Task</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Review</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {recentReviews.length > 0 ? recentReviews.map((review: any) => (
                                    <tr key={review.id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 group-hover:border-indigo-500 border border-transparent transition-all">
                                                    {review.user[0]}
                                                </div>
                                                <span className="text-sm font-medium text-zinc-200">{review.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-500 max-w-[200px] truncate">{review.course}</td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                review.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-500" :
                                                    review.status === 'PENDING' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                                            )}>
                                                <div className={cn("w-1 h-1 rounded-full",
                                                    review.status === 'APPROVED' ? "bg-emerald-500" :
                                                        review.status === 'PENDING' ? "bg-amber-500" : "bg-red-500"
                                                )} />
                                                {review.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all border border-zinc-700/50">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-zinc-600 italic text-sm">No pending tasks in the queue. You're all caught up!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Performance */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Engagement
                    </h2>
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />

                        <div className="relative z-10 space-y-6">
                            <div>
                                <p className="text-xs font-black text-indigo-200 uppercase tracking-[0.2em] opacity-80">Completion Rate</p>
                                <div className="flex items-end gap-3 mt-4">
                                    <h3 className="text-5xl font-black text-white italic tracking-tighter tabular-nums">{data?.stats?.avgCompletion}%</h3>
                                    <div className="flex items-center gap-1 text-emerald-300 text-[10px] font-black mb-2">
                                        <ArrowUpRight className="w-3 h-3" />
                                        +4.2%
                                    </div>
                                </div>
                            </div>

                            <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-white transition-all duration-1000"
                                    style={{ width: `${data?.stats?.avgCompletion}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-100 uppercase tracking-widest opacity-80">
                                <span>Target: 80%</span>
                                <span>High Productivity</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] space-y-6">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">Active Live Streams</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-2xl border border-border border-dashed">
                                <Link href="/instructor/live" className="flex-1 flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-200">Go Live Now</p>
                                        <p className="text-[10px] text-zinc-500">Start an interactive session</p>
                                    </div>
                                </Link>
                                <ArrowRight className="w-4 h-4 text-zinc-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

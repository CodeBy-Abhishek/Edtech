"use client";

import React, { useEffect, useState } from 'react';
import { Users, BookOpen, DollarSign, Award, TrendingUp, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';

interface Stats {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    recentUsers: number;
    recentPayments: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = stats ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', change: `+${stats.recentUsers} this week` },
        { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10', change: 'Active' },
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: `${stats.recentPayments} payments this week` },
        { label: 'Enrollments', value: stats.totalEnrollments, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10', change: 'All time' }
    ] : [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Dashboard</h1>
                <p className="text-zinc-400">Complete platform overview and management</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-zinc-900/50 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                                        <ArrowUpRight className="w-3 h-3" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-zinc-500">{stat.label}</p>
                                <p className="text-xs text-zinc-600 mt-2">{stat.change}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="font-bold text-zinc-100 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-400" />
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Manage Users', href: '/admin/users' },
                                    { label: 'Manage Courses', href: '/admin/courses' },
                                    { label: 'View Payments', href: '/admin/payments' },
                                    { label: 'View Certificates', href: '/admin/certificates' }
                                ].map((action, i) => (
                                    <a
                                        key={i}
                                        href={action.href}
                                        className="block p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors text-sm text-zinc-300 hover:text-white"
                                    >
                                        {action.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="font-bold text-zinc-100 mb-4">Recent Activity</h3>
                            <div className="space-y-3 text-sm text-zinc-400">
                                <p>• {stats?.recentUsers} new users registered this week</p>
                                <p>• {stats?.recentPayments} successful payments processed</p>
                                <p>• Platform running smoothly</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

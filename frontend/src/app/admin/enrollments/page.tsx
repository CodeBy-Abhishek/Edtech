"use client";

import React, { useEffect, useState } from 'react';
import { UserCheck, BookOpen, Calendar } from 'lucide-react';
import api from '@/lib/api';

interface Enrollment {
    id: string;
    user: { name: string; email: string };
    course: { title: string };
    progress: number;
    status: string;
    createdAt: string;
}

export default function EnrollmentsManagement() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await api.get('/admin/enrollments');
                setEnrollments(res.data);
            } catch (error) {
                console.error("Failed to fetch enrollments", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Enrollment Management</h1>
                <p className="text-zinc-400">Monitor all course enrollments across the platform</p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-zinc-900/50 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-zinc-900/80 border-b border-zinc-800">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Student</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Course</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Progress</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Enrolled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map(enrollment => (
                                <tr key={enrollment.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-medium text-zinc-200">{enrollment.user.name}</p>
                                            <p className="text-xs text-zinc-500">{enrollment.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-zinc-300">{enrollment.course.title}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden max-w-[100px]">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{ width: `${enrollment.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-zinc-400">{enrollment.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${enrollment.status === 'ACTIVE'
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-zinc-800 text-zinc-500'
                                            }`}>
                                            {enrollment.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-zinc-400 text-sm">
                                        {new Date(enrollment.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

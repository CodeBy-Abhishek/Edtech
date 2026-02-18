"use client";

import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

interface Assignment {
    id: string;
    title: string;
    course: string;
    dueDate: string;
    status: string;
    grade?: string;
}

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await api.get('/assignments/my-assignments');
                setAssignments(res.data);
            } catch (error) {
                console.error("Failed to fetch assignments", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'SUBMITTED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'GRADED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Assignments</h1>
                    <p className="text-zinc-400">Track and manage your course deliverables.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-zinc-900/50 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : assignments.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                    <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-zinc-300">No Assignments Found</h3>
                    <p className="text-zinc-500 text-sm">You're all caught up! Enrolling in more courses might add new tasks.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-zinc-800 rounded-xl">
                                    <FileText className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-zinc-100 mb-1">{assignment.title}</h3>
                                    <p className="text-sm text-zinc-500 mb-3">{assignment.course}</p>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getStatusColor(assignment.status)}`}>
                                            {assignment.status}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Due: {assignment.dueDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {assignment.status === 'GRADED' && (
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Grade</p>
                                        <p className="text-lg font-bold text-emerald-400">{assignment.grade}</p>
                                    </div>
                                )}
                                <button className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl text-sm transition-all flex items-center gap-2">
                                    {assignment.status === 'PENDING' ? 'Start' : 'View Details'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

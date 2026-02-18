"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LabInterface } from '@/components/lms/LabInterface';
import { ChevronLeft, Loader2, RefreshCcw } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function LabWorkspacePage() {
    const { id } = useParams();
    const router = useRouter();
    const [lab, setLab] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLab = async () => {
            try {
                const res = await api.get(`/labs/${id}`);
                setLab(res.data);
            } catch (err: any) {
                console.error("Failed to fetch lab details", err);
                setError(err.response?.data?.message || "Virtual environment failed to initialize.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchLab();
    }, [id]);

    if (isLoading) {
        return (
            <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-white/10 border-b-white/50 rounded-full animate-spin-reverse" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-xs font-black text-white uppercase tracking-[0.3em] animate-pulse">Allocating Resources</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Initializing Secure Instance...</p>
                </div>
            </div>
        );
    }

    if (error || !lab) {
        return (
            <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-center mb-8">
                    <RefreshCcw className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-black text-zinc-100 mb-4 uppercase tracking-widest italic">{error || "Terminal Link Offline"}</h1>
                <p className="text-zinc-500 max-w-md mx-auto mb-8 uppercase text-[10px] font-bold tracking-widest leading-loose">The requested virtual endpoint could not be established. Please verify your clearance and retry.</p>
                <Link href="/dashboard/labs" className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest">
                    Return to Hangar
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
            {/* Minimalist Tech Header */}
            <header className="h-14 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl px-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-zinc-900 rounded-xl transition-all text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-zinc-800/50" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1">Active Lab Session</span>
                        <h2 className="text-sm font-bold text-zinc-100 tracking-tight">{lab.title}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Encrypted Stream</span>
                    </div>
                </div>
            </header>

            {/* Workplace Area */}
            <div className="flex-1 overflow-hidden">
                <LabInterface lab={lab} />
            </div>
        </div>
    );
}

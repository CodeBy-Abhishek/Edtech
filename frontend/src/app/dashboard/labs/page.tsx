"use client";

import React, { useEffect, useState } from 'react';
import { Terminal, Box, Globe, Cpu, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LabsPage() {
    const [labs, setLabs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const res = await api.get('/labs/my-labs');
                setLabs(res.data);
            } catch (error) {
                console.error("Failed to fetch labs", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLabs();
    }, []);

    const handleBoot = (id: string) => {
        router.push(`/dashboard/labs/${id}`);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-zinc-100 italic flex items-center gap-3">
                    <Terminal className="w-8 h-8 text-indigo-500" />
                    Virtual Cloud Labs
                </h1>
                <p className="text-zinc-500">Hands-on practice environments with zero-setup browser access.</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-zinc-900/40 rounded-[32px] animate-pulse" />
                    ))}
                </div>
            ) : labs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-[32px] border-dashed">
                    <Box className="w-16 h-16 text-zinc-700 mb-6" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No active lab environments detected.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {labs.map((lab, i) => (
                        <div key={i} className="group bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 space-y-8 hover:border-indigo-500/30 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                                    <Cpu className="w-7 h-7" />
                                </div>
                                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${lab.submissions?.length > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                                    {lab.submissions?.length > 0 ? lab.submissions[0].status : 'READY'}
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] font-mono leading-none">VIRTUAL ENVIRONMENT</span>
                                <h3 className="text-lg font-bold text-zinc-100 mt-2 italic">{lab.title}</h3>
                                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest mt-1">ID: {lab.id.slice(0, 8)}</p>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <button
                                    onClick={() => handleBoot(lab.id)}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all uppercase tracking-widest active:scale-95"
                                >
                                    Boot Lab
                                </button>
                                <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                                    <Box className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

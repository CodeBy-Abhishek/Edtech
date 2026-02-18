"use client";

import React from 'react';
import { Video, Calendar, Clock, ArrowUpRight } from 'lucide-react';

export default function LiveClassesPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-zinc-100 italic flex items-center gap-3">
                    <Video className="w-8 h-8 text-rose-500" />
                    Live Sessions
                </h1>
                <p className="text-zinc-500">Scheduled interactive workshops and expert-led Q&A sessions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-bold text-zinc-200">Scheduled for Today</h2>
                    {[1, 2].map((_, i) => (
                        <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-indigo-500/30 transition-all">
                            <div className="w-full md:w-48 h-32 bg-zinc-950 rounded-2xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-indigo-600/10 animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <Video className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                                    <span className="px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">Upcoming</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 4:30 PM (IST)</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">Micro-benchmarking & Performance in Node.js</h3>
                                    <p className="text-zinc-500 text-sm mt-1 font-medium italic">by Lead Engineer, Aryan Sharma</p>
                                </div>
                                <a href="/dashboard/live/live-class-1" className="block w-fit">
                                    <button className="px-8 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-black text-xs rounded-xl transition-all uppercase tracking-widest shadow-xl shadow-white/5 active:scale-95">
                                        Join Waiting Room
                                    </button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    <div className="bg-indigo-600 p-8 rounded-[40px] shadow-2xl shadow-indigo-600/20 space-y-6 relative overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                        <h3 className="text-xl font-black italic tracking-tighter text-white">Weekly Calendar Office Hours</h3>
                        <p className="text-indigo-100/70 text-sm leading-relaxed font-medium">Book a 1-on-1 slot with mentors to resolve your technical queries.</p>
                        <button className="w-full py-4 bg-black/20 hover:bg-black/30 border border-white/20 text-white font-bold text-xs rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            View Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

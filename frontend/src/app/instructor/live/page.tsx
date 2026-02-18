"use client";

import React, { useEffect, useState } from 'react';
import { Video, Users, MessageSquare, Play, StopCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function instructorLiveControl() {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [sessionTitle, setSessionTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/instructor/courses');
                setCourses(res.data);
                if (res.data.length > 0) setSelectedCourse(res.data[0].id);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleGoLive = async () => {
        if (!sessionTitle) {
            toast.error("Please enter a session title");
            return;
        }

        setIsStarting(true);
        try {
            const course = courses.find(c => c.id === selectedCourse);
            await api.post('/instructor/go-live', {
                courseId: selectedCourse,
                title: sessionTitle
            });
            setIsLive(true);
            toast.success("Broadcasting Live Signal! 📡");
        } catch (error) {
            toast.error("Failed to start session");
        } finally {
            setIsStarting(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-zinc-500 animate-pulse">Syncing Instructor Data...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-100 tracking-tighter italic uppercase flex items-center gap-3">
                        <Video className="w-8 h-8 text-red-500" />
                        Live Broadcast Center
                    </h1>
                    <p className="text-zinc-500 mt-1 font-medium italic">Instantly broadcast to all enrolled scholars across the grid.</p>
                </div>
                {isLive && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">On Air</span>
                    </div>
                )}
            </div>

            {!isLive ? (
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Play className="w-48 h-48 -rotate-12" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Target Course Orbit</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                            >
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Session Protocol Name</label>
                            <input
                                type="text"
                                placeholder="e.g. System Design Deep-Dive"
                                value={sessionTitle}
                                onChange={(e) => setSessionTitle(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800/50">
                        <button
                            onClick={handleGoLive}
                            disabled={isStarting}
                            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black py-5 rounded-3xl transition-all flex items-center justify-center gap-3 group shadow-xl shadow-red-900/20 active:scale-[0.98]"
                        >
                            {isStarting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Play className="w-6 h-6 fill-current" />
                                    START LIVE BROADCAST
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
                            <Users className="w-6 h-6 text-indigo-400" />
                            <div>
                                <h3 className="text-3xl font-black text-zinc-100 italic tabular-nums">142</h3>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Scholars Watching</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
                            <MessageSquare className="w-6 h-6 text-emerald-400" />
                            <div>
                                <h3 className="text-3xl font-black text-zinc-100 italic tabular-nums">28</h3>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Chat Pulse</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
                            <StopCircle className="w-6 h-6 text-red-500" />
                            <button
                                onClick={() => setIsLive(false)}
                                className="w-full py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Kill Session
                            </button>
                        </div>
                    </div>

                    <div className="bg-black border border-zinc-800 rounded-[3rem] aspect-video flex items-center justify-center relative shadow-2xl overflow-hidden ring-1 ring-white/5">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        <div className="text-center relative z-10 space-y-4">
                            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/40">
                                <Video className="w-10 h-10 text-white animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-black text-white italic tracking-tight">{sessionTitle}</h2>
                            <p className="text-zinc-400 text-sm">Session ID: {selectedCourse?.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 flex items-center justify-between text-xs font-bold text-zinc-600">
                <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Ultra-low latency pipe active
                </span>
                <span>Signal Strength: 98%</span>
            </div>
        </div>
    );
}

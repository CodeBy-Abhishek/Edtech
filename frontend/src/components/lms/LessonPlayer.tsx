"use client";

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
    Maximize2,
    Settings,
    Volume2,
    SkipForward,
    SkipBack,
    Share2,
    MoreVertical,
    Play,
    Pause,
    RotateCcw,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DRMWatermark } from './DRMWatermark';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface LessonPlayerProps {
    lesson: any;
    onComplete?: () => void;
}

export const LessonPlayer = ({ lesson, onComplete }: LessonPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [quality, setQuality] = useState('720p');
    const [showControls, setShowControls] = useState(true);
    const [userName, setUserName] = useState('STUDENT');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        setIsCompleted(lesson.lessonProgress?.[0]?.isCompleted || false);
    }, [lesson]);

    const handleComplete = async () => {
        if (isCompleted) return;
        setIsCompleting(true);
        try {
            await api.post('/courses/complete-lesson', { lessonId: lesson.id });
            setIsCompleted(true);
            toast.success("Progress Synchronized!");
            if (onComplete) onComplete();
        } catch (error) {
            console.error("Failed to complete lesson", error);
            toast.error("Failed to sync progress");
        } finally {
            setIsCompleting(false);
        }
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUserName(user.name || 'STUDENT');
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !lesson.videoUrl || lesson.type !== 'VIDEO') return;

        // HLS Logic
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(lesson.videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Ready to play
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = lesson.videoUrl;
        }

        // Load progress from localStorage
        const savedTime = localStorage.getItem(`lesson-progress-${lesson.id}`);
        if (savedTime) {
            video.currentTime = parseFloat(savedTime);
        }

        const handleTimeUpdate = () => {
            const current = video.currentTime;
            const duration = video.duration;
            setProgress((current / (duration || 1)) * 100);

            // Save progress every 5 seconds
            if (Math.floor(current) % 5 === 0) {
                localStorage.setItem(`lesson-progress-${lesson.id}`, current.toString());
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, [lesson.id, lesson.videoUrl, lesson.type]);

    const togglePlay = () => {
        if (videoRef.current?.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current?.pause();
            setIsPlaying(false);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width);
        videoRef.current.currentTime = percentage * videoRef.current.duration;
    };

    return (
        <div className="flex-1 bg-background overflow-y-auto transition-colors duration-300">
            {/* Video Container */}
            <div
                className="relative aspect-video bg-black group overflow-hidden shadow-2xl"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => isPlaying && setShowControls(false)}
            >
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />

                {/* DRM Watermark */}
                <DRMWatermark userId={`${userName}_ID_${Math.floor(Math.random() * 10000)}`} />

                {/* Custom Controls */}
                <div className={cn(
                    "absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-300 flex flex-col gap-4",
                    showControls ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                )}>
                    {/* Progress Bar */}
                    <div
                        className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer relative group/progress transition-all hover:h-2"
                        onClick={handleProgressChange}
                    >
                        <div
                            className="absolute inset-y-0 left-0 bg-primary rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                        <div
                            className="absolute w-4 h-4 bg-white rounded-full -top-1.5 opacity-0 group-hover/progress:opacity-100 shadow-xl transition-opacity"
                            style={{ left: `${progress}%`, marginLeft: '-8px' }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-5">
                                <RotateCcw
                                    className="w-5 h-5 text-white/70 hover:text-white cursor-pointer transition-colors"
                                    onClick={() => videoRef.current!.currentTime -= 10}
                                />
                                <button
                                    onClick={togglePlay}
                                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-6 h-6 text-black fill-current" />
                                    ) : (
                                        <Play className="w-6 h-6 text-black fill-current ml-1" />
                                    )}
                                </button>
                                <SkipForward
                                    className="w-5 h-5 text-white/70 hover:text-white cursor-pointer transition-colors"
                                    onClick={() => videoRef.current!.currentTime += 10}
                                />
                            </div>

                            <div className="flex items-center gap-3 group/volume">
                                <Volume2 className="w-5 h-5 text-white/70" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300 accent-primary cursor-pointer h-1"
                                />
                            </div>

                            <span className="text-xs font-bold text-white/80 font-mono tracking-wider">
                                {videoRef.current ? Math.floor(videoRef.current.currentTime / 60) : '0'}:
                                {videoRef.current ? Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0') : '00'}
                                <span className="mx-2 text-white/30">/</span>
                                {videoRef.current && isFinite(videoRef.current.duration) ? Math.floor(videoRef.current.duration / 60) : '0'}:
                                {videoRef.current && isFinite(videoRef.current.duration) ? Math.floor(videoRef.current.duration % 60).toString().padStart(2, '0') : '00'}
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="relative group/quality">
                                <button className="text-[10px] font-black text-white/70 hover:text-white cursor-pointer px-3 py-1.5 border border-white/20 rounded-lg transition-all hover:bg-white/10 flex items-center gap-2">
                                    <Settings className="w-3.5 h-3.5" />
                                    {quality}
                                </button>
                                {/* Quality Menu */}
                                <div className="absolute bottom-full right-0 mb-3 w-32 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 opacity-0 pointer-events-none group-hover/quality:opacity-100 group-hover/quality:pointer-events-auto transition-all shadow-2xl">
                                    <p className="px-2 py-1.5 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-1">Quality</p>
                                    {['1080p', '720p', '480p', 'Auto'].map(q => (
                                        <button
                                            key={q}
                                            onClick={() => setQuality(q)}
                                            className={cn(
                                                "w-full text-left px-2 py-2 text-xs rounded-lg transition-colors flex items-center justify-between",
                                                quality === q ? "bg-primary text-white" : "hover:bg-white/5 text-zinc-400"
                                            )}
                                        >
                                            {q}
                                            {quality === q && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-white/50" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Maximize2
                                className="w-5 h-5 text-white/70 hover:text-white cursor-pointer transition-colors"
                                onClick={() => videoRef.current?.requestFullscreen()}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lesson Info */}
            <div className="p-10 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-border pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.1em] border border-primary/20">
                                {lesson.type}
                            </span>
                            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">High Definition • HLS Optimized</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight">{lesson.title}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-border transition-all text-muted-foreground hover:text-foreground font-bold text-sm shadow-sm active:scale-95">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        <button
                            onClick={handleComplete}
                            disabled={isCompleting}
                            className={cn(
                                "flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 disabled:opacity-50",
                                isCompleted
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    : "bg-primary text-white hover:bg-primary/90"
                            )}
                        >
                            {isCompleting ? (
                                <RotateCcw className="w-4 h-4 animate-spin" />
                            ) : isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            {isCompleted ? "Unit Completed" : "Complete & Continue"}
                        </button>
                        <button className="p-3 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-border transition-all text-muted-foreground hover:text-foreground shadow-sm active:scale-95">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="mt-10">
                    <div className="flex items-center gap-10 border-b border-border mb-8 overflow-x-auto no-scrollbar">
                        {['Overview', 'Resources', 'Notes', 'Community'].map((tab, i) => (
                            <button
                                key={tab}
                                className={cn(
                                    "pb-6 text-sm font-bold transition-all relative outline-none whitespace-nowrap uppercase tracking-widest",
                                    i === 0 ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab}
                                {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                            </button>
                        ))}
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-lg">
                        <p className="first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                            {lesson.content || "In this lesson, we will explore the fundamental architecture of modern web applications. We'll cover everything from client-side state management to server-side optimization techniques."}
                        </p>

                        <div className="my-12 p-8 bg-card border border-border rounded-[2rem] shadow-sm">
                            <h3 className="text-foreground mt-0 mb-6 font-black text-xl uppercase tracking-widest italic">Key Learning Points:</h3>
                            <ul className="space-y-4 list-none pl-0">
                                {[
                                    "Understanding the Virtual DOM and reconciliation pipeline.",
                                    "Hydration strategies for Server Components.",
                                    "Optimizing data fetching patterns with Suspense."
                                ].map((point, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50" />
                                        </div>
                                        <span className="text-foreground/80 font-medium">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

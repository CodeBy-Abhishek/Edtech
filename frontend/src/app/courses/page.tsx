"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, BookOpen, Clock, Star, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { CheckoutButton } from '@/components/checkout/CheckoutButton';

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnailUrl: string;
    instructor: { name: string };
    _count: { modules: number };
    isTrending?: boolean;
    category: string;
}

export default function CoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const trendingCourses = courses.filter(c => c.isTrending);
    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white p-8 pb-20">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase">Explore <span className="text-primary tracking-normal not-italic">Knowledge</span></h1>
                        <p className="text-zinc-500 font-medium">Master new skills with our expert-led engineering tracks.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tracks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-primary/50 outline-none w-64 transition-all focus:bg-zinc-900 focus:shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                            />
                        </div>
                        <button className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors group">
                            <Filter className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* Trending Section */}
                {!isLoading && trendingCourses.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                            <h2 className="text-2xl font-black uppercase tracking-widest italic">Trending <span className="text-primary not-italic">Now</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {trendingCourses.slice(0, 2).map((course, idx) => (
                                <div
                                    key={course.id}
                                    onClick={() => router.push(`/courses/${course.id}`)}
                                    className="group relative h-[300px] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 hover:border-primary/30 transition-all duration-500"
                                >
                                    <img
                                        src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop'}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                    <div className="absolute top-6 left-6 flex items-center gap-2">
                                        <div className="bg-primary/20 backdrop-blur-xl border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Trending #{idx + 1}</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-8 left-8 right-8 space-y-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">{course.category || 'Engineering'}</span>
                                        <h3 className="text-3xl font-black tracking-tight">{course.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-black">
                                                    {course.instructor?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-xs font-bold text-white/70">{course.instructor?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-primary">
                                                Go Live <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Courses Grid */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-zinc-800 rounded-full" />
                            <h2 className="text-xl font-bold uppercase tracking-[0.15em] text-zinc-400">All Modules</h2>
                        </div>
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{filteredCourses.length} Tracks Available</span>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] h-[400px] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map(course => (
                                <div
                                    key={course.id}
                                    onClick={() => router.push(`/courses/${course.id}`)}
                                    className="group bg-zinc-900/40 border border-zinc-800/50 hover:border-primary/20 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col cursor-pointer"
                                >
                                    <div className="aspect-[4/5] bg-zinc-800 relative overflow-hidden">
                                        <img
                                            src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop'}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />

                                        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full text-[10px] font-black border border-white/5 flex items-center gap-1.5">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="tracking-widest">4.9</span>
                                        </div>

                                        {course.isTrending && (
                                            <div className="absolute top-6 left-6 bg-primary px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30">
                                                Trending
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 flex flex-col flex-1 bg-zinc-950/50 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">{course.category || 'Development'}</span>
                                            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                                <BookOpen className="w-3 h-3" />
                                                <span>{course._count?.modules || 0} Modules</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black mb-3 tracking-tight group-hover:text-primary transition-colors duration-300 leading-tight">{course.title}</h3>
                                        <p className="text-zinc-500 text-sm mb-8 line-clamp-2 flex-1 font-medium leading-relaxed">{course.description}</p>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-600 mb-1 uppercase tracking-widest">Expert</p>
                                                <p className="text-sm font-bold text-zinc-300 italic">{course.instructor?.name || 'Unknown'}</p>
                                            </div>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <CheckoutButton courseId={course.id} price={course.price || 4999} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

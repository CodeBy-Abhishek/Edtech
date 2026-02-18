"use client";

import React from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Users,
    DollarSign,
    BookOpen,
    Layers,
    Edit,
    Trash2,
    ExternalLink,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const CourseCard = ({ course }: any) => (
    <div className="group bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
        <div className="relative h-48 bg-zinc-950 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <img
                src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
            />
            <div className="absolute top-4 left-4 z-20">
                <div className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border",
                    course.isPublished ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" : "bg-zinc-800/80 text-zinc-400 border-zinc-700"
                )}>
                    {course.isPublished ? 'Published' : 'Draft'}
                </div>
            </div>
            <div className="absolute bottom-4 left-6 right-6 z-20 flex items-end justify-between">
                <h3 className="text-lg font-bold text-white line-clamp-1 italic">{course.title}</h3>
            </div>
        </div>

        <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Modules</p>
                    <p className="text-sm font-bold text-zinc-300 mt-2">{course._count?.modules || 0}</p>
                </div>
                <div className="text-center border-x border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Students</p>
                    <p className="text-sm font-bold text-zinc-300 mt-2">{course._count?.enrollments || 0}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Revenue</p>
                    <p className="text-sm font-bold text-emerald-400 mt-2">${(course._count?.enrollments || 0) * course.price}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                    <Edit className="w-3.5 h-3.5 text-indigo-400" />
                    Edit Content
                </button>
                <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

export default function InstructorCoursesPage() {
    const [courses, setCourses] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showCreateModal, setShowCreateModal] = React.useState(false);

    // Form State
    const [newCourse, setNewCourse] = React.useState({
        title: '',
        description: '',
        category: 'Development',
        price: '',
        thumbnailUrl: ''
    });

    const fetchCourses = async () => {
        try {
            const res = await api.get('/instructor/courses');
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to fetch instructor courses", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/courses', newCourse);
            toast.success("Course created successfully!");
            setShowCreateModal(false);
            setNewCourse({ title: '', description: '', category: 'Development', price: '', thumbnailUrl: '' });
            fetchCourses();
        } catch (error) {
            toast.error("Failed to create course");
            console.error(error);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-zinc-100 tracking-tight flex items-center gap-3 italic">
                        <Layers className="w-10 h-10 text-indigo-500" />
                        My Courses
                    </h1>
                    <p className="text-zinc-500 mt-2">Create, manage, and scale your educational content.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create New Course
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[430px] bg-zinc-900/40 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="h-[430px] border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center gap-4 group hover:bg-zinc-900/10 hover:border-indigo-500/50 transition-all font-inter"
                    >
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                            <Plus className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">Launch New Course</p>
                            <p className="text-xs text-zinc-600 mt-1">Ready to share your expertise?</p>
                        </div>
                    </button>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-bold mb-6 italic flex items-center gap-2">
                            <Plus className="w-6 h-6 text-indigo-500" />
                            Create New Identity
                        </h2>

                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-1">Course Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newCourse.title}
                                    onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                                    placeholder="e.g. Advanced Quantum Computing"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-1">Description</label>
                                <textarea
                                    required
                                    value={newCourse.description}
                                    onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                                    placeholder="What will students learn?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-1">Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCourse.category}
                                        onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-1">Price (INR)</label>
                                    <input
                                        type="number"
                                        required
                                        value={newCourse.price}
                                        onChange={e => setNewCourse({ ...newCourse, price: e.target.value })}
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Launch Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

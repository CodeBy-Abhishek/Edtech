"use client";

import React, { useState, useEffect } from 'react';
import {
    GripVertical,
    Plus,
    ChevronDown,
    ChevronUp,
    MoreHorizontal,
    Play,
    FileText,
    Video,
    Terminal,
    Save,
    Eye,
    Settings,
    X,
    PlusCircle,
    Clock,
    ExternalLink,
    ChevronLeft,
    Edit2,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const LessonItem = ({ lesson, index }: any) => (
    <div className="flex items-center gap-4 bg-black/40 border border-zinc-800 p-4 rounded-2xl group hover:border-zinc-700 transition-all">
        <GripVertical className="w-4 h-4 text-zinc-700 cursor-grab active:cursor-grabbing" />
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-all">
            {lesson.type === 'VIDEO' ? <Video className="w-4 h-4" /> :
                lesson.type === 'LAB' ? <Terminal className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-zinc-200">{lesson.title}</h4>
            <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{lesson.type}</span>
                <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                <span className="text-[10px] text-zinc-600 flex items-center gap-1 font-mono uppercase tracking-widest text-wrap whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {lesson.duration || "10:00"}
                </span>
            </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 text-zinc-500 hover:text-zinc-200">
                <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-zinc-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

const ModuleEditor = ({ module, index, onAddLesson }: any) => {
    const [isOpen, setIsOpen] = useState(true);

    // Flatten lessons from all topics
    const allLessons = module.topics?.flatMap((t: any) => t.lessons) || [];

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-6 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-4">
                    <GripVertical className="w-4 h-4 text-zinc-700" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] font-mono leading-none">Module {index + 1}</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-100 mt-1 italic">{module.title}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="p-6 space-y-4 border-t border-zinc-800/50">
                    {allLessons.map((lesson: any, i: number) => (
                        <LessonItem key={lesson.id || i} lesson={lesson} index={i} />
                    ))}
                    <button
                        onClick={() => onAddLesson(module.id)}
                        className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl flex items-center justify-center gap-2 text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Add New Lesson
                    </button>
                </div>
            )}
        </div>
    );
};

export default function CourseEditorPage() {
    const { id } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('curriculum');
    const [isLoading, setIsLoading] = useState(true);

    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newLesson, setNewLesson] = useState({ title: '', type: 'VIDEO', content: '', videoUrl: '' });

    const fetchCourse = async () => {
        try {
            const res = await api.get(`/courses/${id}`);
            setCourse(res.data);
        } catch (error) {
            toast.error("Failed to fetch course details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const handleAddModule = async () => {
        try {
            await api.post('/courses/module', {
                courseId: id,
                title: newModuleTitle,
                order: (course?.modules?.length || 0) + 1
            });
            toast.success("Module added!");
            setIsModuleModalOpen(false);
            setNewModuleTitle('');
            fetchCourse();
        } catch (error) {
            toast.error("Failed to add module");
        }
    };

    const handleAddLesson = async () => {
        try {
            // First, ensure a topic exists for this module
            const module = course.modules.find((m: any) => m.id === selectedModuleId);
            let topicId;

            if (module.topics && module.topics.length > 0) {
                topicId = module.topics[0].id;
            } else {
                const topicRes = await api.post('/courses/topic', {
                    moduleId: selectedModuleId,
                    title: 'General',
                    order: 1
                });
                topicId = topicRes.data.id;
            }

            await api.post('/courses/lesson', {
                topicId,
                ...newLesson,
                order: (module.topics?.[0]?.lessons?.length || 0) + 1
            });

            toast.success("Lesson added!");
            setIsLessonModalOpen(false);
            setNewLesson({ title: '', type: 'VIDEO', content: '', videoUrl: '' });
            fetchCourse();
        } catch (error) {
            toast.error("Failed to add lesson");
        }
    };

    if (isLoading) return <div className="p-20 text-center text-zinc-500 italic animate-pulse">Initializing editor core...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Editor Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-zinc-900 pb-10">
                <div className="space-y-3">
                    <Link href="/instructor/courses" className="text-xs font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4" /> Back to Courses
                    </Link>
                    <h1 className="text-4xl font-black text-zinc-100 italic tracking-tight">{course?.title}</h1>
                    <div className="flex items-center gap-4">
                        <span className={cn(
                            "px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-widest",
                            course?.isPublished ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        )}>
                            {course?.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-xs text-zinc-500 flex items-center gap-1.5 uppercase tracking-widest font-bold">
                            <Clock className="w-4 h-4" /> Updated {new Date(course?.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/courses/${id}`} className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-2xl hover:text-white transition-all flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4" />
                        Preview
                    </Link>
                    <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 text-sm">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Primary Navigation Tabs */}
            <div className="flex items-center gap-10 border-b border-zinc-900 overflow-x-auto no-scrollbar">
                {['curriculum', 'details', 'settings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "pb-6 text-xs font-bold uppercase tracking-[0.2em] transition-all relative outline-none",
                            activeTab === tab ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full shadow-[0_-4px_10px_rgba(99,102,241,0.5)]" />}
                    </button>
                ))}
            </div>

            {/* Editor Content Area */}
            <div className="space-y-8">
                {activeTab === 'curriculum' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-zinc-100">Course Curriculum</h2>
                                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold font-mono">
                                    {course.modules?.length || 0} Modules • {course.modules?.reduce((acc: number, m: any) => acc + (m.topics?.flatMap((t: any) => t.lessons).length || 0), 0)} Lessons Total
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModuleModalOpen(true)}
                                className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 rounded-xl hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest"
                            >
                                <Plus className="w-4 h-4 text-indigo-500" />
                                New Module
                            </button>
                        </div>

                        <div className="space-y-6">
                            {course.modules?.map((module: any, i: number) => (
                                <ModuleEditor
                                    key={module.id}
                                    module={module}
                                    index={i}
                                    onAddLesson={(mid: string) => {
                                        setSelectedModuleId(mid);
                                        setIsLessonModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab !== 'curriculum' && (
                    <div className="h-96 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-12 italic">
                        <Settings className="w-12 h-12 text-zinc-800 mb-6" />
                        <h3 className="text-xl font-bold text-zinc-200 uppercase tracking-widest">Module under development</h3>
                        <p className="text-zinc-500 mt-2 max-w-sm">We are refining the interface for {activeTab}. Please use the curriculum editor to manage your content for now.</p>
                    </div>
                )}
            </div>

            {/* Module Modal */}
            {isModuleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-3xl p-8 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4 italic">Add New Module</h3>
                        <input
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                            className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none mb-6"
                            placeholder="Module Title"
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setIsModuleModalOpen(false)} className="flex-1 py-3 bg-zinc-800 rounded-xl text-xs font-bold text-zinc-400">Cancel</button>
                            <button onClick={handleAddModule} className="flex-1 py-3 bg-indigo-600 rounded-xl text-xs font-bold">Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lesson Modal */}
            {isLessonModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-8 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-6 italic">Add New Lesson</h3>
                        <div className="space-y-4">
                            <input
                                value={newLesson.title}
                                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                                placeholder="Lesson Title"
                            />
                            <select
                                value={newLesson.type}
                                onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                            >
                                <option value="VIDEO">Video</option>
                                <option value="DOCUMENT">Document</option>
                                <option value="LAB">Practical Lab</option>
                            </select>
                            <input
                                value={newLesson.videoUrl}
                                onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                                placeholder="Video URL (Optional)"
                            />
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setIsLessonModalOpen(false)} className="flex-1 py-3 bg-zinc-800 rounded-xl text-xs font-bold text-zinc-400">Cancel</button>
                            <button onClick={handleAddLesson} className="flex-1 py-3 bg-indigo-600 rounded-xl text-xs font-bold">Add Lesson</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

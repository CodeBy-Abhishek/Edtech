"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash, StickyNote, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface Note {
    id: string;
    title: string;
    content: string;
    courseId?: string;
    lessonId?: string;
    createdAt: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // New note state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes');
            setNotes(res.data);
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/notes', { title, content });
            setTitle('');
            setContent('');
            setIsCreating(false);
            fetchNotes();
        } catch (error) {
            console.error("Failed to create note", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`);
            // Optimistic update
            setNotes(notes.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete note", error);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Notes</h1>
                    <p className="text-zinc-400">Capture your ideas and learning highlights.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Note
                </button>
            </div>

            <div className="flex gap-8 flex-1 overflow-hidden">
                {/* Notes List */}
                <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 no-scrollbar">
                    {isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-48 bg-zinc-900/50 rounded-2xl animate-pulse" />)
                    ) : notes.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 h-64 border border-zinc-900 rounded-2xl border-dashed">
                            <StickyNote className="w-12 h-12 mb-4 opacity-50" />
                            <p>No notes yet. Click "New Note" to get started.</p>
                        </div>
                    ) : (
                        notes.map(note => (
                            <div key={note.id} className="bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl p-6 group transition-all flex flex-col relative">
                                {note.courseId && (
                                    <div className="absolute top-4 right-4 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest italic">Course Link</span>
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-zinc-100 mb-2 pr-12">{note.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4 flex-1 whitespace-pre-wrap">{note.content}</p>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50">
                                    <span className="text-xs text-zinc-600 font-mono">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="text-zinc-600 hover:text-red-400 transition-colors p-2 -mr-2 rounded-lg hover:bg-red-400/10"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Create Modal / Sidebar for Simplicity */}
                {isCreating && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg p-8 relative shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Create Note</h2>
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Note title..."
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Content</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={8}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:border-indigo-500 outline-none transition-all resize-none"
                                        placeholder="Write your thoughts here..."
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                                    >
                                        Save Note
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

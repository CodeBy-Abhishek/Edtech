"use client";

import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash, Loader2, Save, X } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface Note {
    id: string;
    title: string;
    content: string;
    courseId?: string;
    lessonId?: string;
    createdAt: string;
}

export const NotesSidebar = ({ courseId, lessonId, isOpen, onClose }: {
    courseId?: string,
    lessonId?: string,
    isOpen: boolean,
    onClose: () => void
}) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchNotes();
        }
    }, [isOpen, courseId, lessonId]);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/notes');
            // Filter notes for this specific context if provided
            let filtered = res.data;
            if (courseId) {
                filtered = filtered.filter((n: Note) => n.courseId === courseId);
            }
            setNotes(filtered);
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newNote.title || !newNote.content) {
            toast.error("Please fill in both title and content");
            return;
        }

        setIsSaving(true);
        try {
            await api.post('/notes', {
                ...newNote,
                courseId,
                lessonId
            });
            toast.success("Note saved!");
            setNewNote({ title: '', content: '' });
            setIsCreating(false);
            fetchNotes();
        } catch (error) {
            toast.error("Failed to save note");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n.id !== id));
            toast.success("Note deleted");
        } catch (error) {
            toast.error("Failed to delete note");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="w-80 h-[calc(100vh-64px)] bg-zinc-950 border-l border-zinc-900 flex flex-col z-40 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-black text-zinc-100 uppercase tracking-widest italic">Personal Notes</h3>
                </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {isCreating ? (
                    <div className="bg-zinc-900/50 border border-indigo-500/30 rounded-2xl p-4 space-y-4 animate-in fade-in zoom-in-95">
                        <input
                            type="text"
                            placeholder="Note Title"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                            autoFocus
                        />
                        <textarea
                            placeholder="Write your thoughts..."
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none resize-none"
                            rows={6}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-zinc-400 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isSaving}
                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full py-3 border border-zinc-800 border-dashed rounded-2xl text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                    >
                        <Plus className="w-3 h-3" />
                        Quick Note
                    </button>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-10 text-zinc-600">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-10 opacity-30">
                        <StickyNote className="w-10 h-10 mx-auto mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">No notes for this context</p>
                    </div>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 group hover:border-zinc-800 transition-all">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-xs font-bold text-zinc-200">{note.title}</h4>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
                                >
                                    <Trash className="w-3 h-3" />
                                </button>
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-[9px] font-mono text-zinc-700">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

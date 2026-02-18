"use client";

import React from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Hash, Search } from 'lucide-react';

export default function CommunityPage() {
    const discussions = [
        {
            id: 1,
            title: "How to handle state management effectively in Next.js 15?",
            author: "Alex Morgan",
            avatar: "AM",
            tags: ["Next.js", "React"],
            replies: 12,
            likes: 45,
            time: "2 hours ago"
        },
        {
            id: 2,
            title: "Project ideas for the final assessment",
            author: "Sarah Chen",
            avatar: "SC",
            tags: ["Project", "General"],
            replies: 8,
            likes: 23,
            time: "5 hours ago"
        },
        {
            id: 3,
            title: "Understanding tRPC vs REST API",
            author: "Mike Ross",
            avatar: "MR",
            tags: ["Backend", "API"],
            replies: 24,
            likes: 89,
            time: "1 day ago"
        }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Community</h1>
                    <p className="text-zinc-400">Connect, share, and learn with your peers.</p>
                </div>

                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                    New Discussion
                </button>
            </div>

            <div className="flex gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-4">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search discussions..."
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-zinc-200 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {discussions.map(post => (
                        <div key={post.id} className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-all group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                                    {post.avatar}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">
                                                #{tag}
                                            </span>
                                        ))}
                                        <span className="text-xs text-zinc-600">• {post.time}</span>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{post.replies} Replies</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>{post.likes} Likes</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="w-80 hidden lg:block space-y-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="font-bold text-zinc-100 mb-4 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-indigo-400" />
                            Popular Topics
                        </h3>
                        <div className="space-y-2">
                            {["JavaScript", "React", "Career Advice", "Showcase"].map(topic => (
                                <div key={topic} className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors group">
                                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200">#{topic}</span>
                                    <span className="text-xs text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full">24</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

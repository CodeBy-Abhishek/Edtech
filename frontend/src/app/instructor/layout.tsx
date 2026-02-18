"use client";

import React from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    Search,
    PlusCircle,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
    <Link
        href={href}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
            active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
        )}
    >
        <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:scale-110 transition-transform")} />
        <span className="text-sm font-medium">{label}</span>
    </Link>
);

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/instructor' },
        { icon: BookOpen, label: 'My Courses', href: '/instructor/courses' },
        { icon: Users, label: 'Students', href: '/instructor/students' },
        { icon: BarChart3, label: 'Analytics', href: '/instructor/analytics' },
        { icon: Settings, label: 'Settings', href: '/instructor/settings' },
    ];

    return (
        <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-inter">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 flex flex-col p-6 space-y-8 bg-zinc-950/50 backdrop-blur-xl">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter italic">EDUCATOR<span className="text-indigo-500">.</span></span>
                </div>

                <nav className="flex-1 space-y-1">
                    <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Instructor Portal</p>
                    {sidebarItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            {...item}
                            active={pathname === item.href}
                        />
                    ))}
                </nav>

                <div className="pt-6 border-t border-zinc-900">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group">
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-10 bg-zinc-950/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl w-96 group focus-within:border-indigo-500/50 transition-all">
                        <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400" />
                        <input
                            type="text"
                            placeholder="Search students, courses..."
                            className="bg-transparent border-none outline-none text-sm text-zinc-300 w-full placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
                            <PlusCircle className="w-4 h-4" />
                            Create Course
                        </button>

                        <div className="w-px h-6 bg-zinc-800" />

                        <button className="relative p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black" />
                        </button>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-zinc-100 leading-none">Prof. Aryan</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Lead Instructor</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 font-bold group-hover:border-indigo-500/50 transition-all">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent)]">
                    {children}
                </div>
            </main>
        </div>
    );
}

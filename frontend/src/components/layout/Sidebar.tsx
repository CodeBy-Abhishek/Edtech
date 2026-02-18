"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    Video,
    FileText,
    Terminal,
    Trophy,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    User,
    StickyNote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const sidebarLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Live Classes', href: '/dashboard/live', icon: Video },
    { name: 'Assignments', href: '/dashboard/assignments', icon: FileText },
    { name: 'Study Notes', href: '/dashboard/notes', icon: StickyNote },
    { name: 'Practicals & Labs', href: '/dashboard/labs', icon: Terminal },
];

const instructorLinks = [
    { name: 'Instructor Dashboard', href: '/instructor', icon: LayoutDashboard },
    { name: 'Managed Courses', href: '/instructor/courses', icon: BookOpen },
    { name: 'Live Session Control', href: '/instructor/live', icon: Video },
    { name: 'Student Analytics', href: '/instructor/analytics', icon: Users },
];

const adminLinks = [
    { name: 'System Admin', href: '/admin', icon: Settings },
    { name: 'User Management', href: '/admin/users', icon: User },
    { name: 'Rev & Payments', href: '/admin/payments', icon: Trophy },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user: userData, logout } = useAuth();

    // Legacy state handling removed in favor of useAuth

    const handleLogout = () => {
        logout();
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border flex flex-col z-50 transition-colors duration-300">
            <div className="p-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    EDTECH PRO
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto no-scrollbar">
                {/* Regular Student Links */}
                <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] px-3 mb-2 italic">Learning Base</div>
                {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center justify-between group px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                <span>{link.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4" />}
                        </Link>
                    );
                })}

                {/* Instructor Links */}
                {(userData?.role === 'INSTRUCTOR' || userData?.role === 'ADMIN') && (
                    <div className="mt-8">
                        <div className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.2em] px-3 mb-2 italic">Instructor Core</div>
                        {instructorLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center justify-between group px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                            : "text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-muted-foreground group-hover:text-indigo-400")} />
                                        <span>{link.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Admin Links */}
                {(userData?.role === 'ADMIN') && (
                    <div className="mt-8">
                        <div className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.2em] px-3 mb-2 italic">Command Center</div>
                        {adminLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center justify-between group px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                            : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={cn("w-5 h-5", isActive ? "text-amber-500" : "text-muted-foreground group-hover:text-amber-500")} />
                                        <span>{link.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

            <div className="p-4 border-t border-border space-y-3">
                {/* User Profile Display */}
                {userData && (
                    <div className="px-3 py-2 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                                {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{userData.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground capitalize">{userData.role?.toLowerCase() || 'Student'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <span>Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-400/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

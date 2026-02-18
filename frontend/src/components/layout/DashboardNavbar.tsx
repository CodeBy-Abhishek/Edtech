"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationCenter } from '@/components/lms/NotificationCenter';
import { useAuth } from '@/context/AuthContext';

export const DashboardNavbar = () => {
    const { user: userData } = useAuth();

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    };

    return (
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-4 bg-muted/50 border border-border px-3 py-1.5 rounded-full w-96">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search courses, lessons, labs..."
                    className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder:text-muted-foreground/60"
                />
            </div>

            <div className="flex items-center gap-6">
                <ThemeToggle />
                <NotificationCenter />

                {userData && (
                    <div className="flex items-center gap-3 pl-6 border-l border-border">
                        <div className="text-right">
                            <p className="text-sm font-medium text-foreground">{userData.name || 'User'}</p>
                            <p className="text-xs text-muted-foreground capitalize">{userData.role?.toLowerCase() || 'Student'}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {getInitials(userData.name)}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CreditCard,
    Award,
    UserCheck,
    LogOut,
    ChevronRight,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Enrollments', href: '/admin/enrollments', icon: UserCheck },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-black flex">
            <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col z-50">
                <div className="p-6 border-b border-zinc-900">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-6 h-6 text-red-500" />
                        <h1 className="text-xl font-bold text-white">ADMIN PANEL</h1>
                    </div>
                    <p className="text-xs text-zinc-600 uppercase tracking-wider">Full Platform Access</p>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
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
                                        ? "bg-red-600/10 text-red-400 border border-red-500/20"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={cn("w-5 h-5", isActive ? "text-red-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                                    <span>{link.name}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-900">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-64">
                {children}
            </main>
        </div>
    );
}

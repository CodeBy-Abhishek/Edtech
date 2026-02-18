import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <DashboardNavbar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

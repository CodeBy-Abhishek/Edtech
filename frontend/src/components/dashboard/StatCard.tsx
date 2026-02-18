"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
}

export const StatCard = ({ label, value, icon: Icon, trend, trendUp }: StatCardProps) => {
    return (
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                {trend && (
                    <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        trendUp ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                    )}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <h4 className="text-zinc-500 text-sm font-medium">{label}</h4>
                <p className="text-2xl font-bold text-zinc-100 mt-1">{value}</p>
            </div>
        </div>
    );
};

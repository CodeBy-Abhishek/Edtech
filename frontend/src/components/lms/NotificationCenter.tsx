"use client";

import { Bell, CheckCircle2, AlertCircle, Info, CreditCard, BookOpen, X, Circle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export const NotificationCenter = () => {
    const { notifications, unreadCount, markAsRead, markAllRead, isLoading } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'WARNING': return <AlertCircle className="w-4 h-4 text-amber-500" />;
            case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'PAYMENT': return <CreditCard className="w-4 h-4 text-indigo-500" />;
            case 'ASSIGNMENT': return <BookOpen className="w-4 h-4 text-blue-500" />;
            default: return <Info className="w-4 h-4 text-zinc-400" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-2xl transition-all active:scale-95"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[10px] font-black rounded-full border-2 border-background flex items-center justify-center shadow-lg">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-4 w-[22rem] sm:w-[26rem] bg-card border border-border rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in slide-in-from-top-4 duration-300 origin-top-right">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Bell className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="font-black text-foreground uppercase tracking-[0.2em] text-[10px] italic">Activity Signals</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={markAllRead}
                                    className="text-[10px] font-black text-muted-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors"
                                >
                                    Log All Read
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[30rem] overflow-y-auto no-scrollbar">
                            {isLoading ? (
                                <div className="p-16 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Scanning Uplinks...</p>
                                </div>
                            ) : notifications.length > 0 ? (
                                <div className="divide-y divide-border/50">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => markAsRead(n.id)}
                                            className={cn(
                                                "p-6 flex gap-5 hover:bg-muted/30 transition-all cursor-pointer group relative",
                                                !n.isRead && "bg-primary/[0.02]"
                                            )}
                                        >
                                            {!n.isRead && <div className="absolute left-0 top-6 bottom-6 w-1 bg-primary rounded-r-full" />}
                                            <div className="shrink-0">
                                                <div className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                    {getTypeIcon(n.type)}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className={cn("text-sm font-black tracking-tight", n.isRead ? "text-muted-foreground" : "text-foreground")}>{n.title}</p>
                                                    {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50" />}
                                                </div>
                                                <p className="text-[12px] text-muted-foreground leading-relaxed font-medium opacity-80">{n.message}</p>
                                                <div className="flex items-center justify-between pt-3">
                                                    <div className="flex items-center gap-2 opacity-60">
                                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    {n.link && (
                                                        <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-80 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                                            Review Details
                                                            <ArrowRight className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 text-center space-y-6">
                                    <div className="relative inline-block">
                                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground/30">
                                            <Bell className="w-8 h-8" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-card" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-foreground font-black uppercase tracking-[0.3em] italic mb-1">Clear Horizon</p>
                                        <p className="text-[10px] text-muted-foreground font-bold italic opacity-60">You're completely up to date.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-t border-border bg-muted/10">
                            <button className="w-full py-3 text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-[0.2em] transition-all hover:bg-muted rounded-xl">
                                Archive Timeline
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

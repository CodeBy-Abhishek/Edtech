"use client";

import React from 'react';
import { Shield, Lock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const LegalSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 italic">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            {title}
        </h2>
        <div className="text-zinc-400 text-sm leading-relaxed space-y-4 ml-3.5 border-l border-zinc-900 pl-6">
            {children}
        </div>
    </section>
);

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 font-inter py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4">
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-5xl font-black italic tracking-tighter">Privacy Policy</h1>
                    <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">Safe • Secure • Transparent</p>
                </div>

                {/* Branding Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[32px] space-y-4">
                        <Shield className="w-8 h-8 text-indigo-500" />
                        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Data Protection</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed uppercase font-bold">Your personal information is encrypted using industry-standard protocols.</p>
                    </div>
                    <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[32px] space-y-4">
                        <Lock className="w-8 h-8 text-emerald-500" />
                        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">No Third-Party Sales</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed uppercase font-bold">We never sell your data to advertisers or third-party marketing firms.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    <LegalSection title="1. Information Collection">
                        <p>We collect information you provide directly to us, such as when you create an account, purchase a course, or contact support. This includes your name, email address, and payment information.</p>
                    </LegalSection>

                    <LegalSection title="2. Usage of Data">
                        <p>We use the information to personalize your learning experience, process transactions, and send you technical notices and security alerts.</p>
                    </LegalSection>

                    <LegalSection title="3. Cookies & Tracking">
                        <p>We use cookies to maintain your session and remember your progress. You can disable cookies in your browser, but some features may not function correctly.</p>
                    </LegalSection>
                </div>

                {/* Footer */}
                <div className="pt-20 border-t border-zinc-900 flex flex-col items-center gap-8">
                    <div className="flex gap-8 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        <Link href="/legal/terms" className="hover:text-zinc-100 transition-colors">Terms of Service</Link>
                        <Link href="/legal/refund" className="hover:text-zinc-100 transition-colors">Refund Policy</Link>
                    </div>
                    <p className="text-zinc-700 text-[10px] uppercase font-bold tracking-widest">© 2024 EDUCATOR Pro Global. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
}

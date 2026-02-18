"use client";

import React from 'react';
import { Shield, Lock, FileText, ChevronLeft, ArrowRight } from 'lucide-react';
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

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 font-inter py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4">
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-5xl font-black italic tracking-tighter">Terms of Service</h1>
                    <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">Last Updated: January 23, 2024</p>
                </div>

                {/* Introduction Panel */}
                <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[40px] space-y-6 text-center italic">
                    <p className="text-zinc-300 leading-relaxed text-lg">
                        "By accessing EDUCATOR Pro, you agree to be bound by these terms. We are committed to providing the highest quality technical education while maintaining a safe and secure environment for all learners."
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    <LegalSection title="1. User Accounts">
                        <p>You must be at least 13 years of age to use this platform. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
                        <p>We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.</p>
                    </LegalSection>

                    <LegalSection title="2. Intellectual Property">
                        <p>All content included on this platform, such as text, graphics, logos, video clips, and digital downloads, is the property of EDUCATOR Pro or its content suppliers and protected by international copyright laws.</p>
                        <p><strong>Strict Prohibition:</strong> Any attempt to download, record, or redistribute course content without explicit authorization will result in immediate termination of access without refund.</p>
                    </LegalSection>

                    <LegalSection title="3. Course Access">
                        <p>Course access is granted for the duration specified at the time of purchase. Some courses may include "Lifetime Access," which refers to the lifetime of the platform.</p>
                    </LegalSection>

                    <LegalSection title="4. Prohibited Conduct">
                        <p>Users are prohibited from using the platform for any unlawful purpose, to solicit others to perform or participate in any unlawful acts, or to violate any international, federal, or state regulations.</p>
                    </LegalSection>
                </div>

                {/* Footer */}
                <div className="pt-20 border-t border-zinc-900 flex flex-col items-center gap-8">
                    <div className="flex gap-8 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        <Link href="/legal/privacy" className="hover:text-zinc-100 transition-colors">Privacy Policy</Link>
                        <Link href="/legal/refund" className="hover:text-zinc-100 transition-colors">Refund Policy</Link>
                        <Link href="/contact" className="hover:text-zinc-100 transition-colors">Contact Support</Link>
                    </div>
                    <p className="text-zinc-700 text-[10px] uppercase font-bold tracking-widest">© 2024 EDUCATOR Pro Global. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
}

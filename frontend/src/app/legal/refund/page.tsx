"use client";

import React from 'react';
import { DollarSign, RefreshCcw, ChevronLeft } from 'lucide-react';
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

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 font-inter py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4">
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-5xl font-black italic tracking-tighter">Refund Policy</h1>
                    <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">Fair Returns • 100% Satisfaction</p>
                </div>

                {/* Refund Status Indicator */}
                <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-zinc-100 italic">7-Day Money Back Guarantee</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Available on all standard professional courses.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    <LegalSection title="1. Eligibility">
                        <p>Refunds are available for requests made within 7 days of purchase, provided that less than 20% of the course content has been accessed or viewed.</p>
                    </LegalSection>

                    <LegalSection title="2. Non-Refundable Items">
                        <p>Certain special workshops, live bootcamps, or courses purchased with significant promotional discounts may be non-refundable. This will be clearly stated at the time of purchase.</p>
                    </LegalSection>

                    <LegalSection title="3. Processing Time">
                        <p>Once approved, refunds are processed within 5-7 business days and will be credited back to the original payment method.</p>
                    </LegalSection>
                </div>

                {/* Footer */}
                <div className="pt-20 border-t border-zinc-900 flex flex-col items-center gap-8">
                    <div className="flex gap-8 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        <Link href="/legal/terms" className="hover:text-zinc-100 transition-colors">Terms of Service</Link>
                        <Link href="/legal/privacy" className="hover:text-zinc-100 transition-colors">Privacy Policy</Link>
                    </div>
                    <p className="text-zinc-700 text-[10px] uppercase font-bold tracking-widest">© 2024 EDUCATOR Pro Global. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
}

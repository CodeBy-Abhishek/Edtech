"use client";

import React, { useRef } from 'react';
import {
    Download,
    Share2,
    Linkedin,
    CheckCircle2,
    ShieldCheck,
    Award,
    Calendar,
    User,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificateProps {
    certificate: {
        certificateId: string;
        issueDate: string;
        user: { name: string };
        course: { title: string };
        metadata: {
            grade: string;
        };
    };
}

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';

export const CertificatePreview = ({ certificate }: CertificateProps) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        const generatePromise = new Promise(async (resolve, reject) => {
            try {
                const element = certificateRef.current!;

                // Create canvas from the certificate element
                const canvas = await html2canvas(element, {
                    scale: 3, // Higher scale for better PDF quality
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');

                // Create PDF (Landscape A4)
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });

                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`Certificate_${certificate.user.name.replace(/\s+/g, '_')}_${certificate.certificateId}.pdf`);

                resolve('Success');
            } catch (err) {
                console.error("PDF generation failed", err);
                reject(err);
            }
        });

        toast.promise(generatePromise, {
            loading: 'Mastering your certificate PDF...',
            success: 'Certificate downloaded! 🎉',
            error: 'Failed to generate PDF. Please try again.'
        });
    };

    return (
        <div className="flex-1 flex flex-col bg-background overflow-y-auto transition-colors duration-300">
            <div className="max-w-6xl mx-auto w-full p-10 md:p-14 space-y-14">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-border pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] italic">
                            <ShieldCheck className="w-5 h-5" />
                            Official Verified Credential
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight">Outstanding Achievement, {certificate.user.name}!</h1>
                        <p className="text-muted-foreground text-sm font-medium opacity-80 max-w-2xl">
                            Your expertise in {certificate.course.title} has been formally recognized. This credential is encrypted and stored on our global verification network.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDownload}
                            className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-[1.5rem] transition-all shadow-2xl shadow-primary/20 active:scale-95 flex items-center gap-3 text-xs uppercase tracking-widest"
                        >
                            <Download className="w-5 h-5" />
                            Export PDF
                        </button>
                        <div className="flex items-center gap-2">
                            <button className="p-4 bg-card border border-border text-muted-foreground hover:text-foreground rounded-2xl transition-all shadow-sm hover:border-primary/50">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-4 bg-card border border-border text-muted-foreground hover:text-blue-500 rounded-2xl transition-all shadow-sm hover:border-blue-500/50">
                                <Linkedin className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Certificate Rendering Area */}
                <div className="relative group max-w-5xl mx-auto w-full">
                    {/* Perspective shadow */}
                    <div className="absolute -inset-10 bg-primary/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    {/* Decorative Background Frame */}
                    <div className="absolute inset-0 bg-card border border-border rounded-[2.5rem] -rotate-1 scale-[1.02] opacity-50" />
                    <div className="absolute inset-0 bg-card border border-border rounded-[2.5rem] rotate-1 scale-[1.01] opacity-30" />

                    {/* Certificate Frame */}
                    <div
                        ref={certificateRef}
                        className="relative aspect-[1.414/1] w-full bg-[#ffffff] text-[#09090b] rounded-[1.5rem] p-16 flex flex-col items-center justify-between shadow-2xl border-[24px] border-[#09090b] select-none overflow-hidden"
                    >
                        {/* Elegant Corner Motifs */}
                        <div className="absolute top-4 left-4 w-24 h-24 border-t-2 border-l-2 border-[#d4d4d8] opacity-20" />
                        <div className="absolute top-4 right-4 w-24 h-24 border-t-2 border-r-2 border-[#d4d4d8] opacity-20" />
                        <div className="absolute bottom-4 left-4 w-24 h-24 border-b-2 border-l-2 border-[#d4d4d8] opacity-20" />
                        <div className="absolute bottom-4 right-4 w-24 h-24 border-b-2 border-r-2 border-[#d4d4d8] opacity-20" />

                        {/* Central Watermark Pattern */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none scale-150 rotate-12">
                            <span className="text-[100px] font-black italic tracking-tighter">CERTIFIED</span>
                        </div>

                        {/* Header Section */}
                        <div className="w-full flex justify-between items-start">
                            <div className="flex flex-col gap-2">
                                <div className="w-12 h-12 bg-[#09090b] rounded-lg flex items-center justify-center">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-[10px] font-black tracking-[0.3em] text-[#09090b]">EDTECH PRO</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-[#71717a] uppercase tracking-[0.2em] mb-1">Document Hash</p>
                                <p className="text-[8px] font-mono text-[#09090b] font-bold">SHA-256: {certificate.certificateId.substring(0, 16)}...</p>
                            </div>
                        </div>

                        {/* Central Text */}
                        <div className="text-center space-y-10 flex-1 flex flex-col justify-center max-w-3xl">
                            <h2 className="text-[12px] font-black text-[#a1a1aa] uppercase tracking-[0.5em] leading-none mb-4 italic">
                                Certificate of Mastery and Qualification
                            </h2>
                            <p className="text-[14px] text-[#71717a] font-bold uppercase tracking-[0.2em]">This document certifies that</p>
                            <h3 className="text-[64px] font-black text-[#09090b] font-serif lowercase italic tracking-tighter leading-none py-4">
                                {certificate.user.name}
                            </h3>
                            <div className="w-32 h-1 bg-[#09090b] mx-auto opacity-10" />
                            <p className="text-[16px] text-[#52525b] font-medium leading-relaxed italic">
                                has fulfilled all technical requirements, demonstrated mastery of advanced concepts, and successfully completed the program
                            </p>
                            <h4 className="text-[32px] font-black text-[#09090b] tracking-tight uppercase">
                                {certificate.course.title}
                            </h4>
                        </div>

                        {/* Footer Section */}
                        <div className="w-full grid grid-cols-3 items-end pt-12 border-t border-[#f4f4f5]">
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-[#a1a1aa] uppercase tracking-[0.3em]">Date of Issue</p>
                                    <p className="text-[14px] font-black text-[#09090b]">{new Date(certificate.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-[#a1a1aa] uppercase tracking-[0.3em]">Credential ID</p>
                                    <p className="text-[10px] font-mono font-bold text-[#4f46e5]">{certificate.certificateId}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 rounded-full border-[1px] border-dashed border-[#d4d4d8] flex items-center justify-center relative">
                                    <ShieldCheck className="w-10 h-10 text-[#4f46e5]" />
                                    <div className="absolute inset-0 border-[0.5px] border-[#4f46e5] rounded-full scale-[1.15] opacity-20" />
                                </div>
                                <p className="text-[9px] font-black text-[#09090b] uppercase tracking-[0.4em] italic">Official Seal</p>
                            </div>

                            <div className="text-right space-y-4">
                                <div className="space-y-2">
                                    <div className="flex flex-col items-end">
                                        <p className="text-[18px] font-serif italic font-black text-[#09090b] leading-none mb-1">E. Rivera</p>
                                        <div className="h-[1.5px] w-40 bg-[#09090b]" />
                                    </div>
                                    <p className="text-[9px] font-black text-[#a1a1aa] uppercase tracking-[0.3em]">Chief Academic Officer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-card/40 border border-border rounded-[2rem] space-y-6 group hover:border-emerald-500/30 transition-all duration-500">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic">Cryptographic Validity</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">Verified current. This certificate represents immutable proof of expertise recorded on our platform's secure vault.</p>
                    </div>

                    <div className="p-8 bg-card/40 border border-border rounded-[2rem] space-y-6 group hover:border-primary/30 transition-all duration-500">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5 group-hover:scale-110 transition-transform">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic">Global Enrollment</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">Issued on {new Date(certificate.issueDate).toLocaleDateString()}. Recognized by top tech institutions worldwide.</p>
                    </div>

                    <div className="p-8 bg-card/40 border border-border rounded-[2rem] space-y-6 group hover:border-amber-500/30 transition-all duration-500">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-500/5 group-hover:scale-110 transition-transform">
                            <ExternalLink className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic">Verification Node</h3>
                        <p className="text-xs font-mono text-primary leading-relaxed truncate font-bold">verify.edtechpro.com/{certificate.certificateId.substring(0, 8)}</p>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`verify.edtechpro.com/${certificate.certificateId}`);
                                toast.success('Verification URL copied!');
                            }}
                            className="text-[10px] text-muted-foreground hover:text-primary transition-all uppercase font-black tracking-[0.2em] flex items-center gap-2 group/btn"
                        >
                            Copy Registry Link
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { ArrowRight } from 'lucide-react';


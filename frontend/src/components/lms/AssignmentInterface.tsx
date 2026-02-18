"use client";

import React, { useState } from 'react';
import {
    FileText,
    Upload,
    CheckCircle2,
    Clock,
    Link as LinkIcon,
    MessageSquare,
    History
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export const AssignmentInterface = ({ assignment }: { assignment: any }) => {
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(assignment.status === 'SUBMITTED');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!submissionUrl) return;

        setIsSubmitting(true);

        const submissionPromise = api.post('/assignments/submit', {
            assignmentId: assignment.id,
            fileUrl: submissionUrl // Matching backend controller field name
        });

        toast.promise(submissionPromise, {
            loading: 'Delivering project archive...',
            success: (res) => {
                setIsSubmitted(true);
                return 'Project lodged successfully! Evaluation pending.';
            },
            error: (err) => {
                const msg = err.response?.data?.message || 'Delivery failed. Check connection.';
                return msg;
            }
        });

        try {
            await submissionPromise;
        } catch (err) {
            console.error("Submission failed", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-background overflow-y-auto transition-colors duration-300">
            <div className="max-w-5xl mx-auto w-full p-10 md:p-14 space-y-14">
                {/* Assignment Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 border-b border-border pb-10">
                    <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-lg shadow-primary/5">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight">{assignment.title}</h1>
                            <div className="flex items-center gap-6 mt-4">
                                <span className="text-xs font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest opacity-70">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'Jan 30, 2024'}
                                </span>
                                <span className="text-xs font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest opacity-70">
                                    <Award className="w-4 h-4 text-primary" />
                                    Max Points: {assignment.maxPoints || 100}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm",
                            isSubmitted
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        )}>
                            {isSubmitted ? 'Submitted' : 'Open for Submission'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                    {/* Description & Requirements */}
                    <div className="lg:col-span-2 space-y-10">
                        <section className="space-y-6">
                            <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] italic flex items-center gap-2">
                                <span className="w-8 h-px bg-border" />
                                Task Description
                            </h2>
                            <div className="bg-card/50 border border-border rounded-[2rem] p-8 shadow-sm group hover:border-primary/20 transition-all duration-500">
                                <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed">
                                    <p className="font-medium">{assignment.description || "In this assignment, you will build a scalable microservice using Node.js and Docker. You must implement independent scaling for the checkout component."}</p>
                                    <h4 className="text-foreground font-black mt-8 mb-4 uppercase tracking-widest text-sm">Target Objectives:</h4>
                                    <ul className="list-none pl-0 space-y-4">
                                        {(assignment.requirements || [
                                            "Implement a RESTful API using Express.",
                                            "Use Redis for distributed caching.",
                                            "Dockerize the application and provide a docker-compose.yml file.",
                                            "Setup a basic CI/CD pipeline script (GitHub Actions/Lab)."
                                        ]).map((req: string, i: number) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                </div>
                                                <span className="text-foreground/70">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] italic flex items-center gap-2">
                                <span className="w-8 h-px bg-border" />
                                Supporting Assets
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(assignment.resources || [1, 2]).map((res: any, i: number) => (
                                    <div key={i} className="p-5 bg-card/40 border border-border rounded-2xl flex items-center gap-4 hover:border-primary hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group">
                                        <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
                                            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{res.name || `Asset_Package_0${i + 1}.zip`}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 font-mono">{res.size || '3.2 MB'} • REPOSITORY</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Submission Panel */}
                    <div className="space-y-8">
                        <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] italic flex items-center gap-2">
                            <span className="w-8 h-px bg-border" />
                            Portal
                        </h2>

                        {!isSubmitted ? (
                            <div className="bg-card/50 border border-border rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Submission URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="url"
                                            value={submissionUrl}
                                            onChange={(e) => setSubmissionUrl(e.target.value)}
                                            placeholder="https://github.com/..."
                                            className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 text-sm text-foreground outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/40 shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Evidence (PDF/Code)</label>
                                    <div className="border border-border border-dashed rounded-[2rem] py-12 flex flex-col items-center justify-center gap-4 hover:bg-muted/30 transition-all cursor-pointer group bg-background/30">
                                        <div className="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all group-hover:scale-110">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-foreground font-black uppercase tracking-widest">Upload Archive</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">Drop file or click to browse</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!submissionUrl || isSubmitting}
                                    className="w-full py-5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-[0.1em] text-xs"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Submit Project
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/[0.03] border border-emerald-500/20 rounded-[2.5rem] p-10 text-center space-y-6 animate-in fade-in zoom-in duration-700 shadow-sm">
                                <div className="relative inline-block">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-ping opacity-20" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-emerald-500 uppercase tracking-widest leading-none mb-3">Project Lodged</h3>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                        Your work is locked for evaluation. Feedback will appear in your notification center.
                                    </p>
                                </div>
                                <div className="pt-6 flex flex-col gap-3">
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="w-full py-3 bg-muted border border-border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-background transition-all"
                                    >
                                        Revise Submission
                                    </button>
                                    <button className="flex items-center justify-center gap-3 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:opacity-80 transition-all">
                                        <MessageSquare className="w-4 h-4" />
                                        Project Lead
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Deadline Alert */}
                        <div className="p-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-[2rem] flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-4 h-4 text-amber-500/70" />
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                Final deadline is approaching. Ensure your repository has restricted access and a clear README.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { Download, ArrowRight, Award, AlertCircle, Loader2 } from 'lucide-react';


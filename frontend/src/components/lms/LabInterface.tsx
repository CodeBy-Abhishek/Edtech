import React, { useState } from 'react';
import {
    Terminal,
    ExternalLink,
    CheckCircle2,
    FileText,
    AlertCircle,
    Play,
    Upload,
    Link as LinkIcon,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export const LabInterface = ({ lab }: { lab: any }) => {
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(lab.submissions?.length > 0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!submissionUrl) return;
        setIsSubmitting(true);

        const submissionPromise = api.post('/labs/submit', {
            labId: lab.id,
            submissionUrl
        });

        toast.promise(submissionPromise, {
            loading: 'Uploading lab report...',
            success: (res) => {
                setIsSubmitted(true);
                return 'Lab submitted successfully! Evaluation in progress.';
            },
            error: (err) => {
                return err.response?.data?.message || 'Failed to submit lab report.';
            }
        });

        try {
            await submissionPromise;
        } catch (error) {
            console.error("Lab submission error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden font-sans">
            <div className="flex-1 flex overflow-hidden">
                {/* Lab Content (Manual) */}
                <div className="flex-1 overflow-y-auto p-10 border-r border-zinc-900/50">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                        Secure Lab Environment
                                    </span>
                                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Instance ID: LAB-{lab.id.slice(0, 8).toUpperCase()}</span>
                                </div>
                                <h1 className="text-4xl font-black text-zinc-100 tracking-tight italic">{lab.title}</h1>
                                <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">{lab.description}</p>
                            </div>
                        </div>

                        {/* Lab Manual Section */}
                        <div className="space-y-8">
                            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                Operation Manual
                                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                            </h2>
                            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] p-10 prose prose-invert max-w-none text-zinc-400 shadow-2xl">
                                <h3 className="text-zinc-100 font-bold mb-6 uppercase tracking-widest text-sm italic">Scenario Objectives:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    {[
                                        "Establish secure authentication handshake",
                                        "Validate data integrity across nodes",
                                        "Perform controlled exploit simulation",
                                        "Implement patching and recovery protocol"
                                    ].map((obj, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
                                            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-[10px] font-black">
                                                0{i + 1}
                                            </div>
                                            <span className="text-sm font-medium">{obj}</span>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="text-zinc-100 font-bold mb-6 uppercase tracking-widest text-sm italic">Execution Steps:</h3>
                                <div className="space-y-6">
                                    {(lab.manualUrl || "Boot your local environment, navigate to the target port, and begin the scanning sequence as defined in the architectural blueprint.").split('\n').map((step: string, i: number) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-indigo-500/50 transition-colors shadow-lg">
                                                <span className="text-[10px] font-black text-zinc-600 group-hover:text-indigo-400">{i + 1}</span>
                                            </div>
                                            <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-200 transition-colors pt-1.5">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Session / Setup Commands */}
                        <div className="space-y-8">
                            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                                <Terminal className="w-5 h-5 text-indigo-500" />
                                Initialization
                                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                            </h2>
                            <div className="bg-black/80 backdrop-blur-xl border border-indigo-500/20 rounded-[2rem] p-8 font-mono text-xs text-indigo-300 shadow-2xl shadow-indigo-500/5 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <Terminal className="w-32 h-32 -mr-8 -mt-8 rotate-12" />
                                </div>
                                <div className="space-y-3 relative z-10">
                                    {(lab.setupCommands || "$ git clone https://github.com/edtech-labs/environment.git\n$ cd environment\n$ docker-compose up --build").split('\n').map((cmd: string, i: number) => (
                                        <div key={i} className="flex gap-4">
                                            <span className="text-zinc-700 select-none">{i + 1}</span>
                                            <p className="tracking-wide">{cmd}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Console Sidebar */}
                <div className="w-[28rem] bg-zinc-950/50 backdrop-blur-3xl flex flex-col border-l border-zinc-900">
                    {/* Lab Instance Control */}
                    <div className="p-10 border-b border-zinc-900 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-[10px] text-zinc-500 uppercase tracking-[0.3em] italic">Instance Control</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Live</span>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Time Remaining</p>
                                    <p className="text-2xl font-black text-zinc-100 font-mono italic">01:44:59</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <Play className="w-5 h-5 text-indigo-400" />
                                </div>
                            </div>

                            <button
                                onClick={() => window.open(lab.externalLabUrl || '#', '_blank')}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 active:scale-95 group"
                            >
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                Boot Virtual Machine
                            </button>
                        </div>
                    </div>

                    {/* Submission Protocol */}
                    <div className="flex-1 p-10 space-y-8 overflow-y-auto">
                        <h3 className="font-black text-[10px] text-zinc-500 uppercase tracking-[0.3em] italic">Validation Protocol</h3>

                        {!isSubmitted ? (
                            <div className="space-y-6">
                                <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-3xl space-y-6 shadow-xl">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Report Repository URL</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-4 top-4 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                value={submissionUrl}
                                                onChange={(e) => setSubmissionUrl(e.target.value)}
                                                placeholder="https://github.com/..."
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-xs text-zinc-300 focus:border-indigo-500 transition-all outline-none placeholder:text-zinc-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="border border-zinc-800 border-dashed rounded-[2rem] py-12 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-zinc-900/40 transition-all bg-zinc-950/20">
                                        <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                                            <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Lodgement Archive</p>
                                            <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-widest">Drop report or click to browse</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!submissionUrl || isSubmitting}
                                    className="w-full py-5 bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-xl shadow-white/5 active:scale-95"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {isSubmitting ? 'Verifying Path...' : 'Lodge Completion'}
                                </button>
                            </div>
                        ) : (
                            <div className="p-10 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-[2.5rem] flex flex-col items-center text-center gap-8 animate-in fade-in zoom-in duration-700 shadow-2xl">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-ping opacity-20" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl font-black text-emerald-500 uppercase tracking-widest italic">Phase Delivered</h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">Your findings are in the queue. Instructor review will be dispatched shortly.</p>
                                </div>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-[10px] font-black text-zinc-600 hover:text-indigo-400 uppercase tracking-[0.3em] transition-colors"
                                >
                                    Re-Initiate Submission
                                </button>
                            </div>
                        )}

                        {/* Intelligence Alert */}
                        <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] flex gap-4">
                            <AlertCircle className="w-5 h-5 text-amber-500/50 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-500/60 leading-relaxed uppercase tracking-[0.15em] font-medium">
                                Technical Warning: Ensure all ephemeral data is committed to the report before session expiration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

"use client";

import React, { useEffect, useState } from 'react';
import { Award, Download, ExternalLink, ShieldCheck, Search } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await api.get('/certificates/my-certificates');
                setCertificates(res.data);
            } catch (error) {
                console.error("Failed to fetch certificates", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCertificates();
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                        <Award className="w-8 h-8 text-indigo-500" />
                        Certifications
                    </h1>
                    <p className="text-zinc-500 mt-2">View and manage your verified professional achievements.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2].map(i => (
                        <div key={i} className="h-64 bg-zinc-900/40 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="group bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
                            <div className="relative h-48 overflow-hidden bg-zinc-950 flex items-center justify-center p-8">
                                <div className="absolute inset-4 border border-zinc-800 rounded-sm opacity-50" />
                                <div className="relative z-10 text-center space-y-3">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                        <ShieldCheck className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <p className="text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">{cert.certificateId}</p>
                                    <h4 className="text-xs font-bold text-zinc-300 line-clamp-1 px-4">{cert.course?.title}</h4>
                                </div>
                                <div className="absolute inset-0 bg-indigo-600/90 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    <button
                                        className="px-6 py-2 bg-white text-indigo-600 font-bold text-xs rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        View Official
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="font-bold text-zinc-100 italic group-hover:text-indigo-400 transition-colors line-clamp-1">{cert.course?.title}</h3>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Issue Date</p>
                                        <p className="text-xs text-zinc-400 font-medium mt-1">{new Date(cert.issueDate).toLocaleDateString()}</p>
                                    </div>
                                    <button className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl">
                    <Award className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-zinc-100">No Certificates Yet</h3>
                    <p className="text-zinc-500 mt-2 max-w-sm mx-auto">Complete your courses and pass all assessments to earn your professional certifications.</p>
                </div>
            )}
        </div>
    );
}

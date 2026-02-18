"use client";

import React, { useEffect, useState } from 'react';
import { Award, Download, Eye } from 'lucide-react';
import api from '@/lib/api';

interface Certificate {
    id: string;
    certificateId: string;
    user: { name: string; email: string };
    course: { title: string };
    issueDate: string;
    metadata: any;
}

export default function CertificatesManagement() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await api.get('/admin/certificates');
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
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Certificate Management</h1>
                <p className="text-zinc-400">View and manage all issued certificates</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-zinc-900/50 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map(cert => (
                        <div key={cert.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-amber-500/10 rounded-xl">
                                    <Award className="w-6 h-6 text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-zinc-100 mb-1">{cert.course.title}</h3>
                                    <p className="text-sm text-zinc-500">{cert.user.name}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">Certificate ID</span>
                                    <code className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded text-xs">
                                        {cert.certificateId}
                                    </code>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">Issued Date</span>
                                    <span className="text-zinc-300">
                                        {new Date(cert.issueDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">Student Email</span>
                                    <span className="text-zinc-300 text-xs">{cert.user.email}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                                <button className="flex-1 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-amber-500/20">
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '@/lib/api';

interface Payment {
    id: string;
    orderId: string;
    user: { name: string; email: string };
    course: { title: string };
    amount: number;
    status: string;
    createdAt: string;
}

export default function PaymentsManagement() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await api.get('/admin/payments');
                setPayments(res.data);
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'FAILED': return <XCircle className="w-4 h-4 text-red-400" />;
            default: return <Clock className="w-4 h-4 text-yellow-400" />;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Payment Management</h1>
                <p className="text-zinc-400">Track all transactions and revenue</p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-zinc-900/50 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-zinc-900/80 border-b border-zinc-800">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Order ID</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">User</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Course</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Amount</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-4">
                                        <code className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                                            {payment.orderId}
                                        </code>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <p className="font-medium text-zinc-200">{payment.user.name}</p>
                                            <p className="text-xs text-zinc-500">{payment.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-zinc-300 text-sm">{payment.course.title}</td>
                                    <td className="p-4">
                                        <span className="font-bold text-emerald-400">₹{payment.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(payment.status)}
                                            <span className={`text-xs font-bold ${payment.status === 'SUCCESS' ? 'text-emerald-400' :
                                                    payment.status === 'FAILED' ? 'text-red-400' : 'text-yellow-400'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-zinc-400 text-sm">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

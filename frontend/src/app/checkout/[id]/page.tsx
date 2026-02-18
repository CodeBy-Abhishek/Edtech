"use client";

import React, { useState } from 'react';
import {
    ShieldCheck,
    CreditCard,
    ChevronLeft,
    Lock,
    Tag,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Globe,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CheckoutPage() {
    const [couponCode, setCouponCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

    const course = {
        title: 'Full-Stack Web Development Masterclass',
        price: 14999,
        instructor: 'Prof. Aryan Sharma',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop'
    };

    const handleApplyCoupon = () => {
        setIsApplying(true);
        // Simulation lag
        setTimeout(() => {
            if (couponCode.toUpperCase() === 'FIRST100') {
                setAppliedCoupon({ code: 'FIRST100', discount: 20 });
            } else {
                alert('Invalid Coupon Code');
            }
            setIsApplying(false);
        }, 800);
    };

    const handlePayment = () => {
        setPaymentStatus('PROCESSING');
        setTimeout(() => setPaymentStatus('SUCCESS'), 2500);
    };

    const discountAmount = appliedCoupon ? (course.price * appliedCoupon.discount / 100) : 0;
    const totalAmount = course.price - discountAmount;

    if (paymentStatus === 'SUCCESS') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-white italic tracking-tight">Payment Successful!</h1>
                        <p className="text-zinc-500">Welcome to the masterclass. Your journey starts now.</p>
                    </div>
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-4">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                            <span>Course</span>
                            <span className="text-zinc-300">Full-Stack Masterclass</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                            <span>Transaction ID</span>
                            <span className="text-zinc-300 font-mono">#TXN_94827501</span>
                        </div>
                    </div>
                    <Link
                        href="/dashboard"
                        className="block w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-inter py-12 px-6">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">

                {/* Left: Course & Payment Info */}
                <div className="flex-1 space-y-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        <ChevronLeft className="w-4 h-4" /> Back to Course
                    </Link>

                    <div className="space-y-6">
                        <h1 className="text-4xl font-black text-white italic tracking-tight">Confirm Enrollment</h1>
                        <div className="flex flex-col sm:flex-row gap-6 p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
                            <img src={course.thumbnail} className="w-full sm:w-48 h-32 object-cover rounded-2xl" alt="Thumbnail" />
                            <div className="flex-1 space-y-2">
                                <h2 className="text-xl font-bold text-zinc-100 line-clamp-2">{course.title}</h2>
                                <p className="text-sm text-zinc-500">by {course.instructor}</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <span className="text-xs text-zinc-400 flex items-center gap-1.5 uppercase font-bold tracking-widest">
                                        <Globe className="w-3.5 h-3.5 text-indigo-400" />
                                        Lifetime Access
                                    </span>
                                    <span className="text-xs text-zinc-400 flex items-center gap-1.5 uppercase font-bold tracking-widest">
                                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                                        124 Lessons
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 italic">
                                <CreditCard className="w-5 h-5 text-indigo-500" />
                                Payment Method
                            </h3>
                            <div className="flex gap-2">
                                <div className="w-8 h-5 bg-zinc-900 border border-zinc-800 rounded opacity-50" />
                                <div className="w-8 h-5 bg-zinc-900 border border-zinc-800 rounded opacity-50" />
                                <div className="w-8 h-5 bg-zinc-900 border border-zinc-800 rounded opacity-50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="p-6 bg-indigo-600/10 border-2 border-indigo-500 rounded-3xl text-left space-y-4 group transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-100">Secure Gateway</p>
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">Stripe / Razorpay / PayPal</p>
                                </div>
                            </button>

                            <button className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl text-left space-y-4 hover:border-zinc-700 transition-all opacity-50 cursor-not-allowed">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-zinc-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-500">Crypto Payment</p>
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">Coming Soon</p>
                                </div>
                            </button>
                        </div>

                        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3">
                            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                            <p className="text-[10px] text-amber-500/70 leading-relaxed uppercase tracking-widest font-bold">
                                Transactions are encrypted using 256-bit SSL. Your financial data is never stored on our servers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="w-full lg:w-96 space-y-8">
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-[40px] p-8 space-y-8 sticky top-12">
                        <h3 className="text-xl font-bold text-zinc-100 italic">Order Summary</h3>

                        <div className="space-y-4 border-b border-zinc-800 pb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Base Price</span>
                                <span className="text-zinc-300 font-mono">₹{course.price.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-sm text-emerald-500">
                                    <span className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5" />
                                        Discount ({appliedCoupon.code})
                                    </span>
                                    <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Taxes (GST 18%)</span>
                                <span className="text-zinc-300 font-mono">Included</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Total Amount</span>
                                <span className="text-3xl font-black text-white italic tracking-tighter tabular-nums">₹{totalAmount.toLocaleString()}</span>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Have a coupon?</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={isApplying || !couponCode}
                                        className="absolute right-2 top-2 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {isApplying ? 'Applying...' : 'Apply'}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={paymentStatus === 'PROCESSING'}
                                className="w-full py-4 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-3xl transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                {paymentStatus === 'PROCESSING' ? (
                                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Pay & Enroll Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-4 opacity-50">
                            <ShieldCheck className="w-4 h-4 text-zinc-500" />
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Secured by CloudArmor</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

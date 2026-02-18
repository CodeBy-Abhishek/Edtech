"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Rocket,
    Check,
    Star,
    TrendingUp,
    Zap,
    Crown,
    CreditCard,
    Smartphone,
    Building,
    Wallet,
    Globe,
    Shield,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    const plans = [
        {
            name: 'Free',
            price: { monthly: 0, annual: 0 },
            description: 'Perfect for getting started',
            icon: Rocket,
            gradient: 'from-zinc-500 to-zinc-600',
            features: [
                'Access to 10 free courses',
                'Community forum access',
                'Basic code labs',
                'Course completion certificates',
                'Mobile app access'
            ],
            cta: 'Start Free',
            popular: false
        },
        {
            name: 'Pro',
            price: { monthly: 999, annual: 9990 },
            description: 'For serious learners',
            icon: Zap,
            gradient: 'from-indigo-500 to-violet-500',
            features: [
                'Everything in Free',
                'Unlimited course access',
                'Live mentorship sessions',
                'Advanced coding labs',
                'Industry certifications',
                'Resume review',
                'Interview preparation',
                'Priority support'
            ],
            cta: 'Start Pro Trial',
            popular: true
        },
        {
            name: 'Enterprise',
            price: { monthly: 'Custom', annual: 'Custom' },
            description: 'For teams and organizations',
            icon: Crown,
            gradient: 'from-amber-500 to-orange-500',
            features: [
                'Everything in Pro',
                'Custom learning paths',
                'Dedicated account manager',
                'Team analytics dashboard',
                'SSO & advanced security',
                'Custom integrations',
                'On-premise deployment',
                'SLA guarantee'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    const trendingCourses = [
        {
            title: 'Full-Stack Web Development',
            instructor: 'Rajesh Kumar',
            rating: 4.9,
            students: '15,234',
            price: 2999,
            originalPrice: 4999,
            image: '💻',
            badge: 'Bestseller'
        },
        {
            title: 'Data Science & Machine Learning',
            instructor: 'Priya Sharma',
            rating: 4.8,
            students: '12,456',
            price: 3499,
            originalPrice: 5999,
            image: '🤖',
            badge: 'Hot'
        },
        {
            title: 'Cloud Computing with AWS',
            instructor: 'Amit Patel',
            rating: 4.9,
            students: '10,123',
            price: 2499,
            originalPrice: 3999,
            image: '☁️',
            badge: 'New'
        },
        {
            title: 'Mobile App Development',
            instructor: 'Sneha Reddy',
            rating: 4.7,
            students: '8,567',
            price: 2799,
            originalPrice: 4499,
            image: '📱',
            badge: 'Popular'
        }
    ];

    const paymentMethods = [
        { name: 'Credit/Debit Cards', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
        { name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
        { name: 'Net Banking', icon: Building, description: 'All major banks supported' },
        { name: 'Wallets', icon: Wallet, description: 'Paytm, Mobikwik, Freecharge' },
        { name: 'International', icon: Globe, description: 'PayPal, Stripe' }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-xl border-b border-border transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight">
                            EDTECH<span className="text-primary">.</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="px-8 py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />

                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm font-medium text-emerald-400"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Save up to 40% with annual billing</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-6xl md:text-7xl font-black tracking-tight leading-tight"
                        >
                            Choose Your
                            <br />
                            <span className="bg-gradient-to-r from-primary via-violet-500 to-purple-500 bg-clip-text text-transparent">
                                Learning Path
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-muted-foreground leading-relaxed"
                        >
                            Flexible pricing for individuals and teams. Start free, upgrade anytime.
                        </motion.p>

                        {/* Billing Toggle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center gap-4 pt-8"
                        >
                            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                                Monthly
                            </span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                                className="relative w-14 h-7 bg-muted rounded-full transition-colors border border-border"
                            >
                                <div className={`absolute top-1 ${billingCycle === 'annual' ? 'right-1' : 'left-1'} w-5 h-5 bg-primary rounded-full transition-all`} />
                            </button>
                            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
                                Annual <span className="text-emerald-500">(Save 40%)</span>
                            </span>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="max-w-7xl mx-auto px-8 pb-32">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, i) => {
                            const Icon = plan.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className={`relative p-8 rounded-3xl border backdrop-blur-sm transition-all ${plan.popular
                                        ? 'bg-primary/5 border-primary/50'
                                        : 'bg-card/50 border-border'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-violet-600 rounded-full text-xs font-bold text-white">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-2">
                                            {typeof plan.price[billingCycle] === 'number' ? (
                                                <>
                                                    <span className="text-5xl font-black">₹{plan.price[billingCycle]}</span>
                                                    <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                                </>
                                            ) : (
                                                <span className="text-4xl font-black">{plan.price[billingCycle]}</span>
                                            )}
                                        </div>
                                        {billingCycle === 'annual' && typeof plan.price.annual === 'number' && typeof plan.price.monthly === 'number' && (
                                            <p className="text-sm text-emerald-500 mt-2 font-medium">Save ₹{(plan.price.monthly * 12) - plan.price.annual}</p>
                                        )}
                                    </div>

                                    <Link
                                        href="/login"
                                        className={`block w-full py-4 rounded-2xl font-bold text-center mb-8 transition-all ${plan.popular
                                            ? 'bg-foreground text-background hover:bg-foreground/90 shadow-lg'
                                            : 'bg-muted text-foreground hover:bg-muted/80'
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>

                                    <div className="space-y-3">
                                        {plan.features.map((feature, j) => (
                                            <div key={j} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Trending Courses */}
                <section className="px-8 py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent transition-colors duration-300">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-black mb-4">Trending Courses</h2>
                            <p className="text-xl text-muted-foreground">Most popular courses this month</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {trendingCourses.map((course, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="group bg-card/50 border border-border rounded-3xl overflow-hidden backdrop-blur-sm transition-all"
                                >
                                    <div className="relative p-8 bg-gradient-to-br from-primary/10 to-violet-600/10 transition-colors">
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary rounded-full text-xs font-bold text-white">
                                            {course.badge}
                                        </div>
                                        <div className="text-6xl mb-4">{course.image}</div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">{course.instructor}</p>

                                        <div className="flex items-center gap-4 mb-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                                                <span className="font-bold">{course.rating}</span>
                                            </div>
                                            <div className="text-muted-foreground">{course.students} students</div>
                                        </div>

                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-2xl font-black">₹{course.price}</span>
                                            <span className="text-sm text-muted-foreground line-through">₹{course.originalPrice}</span>
                                        </div>

                                        <Link
                                            href="/courses"
                                            className="block w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-center transition-all"
                                        >
                                            Enroll Now
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Payment Methods */}
                <section className="max-w-7xl mx-auto px-8 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-black mb-4">Secure Payment Options</h2>
                        <p className="text-xl text-muted-foreground">Multiple payment methods for your convenience</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {paymentMethods.map((method, i) => {
                            const Icon = method.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="p-6 bg-card/50 border border-border rounded-2xl text-center backdrop-blur-sm transition-all"
                                >
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-foreground mb-2">{method.name}</h3>
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-12 p-6 bg-muted/30 border border-border/50 rounded-2xl flex items-center justify-center gap-3 text-sm text-muted-foreground transition-colors"
                    >
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <span>256-bit SSL encryption • PCI DSS compliant • 100% secure payments</span>
                    </motion.div>
                </section>

                {/* FAQ */}
                <section className="max-w-4xl mx-auto px-8 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-black mb-4">Frequently Asked Questions</h2>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { q: 'Can I switch plans anytime?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
                            { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, wallets, and international payments via PayPal.' },
                            { q: 'Is there a refund policy?', a: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied with your purchase.' },
                            { q: 'Do you offer student discounts?', a: 'Yes! Students get an additional 20% off on all plans. Contact support with your student ID.' }
                        ].map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 bg-card/50 border border-border rounded-2xl transition-all"
                            >
                                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                                <p className="text-muted-foreground text-sm">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="px-8 py-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center p-16 bg-gradient-to-br from-primary/10 to-violet-600/10 rounded-[3rem] border border-primary/20 backdrop-blur-sm transition-colors duration-300"
                    >
                        <h2 className="text-5xl font-black mb-6 text-foreground">Ready to Get Started?</h2>
                        <p className="text-xl text-muted-foreground mb-10">
                            Join 50,000+ students already learning with us
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-foreground text-background font-black text-lg rounded-2xl hover:bg-foreground/90 transition-all shadow-2xl hover:scale-105"
                        >
                            Start Free Trial
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

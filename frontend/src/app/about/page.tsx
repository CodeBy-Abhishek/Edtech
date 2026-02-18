"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Rocket,
    Users,
    Target,
    Award,
    Globe,
    Heart,
    Zap,
    TrendingUp,
    BookOpen,
    Code,
    Briefcase,
    Star
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AboutPage() {
    const stats = [
        { value: '50,000+', label: 'Active Students', icon: Users },
        { value: '500+', label: 'Expert Courses', icon: BookOpen },
        { value: '95%', label: 'Success Rate', icon: TrendingUp },
        { value: '200+', label: 'Hiring Partners', icon: Briefcase }
    ];

    const values = [
        {
            icon: Target,
            title: 'Mission-Driven',
            description: 'We believe education should be accessible to everyone, everywhere. Our mission is to democratize tech education.',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Heart,
            title: 'Student-First',
            description: 'Every decision we make is centered around student success. Your growth is our top priority.',
            gradient: 'from-pink-500 to-rose-500'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'We constantly evolve our platform with cutting-edge technology to provide the best learning experience.',
            gradient: 'from-violet-500 to-purple-500'
        },
        {
            icon: Globe,
            title: 'Global Impact',
            description: 'From India to the world, we\'re building a community of learners who are changing the tech landscape.',
            gradient: 'from-emerald-500 to-teal-500'
        }
    ];

    const team = [
        { name: 'Rajesh Kumar', role: 'CEO & Founder', image: '👨‍💼', description: 'Ex-Google, 15+ years in EdTech' },
        { name: 'Priya Sharma', role: 'CTO', image: '👩‍💻', description: 'Ex-Microsoft, AI/ML Expert' },
        { name: 'Amit Patel', role: 'Head of Content', image: '👨‍🏫', description: 'Ex-Amazon, Curriculum Designer' },
        { name: 'Sneha Reddy', role: 'Head of Operations', image: '👩‍💼', description: 'Ex-Flipkart, Operations Lead' }
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
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary"
                        >
                            <Award className="w-4 h-4" />
                            <span>Transforming Lives Through Education</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-6xl md:text-7xl font-black tracking-tight leading-tight"
                        >
                            Building the Future of
                            <br />
                            <span className="bg-gradient-to-r from-primary via-violet-500 to-purple-500 bg-clip-text text-transparent">
                                Tech Education
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
                        >
                            We're on a mission to make world-class tech education accessible to everyone.
                            Join thousands of students who are transforming their careers with us.
                        </motion.p>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="px-8 py-20 border-y border-border bg-muted/30 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                                className="text-center p-8 rounded-2xl bg-card/30 border border-border backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-4xl font-black text-foreground mb-2">{stat.value}</p>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Story Section */}
                <section className="max-w-7xl mx-auto px-8 py-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl font-black mb-6">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Founded in 2020, EDTECH was born from a simple observation: traditional education
                                    wasn't keeping pace with the rapidly evolving tech industry.
                                </p>
                                <p>
                                    We started with a small team of passionate educators and engineers who believed
                                    that learning should be practical, engaging, and accessible to everyone.
                                </p>
                                <p>
                                    Today, we've grown into a global platform serving 50,000+ students across 150+ countries,
                                    but our core mission remains the same: democratize tech education and empower the next
                                    generation of innovators.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-violet-600/10 border border-primary/20 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="text-8xl">🚀</div>
                                    <p className="text-2xl font-bold text-foreground">Since 2020</p>
                                    <p className="text-muted-foreground">Empowering Learners Worldwide</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="px-8 py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent transition-colors duration-300">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-black mb-4">Our Values</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                The principles that guide everything we do
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {values.map((value, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="group relative p-8 bg-card/50 border border-border rounded-3xl backdrop-blur-sm overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                    <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                        <value.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-3">{value.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="max-w-7xl mx-auto px-8 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-black mb-4">Meet Our Team</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Led by industry veterans from top tech companies
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="p-6 bg-card/50 border border-border rounded-3xl text-center backdrop-blur-sm transition-all"
                            >
                                <div className="text-6xl mb-4">{member.image}</div>
                                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                                <p className="text-sm text-primary mb-3 font-medium">{member.role}</p>
                                <p className="text-xs text-muted-foreground">{member.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-8 py-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center p-16 bg-gradient-to-br from-primary/10 to-violet-600/10 rounded-[3rem] border border-primary/20 backdrop-blur-sm transition-colors duration-300"
                    >
                        <h2 className="text-5xl font-black mb-6">Join Our Mission</h2>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                            Be part of the revolution in tech education. Start learning today.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-foreground text-background font-black text-lg rounded-2xl hover:bg-foreground/90 transition-all shadow-2xl hover:scale-105"
                        >
                            Get Started Free
                            <Rocket className="w-6 h-6" />
                        </Link>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

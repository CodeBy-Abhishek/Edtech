"use client";

import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Terminal,
  ShieldCheck,
  Users,
  ArrowRight,
  Play,
  Zap,
  Globe,
  Award,
  GraduationCap,
  Code,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Star,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
    {children}
  </Link>
);

const FeatureCard = ({ icon: Icon, title, description, delay = 0, gradient }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group relative p-8 bg-card/50 backdrop-blur-sm border border-border rounded-3xl hover:border-muted-foreground/30 transition-all overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
    <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const StatCard = ({ value, label, icon: Icon }: any) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="text-center p-6 rounded-2xl bg-muted/30 border border-border backdrop-blur-sm"
  >
    <div className="flex items-center justify-center mb-3">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <p className="text-4xl font-black text-foreground mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">{value}</p>
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
  </motion.div>
);

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Code,
      title: "Interactive Coding Labs",
      description: "Practice with real-world projects in our browser-based IDE. No setup required.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1
    },
    {
      icon: Globe,
      title: "Global Certifications",
      description: "Earn industry-recognized certificates verified on blockchain technology.",
      gradient: "from-violet-500 to-purple-500",
      delay: 0.2
    },
    {
      icon: Users,
      title: "Live Mentorship",
      description: "Connect with industry experts through 1-on-1 sessions and live workshops.",
      gradient: "from-orange-500 to-red-500",
      delay: 0.3
    },
    {
      icon: Sparkles,
      title: "AI-Powered Learning",
      description: "Personalized learning paths adapted to your pace and skill level.",
      gradient: "from-emerald-500 to-teal-500",
      delay: 0.4
    },
    {
      icon: TrendingUp,
      title: "Career Support",
      description: "Resume reviews, interview prep, and direct connections to hiring partners.",
      gradient: "from-pink-500 to-rose-500",
      delay: 0.5
    },
    {
      icon: ShieldCheck,
      title: "Lifetime Access",
      description: "Once enrolled, access course materials and updates forever.",
      gradient: "from-amber-500 to-yellow-500",
      delay: 0.6
    }
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Software Engineer @ Google", text: "The hands-on labs helped me land my dream job!", rating: 5 },
    { name: "Rahul Verma", role: "Full Stack Developer", text: "Best investment in my career. The mentors are incredible.", rating: 5 },
    { name: "Ananya Singh", role: "Data Scientist @ Microsoft", text: "Went from beginner to professional in 6 months!", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <motion.div
          className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          animate={{
            x: mousePosition.x - 250,
            y: mousePosition.y - 250,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-xl border-b border-border transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 12 }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <Rocket className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-black tracking-tight">
              EDTECH<span className="text-primary">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/courses">Courses</NavLink>
            <NavLink href="/instructor">For Instructors</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-8 py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Join 50,000+ students learning with us</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]"
              >
                Master Tech Skills
                <br />
                <span className="bg-gradient-to-r from-primary via-violet-500 to-purple-500 bg-clip-text text-transparent">
                  Build Your Future
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
              >
                Learn from industry experts, build real projects, and get hired at top companies.
                Your journey to becoming a world-class developer starts here.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
              >
                <Link
                  href="/login"
                  className="group px-8 py-4 bg-foreground text-background font-bold text-lg rounded-2xl hover:bg-foreground/90 transition-all flex items-center gap-2 shadow-2xl hover:shadow-foreground/20 hover:scale-105"
                >
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-4 bg-muted border border-border text-foreground font-bold text-lg rounded-2xl hover:bg-muted/80 transition-all flex items-center gap-2 hover:scale-105">
                  <Play className="w-5 h-5" fill="currentColor" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-8 pt-12 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  <span>4.9/5 from 10k+ reviews</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-2xl backdrop-blur-sm border border-primary/20"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-violet-500/20"
          />
        </section>

        {/* Stats Section */}
        <section className="px-8 py-20 border-y border-border bg-muted/30 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value="50K+" label="Active Students" icon={Users} />
            <StatCard value="500+" label="Expert Courses" icon={GraduationCap} />
            <StatCard value="95%" label="Success Rate" icon={TrendingUp} />
            <StatCard value="200+" label="Hiring Partners" icon={Award} />
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From beginner to expert, we've got you covered with cutting-edge tools and resources
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-8 py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-black mb-4 text-foreground">Loved by Students Worldwide</h2>
              <p className="text-xl text-muted-foreground">Join thousands who transformed their careers</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-card/50 border border-border rounded-3xl backdrop-blur-sm transition-all"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-16 bg-gradient-to-br from-primary/20 to-violet-600/20 rounded-[3rem] border border-primary/20 backdrop-blur-sm relative overflow-hidden transition-colors duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-violet-600/10" />
            <div className="relative z-10">
              <h2 className="text-5xl font-black mb-6 text-foreground">Ready to Start Your Journey?</h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join 50,000+ students already learning with us. Start your free trial today.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-10 py-5 bg-foreground text-background font-black text-lg rounded-2xl hover:bg-foreground/90 transition-all shadow-2xl hover:shadow-foreground/20 hover:scale-105"
              >
                Get Started Free
                <ChevronRight className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

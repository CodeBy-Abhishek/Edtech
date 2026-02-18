"use client";

import React from 'react';
import Link from 'next/link';
import {
    Rocket,
    Twitter,
    Linkedin,
    Github,
    Mail,
    MapPin,
    Phone,
    Facebook,
    Instagram,
    Youtube
} from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Courses', href: '/courses' },
            { name: 'Live Classes', href: '/dashboard/live' },
            { name: 'Certifications', href: '/dashboard/certificates' },
            { name: 'Pricing', href: '/pricing' },
        ],
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Careers', href: '/careers' },
            { name: 'Blog', href: '/blog' },
            { name: 'Press Kit', href: '/press' },
        ],
        resources: [
            { name: 'Documentation', href: '/docs' },
            { name: 'Help Center', href: '/help' },
            { name: 'Community', href: '/dashboard/community' },
            { name: 'Contact Support', href: '/support' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/legal/privacy' },
            { name: 'Terms of Service', href: '/legal/terms' },
            { name: 'Refund Policy', href: '/legal/refund' },
            { name: 'Cookie Policy', href: '/legal/cookies' },
        ],
    };

    const socialLinks = [
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: Github, href: 'https://github.com', label: 'GitHub' },
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    ];

    return (
        <footer className="bg-muted/30 border-t border-border transition-colors duration-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                                <Rocket className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black italic tracking-tighter text-foreground">
                                EDTECH<span className="text-primary">.</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            Empowering the next generation of tech professionals with industry-leading courses,
                            hands-on labs, and globally recognized certifications.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 text-primary" />
                                <a href="mailto:support@edtech.com" className="hover:text-foreground transition-colors">
                                    support@edtech.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 text-primary" />
                                <a href="tel:+911234567890" className="hover:text-foreground transition-colors">
                                    +91 123 456 7890
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                <span>
                                    123 Tech Park, Cyber City<br />
                                    Bangalore, Karnataka 560001
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-foreground font-bold text-sm uppercase tracking-wider mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground text-sm hover:text-foreground transition-colors inline-flex items-center group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-foreground font-bold text-sm uppercase tracking-wider mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground text-sm hover:text-foreground transition-colors inline-flex items-center group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="text-foreground font-bold text-sm uppercase tracking-wider mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground text-sm hover:text-foreground transition-colors inline-flex items-center group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-foreground font-bold text-sm uppercase tracking-wider mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground text-sm hover:text-foreground transition-colors inline-flex items-center group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-border pt-12 mb-12">
                    <div className="max-w-2xl">
                        <h3 className="text-foreground font-bold text-lg mb-2">Stay Updated</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            Subscribe to our newsletter for the latest courses, updates, and exclusive offers.
                        </p>
                        <form className="flex gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-primary/20"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Copyright */}
                    <div className="text-muted-foreground text-sm">
                        © {currentYear} EDTECH Pro Global. All rights reserved.
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:bg-muted/80 transition-all"
                                    aria-label={social.label}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            );
                        })}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            ISO Certified
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            GDPR Compliant
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

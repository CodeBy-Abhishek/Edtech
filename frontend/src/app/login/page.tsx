"use client";
import { GoogleLogin } from '@react-oauth/google';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
const IS_CAPTCHA_ENABLED = RECAPTCHA_SITE_KEY.length > 0;
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Loader2,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    UserCircle,
    Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';


export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR' | 'ADMIN'>('STUDENT');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null); // Added state
    const recaptchaRef = useRef<ReCAPTCHA>(null); // Added ref

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForceLogin, setShowForceLogin] = useState(false);

    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 6) score += 25;
        if (/[A-Z]/.test(pass)) score += 25;
        if (/[0-9]/.test(pass)) score += 25;
        if (/[^A-Za-z0-9]/.test(pass)) score += 25;
        return score;
    };

    const strength = getPasswordStrength(password);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent, isForced: boolean = false) => {
        if (e) e.preventDefault();

        if (!isLogin && !agreedToTerms) {
            setError('You must agree to the Terms of Service to continue.');
            return;
        }

        if (IS_CAPTCHA_ENABLED && !captchaToken) {
            setError('Please verify that you are not a robot.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin
                ? { email, password, forceLogin: isForced, captchaToken } // Added captchaToken
                : { email, password, name, role, captchaToken }; // Added captchaToken

            const res = await api.post(endpoint, payload);

            if (isLogin) {
                const { accessToken, user } = res.data;
                login(accessToken, user);
                toast.success('Successfully logged in!');
            } else {
                // Auto-login after registration
                const loginRes = await api.post('/auth/login', { email, password, captchaToken }); // Added captchaToken
                const { accessToken, user } = loginRes.data;
                login(accessToken, user);
                toast.success('Registration successful! Welcome on board.');
            }
        } catch (err: any) {
            console.error("Auth failed", err);
            const msg = err.response?.data?.message || 'Authentication failed';
            const errCode = err.response?.data?.error;

            if (errCode === 'DEVICE_LIMIT_REACHED') {
                setShowForceLogin(true);
                setError('Maximum device limit reached (5 devices). Would you like to logout from all other devices and sign in here?');
            } else {
                setError(msg);
                recaptchaRef.current?.reset(); // Reset captcha on error
                setCaptchaToken(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async (credential: string) => {
        try {
            setIsLoading(true);
            setError('');

            const res = await api.post('/auth/google', {
                token: credential,
                role, // STUDENT / INSTRUCTOR
            });

            const { accessToken, user } = res.data;
            login(accessToken, user);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Google authentication failed');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        {isLogin ? 'Sign in to access your classroom' : 'Join the future of education today'}
                    </p>
                </div>

                <div className="flex bg-zinc-900/50 p-1 rounded-xl mb-6 relative border border-zinc-800">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${isLogin ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${!isLogin ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            {/* Role Selection Cards */}
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('STUDENT')}
                                    className={cn(
                                        "p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group relative overflow-hidden",
                                        role === 'STUDENT'
                                            ? "bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/10"
                                            : "bg-black/40 border-zinc-800 hover:border-zinc-700"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                        role === 'STUDENT' ? "bg-indigo-600 text-white scale-110" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
                                    )}>
                                        <UserCircle className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className={cn("text-[10px] font-black uppercase tracking-widest leading-none mb-1", role === 'STUDENT' ? "text-indigo-400" : "text-zinc-500")}>Student</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('INSTRUCTOR')}
                                    className={cn(
                                        "p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group relative overflow-hidden",
                                        role === 'INSTRUCTOR'
                                            ? "bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10"
                                            : "bg-black/40 border-zinc-800 hover:border-zinc-700"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                        role === 'INSTRUCTOR' ? "bg-emerald-600 text-white scale-110" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
                                    )}>
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className={cn("text-[10px] font-black uppercase tracking-widest leading-none mb-1", role === 'INSTRUCTOR' ? "text-emerald-400" : "text-zinc-500")}>Expert</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('ADMIN')}
                                    className={cn(
                                        "p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group relative overflow-hidden",
                                        role === 'ADMIN'
                                            ? "bg-red-500/10 border-red-500 shadow-lg shadow-red-500/10"
                                            : "bg-black/40 border-zinc-800 hover:border-zinc-700"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                        role === 'ADMIN' ? "bg-red-600 text-white scale-110" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
                                    )}>
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className={cn("text-[10px] font-black uppercase tracking-widest leading-none mb-1", role === 'ADMIN' ? "text-red-400" : "text-zinc-500")}>Admin</p>
                                    </div>
                                </button>
                            </div>

                            <div className="relative group/field">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Full Legal Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-[1.25rem] pl-12 pr-4 py-4 text-sm text-zinc-100 outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="relative group/field">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                placeholder="Corporate Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-zinc-800 rounded-[1.25rem] pl-12 pr-4 py-4 text-sm text-zinc-100 outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="relative group/field">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder={isLogin ? "Access Key" : "Secure Password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-[1.25rem] pl-12 pr-4 py-4 text-sm text-zinc-100 outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
                                    required
                                />
                            </div>

                            {!isLogin && password && (
                                <div className="px-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] leading-none italic">
                                        <span className={cn(
                                            strength <= 25 ? "text-red-500" :
                                                strength <= 50 ? "text-amber-500" :
                                                    strength <= 75 ? "text-indigo-400" : "text-emerald-500"
                                        )}>
                                            {strength <= 25 ? 'Critical' :
                                                strength <= 50 ? 'Moderate' :
                                                    strength <= 75 ? 'Shielded' : 'Absolute'}
                                        </span>
                                        <span className="text-zinc-700 opacity-60">Auth Strength</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-900/50 rounded-full overflow-hidden flex gap-1 p-[1px]">
                                        <div className={cn("h-full rounded-full transition-all duration-1000", strength >= 25 ? (strength === 25 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-zinc-800") : "bg-transparent")} style={{ width: '25%' }} />
                                        <div className={cn("h-full rounded-full transition-all duration-1000", strength >= 50 ? (strength === 50 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-zinc-800") : "bg-transparent")} style={{ width: '25%' }} />
                                        <div className={cn("h-full rounded-full transition-all duration-1000", strength >= 75 ? (strength === 75 ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-zinc-800") : "bg-transparent")} style={{ width: '25%' }} />
                                        <div className={cn("h-full rounded-full transition-all duration-1000", strength === 100 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-transparent")} style={{ width: '25%' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {IS_CAPTCHA_ENABLED && (
                        <div className="flex justify-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={(token) => setCaptchaToken(token)}
                                theme="dark"
                            />
                        </div>
                    )}

                    {/* Google OAuth */}
                    <div className="space-y-4">
                        <GoogleLogin
                            onSuccess={(res) => handleGoogleAuth(res.credential!)}
                            onError={() => setError('Google login failed')}
                            theme="filled_black"
                            size="large"
                            shape="pill"
                            text={isLogin ? 'signin_with' : 'signup_with'}
                        />

                        <div className="flex items-center gap-3 text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                            <div className="flex-1 h-px bg-zinc-800" />
                            OR
                            <div className="flex-1 h-px bg-zinc-800" />
                        </div>
                    </div>

                    {!isLogin && (
                        <label className="flex items-start gap-4 cursor-pointer group px-1">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-5 h-5 rounded-[0.5rem] border-zinc-800 bg-black/40 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer appearance-none border-2 checked:bg-indigo-600 checked:border-indigo-400"
                                />
                                {agreedToTerms && <CheckCircle2 className="absolute inset-0 w-5 h-5 text-white p-1 pointer-events-none" />}
                            </div>
                            <span className="text-[10px] text-zinc-500 leading-relaxed font-black uppercase tracking-widest italic pt-0.5">
                                I agree to the <span className="text-zinc-300 hover:text-indigo-400 underline decoration-indigo-500/30 underline-offset-4 transition-all">SLA Protocol</span> and <span className="text-zinc-300 hover:text-indigo-400 underline decoration-indigo-500/30 underline-offset-4 transition-all">Digital Terms</span>.
                            </span>
                        </label>
                    )}

                    {error && (
                        <div className={`p-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2 border italic shadow-xl ${error.includes('successful')
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
                            : 'bg-red-500/5 border-red-500/20 text-red-500'
                            }`}>
                            <div className="flex gap-4">
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                                    error.includes('successful') ? "bg-emerald-500/10" : "bg-red-500/10"
                                )}>
                                    {error.includes('successful') ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                </div>
                                <p className="leading-relaxed flex-1 pt-1.5">{error}</p>
                            </div>

                            {showForceLogin && (
                                <button
                                    type="button"
                                    onClick={() => handleSubmit(null as any, true)}
                                    className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-500 transition-all text-[10px] uppercase tracking-[0.2em] mt-6 shadow-2xl shadow-red-500/20 active:scale-95"
                                >
                                    Force Global Sign-Out
                                </button>
                            )}
                        </div>
                    )}

                    {!showForceLogin && (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4.5 rounded-[1.5rem] transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group mt-4 active:scale-[0.98] uppercase tracking-[0.2em] text-[11px]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Establish Access' : 'Create Identity'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    )}
                </form>


                {isLogin && (
                    <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
                        <button
                            onClick={() => {
                                setEmail('student@edtech.com');
                                setPassword('password123');
                            }}
                            className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-widest font-bold"
                        >
                            Use Demo Credentials
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (isAuthLoading) return;

        // Public paths that don't need checks
        if (pathname === '/login' || pathname === '/') {
            if (user) {
                // Redirect logged-in users to their role-specific dashboard
                if (pathname === '/login') {
                    if (user.role === 'ADMIN') {
                        router.replace('/admin');
                    } else if (user.role === 'INSTRUCTOR') {
                        router.replace('/instructor');
                    } else {
                        router.replace('/dashboard');
                    }
                }
            }
            setIsAuthorized(true);
            return;
        }

        if (!user) {
            // Not logged in, redirect to login
            router.replace('/login');
            setIsAuthorized(false);
            return;
        }

        // Role-based protection
        if (pathname.startsWith('/instructor') && user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
            router.replace('/dashboard');
            setIsAuthorized(false);
            return;
        }

        if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
            router.replace('/dashboard');
            setIsAuthorized(false);
            return;
        }

        setIsAuthorized(true);
    }, [pathname, router, user, isAuthLoading]);

    if (isAuthLoading || !isAuthorized) {
        // If it's a public path and we are just checking, we might want to show content
        // But to prevent flash of content for protected routes, we always show loader 
        // unless it is a public path and we are not logged in (handled by isAuthorized=true above)

        // Exception: If we are on public path and loading auth, we might want to wait.
        if ((pathname === '/login' || pathname === '/') && !isAuthLoading && isAuthorized) {
            return <>{children}</>;
        }

        return (
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));

                // Optional: Validate token with backend if needed
                // try {
                //     await api.get('/auth/me'); // Assuming an implementation exists
                // } catch (error) {
                //     logout();
                // }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));

        // Redirect based on role
        if (newUser.role === 'ADMIN') {
            router.push('/admin');
        } else if (newUser.role === 'INSTRUCTOR') {
            router.push('/instructor');
        } else {
            router.push('/dashboard');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        toast.success('Logged out successfully');
    };

    const updateUser = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

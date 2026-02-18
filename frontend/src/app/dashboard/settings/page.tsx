"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Bell, Shield, Save, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Check if token exists
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found, redirecting to login');
                    router.push('/login');
                    return;
                }

                console.log('Fetching profile with token:', token.substring(0, 20) + '...');
                const res = await api.get('/user/profile');
                console.log('Profile fetched successfully:', res.data);

                setFormData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    bio: res.data.bio || ''
                });
            } catch (error: any) {
                console.error("Failed to fetch profile", error);

                // If 401, token is invalid - redirect to login
                if (error.response?.status === 401) {
                    console.error('Authentication failed, clearing storage and redirecting to login');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    router.push('/login');
                    return;
                }

                alert('Failed to load profile. Please try refreshing the page.');
            } finally {
                setIsFetching(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');

        console.log('Saving profile with data:', { name: formData.name, bio: formData.bio });

        try {
            const response = await api.put('/user/profile', {
                name: formData.name,
                bio: formData.bio
            });

            console.log('Profile update response:', response.data);

            // Update localStorage with new user data
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {
                ...currentUser,
                name: response.data.name,
                bio: response.data.bio
            };

            console.log('Updating localStorage with:', updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Trigger custom event to update UI across components
            window.dispatchEvent(new Event('profileUpdated'));
            console.log('Profile update event dispatched');

            setSuccessMessage('✓ Profile updated successfully! Changes are now visible across the app.');
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            console.error("Error response:", error.response?.data);

            const errorMessage = error.response?.data?.message || 'Failed to save changes. Please try again.';
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Account Settings</h1>
            <p className="text-zinc-400 mb-8">Manage your profile and preferences.</p>

            {successMessage && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium animate-in fade-in">
                    ✓ {successMessage}
                </div>
            )}

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <User className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-100">Personal Information</h2>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-200 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-500 cursor-not-allowed outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bio</label>
                            <textarea
                                rows={3}
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-200 focus:border-indigo-500 outline-none transition-all resize-none"
                                placeholder="Tell us a bit about yourself..."
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Notifications */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Bell className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-100">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Email notifications for new assignments",
                            "Push notifications for live classes",
                            "Weekly progress reports"
                        ].map((setting, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                <span className="text-sm text-zinc-300">{setting}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={i === 0} />
                                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

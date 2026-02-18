"use client";

import React, { useEffect, useState } from 'react';
import { Users, Trash, Edit, Shield } from 'lucide-react';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    _count: { enrollments: number; payments: number };
}

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await api.put('/admin/users/role', { userId, role: newRole });
            fetchUsers();
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">User Management</h1>
                    <p className="text-zinc-400">Manage all platform users and their roles</p>
                </div>
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
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">User</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Role</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Enrollments</th>
                                <th className="text-left p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Joined</th>
                                <th className="text-right p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-medium text-zinc-200">{user.name || 'No Name'}</p>
                                            <p className="text-xs text-zinc-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-sm text-zinc-200 focus:border-indigo-500 outline-none"
                                        >
                                            <option value="STUDENT">Student</option>
                                            <option value="INSTRUCTOR">Instructor</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-zinc-400 text-sm">{user._count.enrollments}</td>
                                    <td className="p-4 text-zinc-400 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-400/10"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
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

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-hot-toast';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ASSIGNMENT' | 'PAYMENT';
    isRead: boolean;
    createdAt: string;
    link?: string;
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { socket } = useSocket();

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('All notifications cleared');
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        if (socket) {
            socket.on('notification', (newNotification: Notification) => {
                setNotifications(prev => [newNotification, ...prev]);
                toast(newNotification.message, {
                    icon: '🔔',
                    position: 'top-right',
                    duration: 4000
                });
            });

            return () => {
                socket.off('notification');
            };
        }
    }, [socket]);

    return {
        notifications,
        isLoading,
        unreadCount: notifications.filter(n => !n.isRead).length,
        markAsRead,
        markAllRead,
        refresh: fetchNotifications
    };
};

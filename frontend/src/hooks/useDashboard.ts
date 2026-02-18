import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface DashboardData {
    stats: {
        activeCourses: number;
        hoursLearned: number;
        certificates: number;
        skillPoints: string | number;
    };
    enrolledCourses: {
        id: string;
        title: string;
        instructor: string;
        progress: number;
        image: string;
        lessons: number;
        duration: string;
        category: string;
    }[];
}

export const useDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // In a real app, you would check if user is logged in
                // For this demo, we assume the token is in localStorage and api interceptor picks it up
                const res = await api.get('/courses/dashboard');
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return { data, isLoading, error };
};

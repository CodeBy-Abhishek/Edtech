"use client";

import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface CheckoutButtonProps {
    courseId: string;
    price: number;
}

export const CheckoutButton = ({ courseId, price }: CheckoutButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const res = await api.post('/payment/create-order', { courseId });

            // Redirect to Stripe Hosted Checkout
            if (res.data.url) {
                window.location.href = res.data.url;
            } else {
                toast.error("Failed to initialize payment");
            }
        } catch (error: any) {
            console.error("Checkout failed", error);
            toast.error(error.response?.data?.message || "Checkout failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    <CreditCard className="w-4 h-4" />
                    Enroll for ₹{price}
                </>
            )}
        </button>
    );
};

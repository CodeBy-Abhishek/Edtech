"use client";

import React from 'react';
import LiveClassRoom from '@/components/LiveClassRoom';
import { useParams } from 'next/navigation';

const LiveClassPage = () => {
    // Correctly Unwrap params for Next.js 15+ 
    // Actually in client components `useParams` returns the params object directly.
    const params = useParams();
    const id = params?.id as string;

    if (!id) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <LiveClassRoom roomId={id} />
        </div>
    );
};

export default LiveClassPage;

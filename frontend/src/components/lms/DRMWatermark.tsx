"use client";

import React, { useEffect, useState } from 'react';

/**
 * A security component that overlays user information over the video
 * to discourage screen recording and unauthorized distribution.
 * The watermark moves randomly to make it harder to mask.
 */
export const DRMWatermark = ({ userId }: { userId: string }) => {
    const [position, setPosition] = useState({ top: '10%', left: '10%' });
    const [ip, setIp] = useState('0.0.0.0');

    useEffect(() => {
        // Fetch user IP for watermark
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setIp(data.ip))
            .catch(() => setIp('IP HIDDEN'));

        const moveInterval = setInterval(() => {
            const top = Math.floor(Math.random() * 80) + 10 + '%';
            const left = Math.floor(Math.random() * 80) + 10 + '%';
            setPosition({ top, left });
        }, 5000);

        return () => clearInterval(moveInterval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10 opacity-20 transition-all duration-1000 ease-in-out">
            <div
                className="absolute transition-all duration-[5000ms] text-[10px] font-mono text-white/50 bg-black/5 px-2 py-1 rounded"
                style={{ ...position }}
            >
                <p>{userId}</p>
                <p>{ip}</p>
                <p>{new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

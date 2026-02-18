"use client";

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-zinc-800 dark:bg-zinc-700 rounded-full transition-colors border border-zinc-700 dark:border-zinc-600 hover:border-indigo-500 dark:hover:border-indigo-400"
            aria-label="Toggle theme"
        >
            <motion.div
                className="absolute top-0.5 w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{
                    left: theme === 'dark' ? '2px' : '26px'
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {theme === 'dark' ? (
                    <Moon className="w-3.5 h-3.5 text-white" fill="currentColor" />
                ) : (
                    <Sun className="w-3.5 h-3.5 text-white" />
                )}
            </motion.div>
        </motion.button>
    );
}

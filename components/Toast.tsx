'use client';

import { useEffect } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    isVisible?: boolean;
    onClose: () => void;
}

export default function Toast({ message, type = 'info', isVisible = true, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgClass = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-urban-red' : 'bg-urban-yellow';
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '🔔';

    return (
        <div
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
            <div className={`${bgClass} text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 min-w-[300px] justify-center backdrop-blur-md bg-opacity-90`}>
                <span className="text-xl">{icon}</span>
                <p className="font-bold uppercase tracking-widest text-xs">{message}</p>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <div
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-50 pointer-events-none'
                }`}
        >
            <div className="bg-[#DD1C1A] text-white p-4 rounded-full shadow-2xl">
                <span className="text-5xl">🔥</span>
            </div>
        </div>
    );
}

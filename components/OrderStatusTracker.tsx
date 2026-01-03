'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderStatusTrackerProps {
    status: string;
    orderId: string;
}

export default function OrderStatusTracker({ status, orderId }: OrderStatusTrackerProps) {
    const getProgress = (s: string) => {
        switch (s) {
            case 'pendiente': return 25;
            case 'preparando': return 50;
            case 'listo': return 75;
            case 'entregado': return 100;
            default: return 0;
        }
    };

    const getColor = (s: string) => {
        switch (s) {
            case 'pendiente': return '#DD1C1A'; // Rojo Sintenedor
            case 'preparando': return '#F0C808'; // Amarillo Sintenedor
            case 'listo': return '#F0C808';
            case 'entregado': return '#22C55E'; // Verde éxito
            default: return '#333';
        }
    };

    const getStatusText = (s: string) => {
        switch (s) {
            case 'pendiente': return 'Recibido';
            case 'preparando': return 'En el Horno';
            case 'listo': return '¡Listo para ti!';
            case 'entregado': return 'Entregado';
            default: return 'Buscando...';
        }
    };

    const progress = getProgress(status);
    const color = getColor(status);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#0a0a0a]/40 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Glow de fondo dinámico */}
            <div
                className="absolute inset-0 opacity-20 blur-[80px] transition-colors duration-1000"
                style={{ backgroundColor: color }}
            />

            <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="128"
                        cy="128"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="8"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="128"
                        cy="128"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
                    />
                </svg>

                {/* Logo Central */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-[#0a0a0a] border border-white/5 relative"
                        animate={status === 'preparando' ? {
                            scale: [1, 1.05, 1],
                            rotate: [0, 2, -2, 0]
                        } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <img
                            src="/assets/logo.png"
                            alt="Sintenedor Logo"
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Overlay Preparando (Burbujas/Humo) */}
                        {status === 'preparando' && (
                            <>
                                <motion.div
                                    className="absolute bottom-4 left-1/2 w-2 h-2 bg-urban-yellow/40 rounded-full blur-sm"
                                    animate={{ y: -40, opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                                />
                                <motion.div
                                    className="absolute bottom-4 left-1/4 w-3 h-3 bg-urban-red/30 rounded-full blur-sm"
                                    animate={{ y: -50, opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
                                />
                            </>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="text-center z-10">
                <motion.p
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs uppercase tracking-[0.3em] font-bold opacity-50 mb-1"
                >
                    ID: #{orderId.slice(0, 8)}
                </motion.p>
                <motion.h2
                    key={status + 'text'}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-[family-name:var(--font-urban-heading)] uppercase tracking-tighter"
                    style={{ color: status === 'pendiente' ? '#fff' : color }}
                >
                    {getStatusText(status)}
                </motion.h2>

                {/* Indicador de "Tiempo Real" */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[9px] uppercase tracking-widest font-bold opacity-40">Seguimiento en Vivo Podestá</span>
                </div>
            </div>
        </div>
    );
}

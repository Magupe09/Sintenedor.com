'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderNotificationBubble() {
    const { user } = useAuth();
    const [notification, setNotification] = useState<{ id: string; status: string } | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (!user) {
            console.log("No user found for notifications");
            return;
        }

        // Solicitar permiso para notificaciones del sistema
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        console.log("Setting up REALTIME for user:", user.id);

        // Suscripción a cambios en los pedidos del usuario
        const channel = supabase
            .channel('order-notifications')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'pedidos',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    console.log("REALTIME UPDATE RECEIVED:", payload);
                    const newStatus = payload.new?.estado;
                    const oldStatus = payload.old?.estado;

                    // Si no tenemos oldStatus (por config de replica identity), igual notificamos
                    // siempre que sea un cambio a un estado de interés.
                    if (newStatus && newStatus !== oldStatus) {
                        console.log("Status change detected:", oldStatus, "->", newStatus);
                        setNotification({ id: payload.new.id, status: newStatus });
                        setIsVisible(true);

                        // Notificación de sistema (fuera de la pestaña)
                        if ("Notification" in window && Notification.permission === "granted") {
                            new Notification("Sintenedor 🍕", {
                                body: getStatusMessage(newStatus),
                                icon: "/assets/logo.png"
                            });
                        }

                        // Ocultar burbuja interna después de 6 segundos
                        setTimeout(() => setIsVisible(false), 6000);
                    }
                }
            )
            .subscribe((status, err) => {
                console.log("Realtime subscription status:", status);
                if (err) console.error("Realtime subscription error:", err);
            });

        return () => {
            console.log("Cleaning up realtime channel");
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'preparando': return '¡Al horno! Tu pizza está siendo preparada 👨‍🍳🔥';
            case 'listo': return '¡Banquete listo! Ya salió de la cocina ✅🍕';
            case 'entregado': return '¡Disfruta tu pedido! Gracias por elegirnos 🍕✨';
            case 'cancelado': return 'Lo sentimos, tu pedido ha sido cancelado ❌';
            default: return `Tu pedido está en estado: ${status}`;
        }
    };

    return (
        <AnimatePresence>
            {isVisible && notification && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="fixed bottom-24 left-6 z-[100] flex items-center gap-4 cursor-pointer"
                    onClick={() => setIsVisible(false)}
                >
                    {/* Branded Bubble with Logo */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-urban-yellow p-3 shadow-[0_0_40px_rgba(240,200,8,0.4)] border-4 border-black relative z-10 animate-bounce">
                            <img
                                src="/assets/logo.png"
                                alt="Sintenedor"
                                className="w-full h-full object-contain brightness-0"
                            />
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-urban-yellow rounded-full blur-xl opacity-30 animate-pulse"></div>
                    </div>

                    {/* Message Box */}
                    <div className="bg-black/90 backdrop-blur-xl border border-urban-yellow/30 p-4 rounded-3xl pr-8 shadow-2xl">
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-urban-yellow mb-1">
                            Actualización de Pedido
                        </p>
                        <p className="text-white text-sm font-bold uppercase tracking-tight leading-tight max-w-[180px]">
                            {getStatusMessage(notification.status)}
                        </p>

                        {/* Progress Bar */}
                        <div className="absolute bottom-3 left-4 right-8 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 6 }}
                                className="h-full bg-urban-yellow"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

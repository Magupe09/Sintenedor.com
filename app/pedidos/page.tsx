'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import OrderStatusTracker from '@/components/OrderStatusTracker';

interface OrderItem {
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
}

interface Order {
    id: string;
    created_at: string;
    total: number;
    estado: string;
    items_pedido?: OrderItem[];
}

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('pedidos')
                    .select(`
                        *,
                        items_pedido (*)
                    `)
                    .eq('user_id', user.id)
                    .neq('estado', 'cancelado') // No mostramos cancelados por ahora
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        const channel = supabase
            .channel('user-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'pedidos', filter: `user_id=eq.${user.id}` },
                () => fetchOrders()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Encontrar TODOS los pedidos activos (no entregados)
    const activeOrders = orders.filter(o => o.estado !== 'entregado');
    const pastOrders = orders.filter(o => o.estado === 'entregado');

    if (!user) {
        // ... (contenido de no autenticado permanece igual)
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <div className="max-w-md">
                    <h1 className="text-4xl font-[family-name:var(--font-urban-heading)] mb-4">Uups...</h1>
                    <p className="mb-6 opacity-70">Para ver tu historial de banquetes, primero identifícate.</p>
                    <Link href="/login">
                        <button className="bg-urban-red text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-urban-yellow hover:text-black transition-all">
                            Ir al Login
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'pendiente': return 'bg-urban-red/10 text-urban-red border-urban-red/20';
            case 'preparando': return 'bg-urban-yellow/10 text-urban-yellow border-urban-yellow/20';
            case 'listo': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'entregado': return 'bg-foreground/5 text-foreground/50 border-foreground/10';
            default: return 'bg-foreground/5 text-foreground border-foreground/10';
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-urban-heading)] uppercase tracking-tighter">Tu Banquete</h1>
                <Link href="/perfil">
                    <div className="bg-foreground/5 border border-foreground/10 p-3 rounded-xl hover:bg-foreground/10 transition-colors">
                        <span className="text-xs uppercase tracking-widest">Mi Perfil 👤</span>
                    </div>
                </Link>
            </header>

            {/* HERO: Status Trackers para TODOS los pedidos activos */}
            {activeOrders.length > 0 && (
                <div className="mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {activeOrders.map((order) => (
                            <OrderStatusTracker
                                key={order.id}
                                status={order.estado}
                                orderId={order.id}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <h2 className="text-2xl font-[family-name:var(--font-urban-heading)] uppercase tracking-widest opacity-30 px-2 italic">
                    {activeOrders.length > 0 ? 'Historial Reciente' : 'Tus Pedidos'}
                </h2>

                {loading ? (
                    <div className="text-center py-20 opacity-30">Cargando banquetes...</div>
                ) : pastOrders.length === 0 && activeOrders.length === 0 ? (
                    <div className="text-center py-20 bg-foreground/5 rounded-3xl border border-dashed border-foreground/10">
                        <p className="text-xl opacity-50 mb-4">Aún no has hecho ningún pedido...</p>
                        <Link href="/">
                            <button className="text-urban-yellow hover:text-white transition-colors underline underline-offset-4">
                                ¡Pide algo rico ahora!
                            </button>
                        </Link>
                    </div>
                ) : (
                    pastOrders.map((order) => (
                        <div key={order.id} className="bg-foreground/5 border border-foreground/10 rounded-3xl p-6 md:p-8 hover:border-[#F0C808]/30 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold uppercase tracking-tight">#{order.id.slice(0, 8)}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold ${getStatusStyles(order.estado)}`}>
                                            {order.estado}
                                        </span>
                                    </div>
                                    <p className="text-xs opacity-50 font-mono">
                                        {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase opacity-50 tracking-widest mb-1">Total Pagado</p>
                                    <p className="text-2xl font-[family-name:var(--font-urban-heading)] text-urban-yellow">
                                        ${order.total.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-foreground/10 pt-6 mb-6">
                                <ul className="space-y-3">
                                    {order.items_pedido?.map((item, idx) => (
                                        <li key={idx} className="flex justify-between text-sm">
                                            <span className="opacity-80">
                                                <span className="font-bold text-foreground">{item.cantidad}x</span> {item.nombre_producto}
                                            </span>
                                            <span className="opacity-40">${(item.precio_unitario * item.cantidad).toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2 bg-urban-yellow/10 px-4 py-2 rounded-full border border-urban-yellow/20">
                                    <span className="text-lg">✨</span>
                                    <p className="text-xs font-bold text-urban-yellow uppercase tracking-widest">
                                        Ganaste {Math.floor(order.total / 1000)} S-Points
                                    </p>
                                </div>

                                <button className="w-full md:w-auto bg-foreground/5 border border-foreground/20 hover:bg-foreground hover:text-black text-foreground px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                                    Ver Detalle
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-urban-red/20 to-transparent rounded-3xl border border-urban-red/30">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="text-4xl">🎁</div>
                    <div>
                        <h4 className="text-xl font-[family-name:var(--font-urban-heading)] uppercase mb-2">¿Quieres comida gratis?</h4>
                        <p className="text-sm opacity-70">Cada pedido te acerca más a tu próxima recompensa. ¡Sigue acumulando S-Points!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

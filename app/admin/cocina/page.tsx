'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface OrderItem {
    id: string;
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
}

interface Order {
    id: string;
    nombre_cliente: string;
    telefono_cliente: string;
    total: number;
    estado: string;
    created_at: string;
    items_pedido?: OrderItem[];
}

export default function KitchenPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchOrders = async () => {
        try {
            // Buscamos pedidos que no estén 'entregado' ni 'cancelado' para cocina
            const { data, error } = await supabase
                .from('pedidos')
                .select(`
                    *,
                    items_pedido (*)
                `)
                .neq('estado', 'entregado')
                .neq('estado', 'cancelado')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Suscripción en tiempo real a cambios en la tabla pedidos
        const channel = supabase
            .channel('kitchen-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'pedidos' },
                () => {
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        // Optimistic Update: Cambiamos el estado localmente de inmediato para que sea instantáneo
        const originalOrders = [...orders];
        setOrders(current =>
            current.map(order =>
                order.id === orderId ? { ...order, estado: newStatus } : order
            )
        );

        try {
            const { error } = await supabase
                .from('pedidos')
                .update({ estado: newStatus })
                .eq('id', orderId);

            if (error) {
                // Si falla en la DB, revertimos al estado original
                setOrders(originalOrders);
                throw error;
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Fallo al cambiar el estado del pedido. Revisa tu conexión.');
            fetchOrders(); // Recargamos para asegurar sincronización
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendiente': return 'bg-urban-red border-urban-red/50 text-white';
            case 'preparando': return 'bg-urban-yellow text-black border-urban-yellow/50';
            case 'listo': return 'bg-green-500 text-white border-green-500/50';
            default: return 'bg-foreground/10 text-foreground';
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-foreground p-6 pt-24 md:p-12 lg:p-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                <div>
                    <h1 className="text-6xl md:text-8xl font-[family-name:var(--font-urban-heading)] uppercase tracking-tighter leading-none mb-2">
                        Cocina <span className="text-urban-yellow">Sintenedor</span>
                    </h1>
                    <p className="text-sm uppercase tracking-widest opacity-50 font-bold">
                        Panel de Control de Banquetes • Tiempo Real
                    </p>
                </div>
                <Link href="/">
                    <button className="px-6 py-2 border border-foreground/20 rounded-full text-xs uppercase tracking-widest hover:bg-foreground hover:text-black transition-all">
                        Ir a la Web Principal
                    </button>
                </Link>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-40">
                    <span className="text-2xl font-bold animate-pulse uppercase tracking-[1em]">Cocinando...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {orders.length === 0 ? (
                        <div className="col-span-full py-40 text-center border-2 border-dashed border-foreground/5 rounded-[40px]">
                            <p className="text-4xl opacity-10 uppercase font-[family-name:var(--font-urban-heading)] italic">La cocina está en calma...</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="relative group bg-[#0A0A0A] border border-foreground/10 rounded-[32px] overflow-hidden flex flex-col hover:border-urban-yellow/30 transition-all duration-500 shadow-2xl">
                                {/* Estado Badge */}
                                <div className={`px-5 py-2 text-[10px] uppercase font-bold tracking-widest flex justify-between items-center ${getStatusColor(order.estado)}`}>
                                    <span>{order.estado}</span>
                                    <span>#{order.id.slice(0, 5)}</span>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="text-3xl font-[family-name:var(--font-urban-heading)] uppercase leading-none mb-1">
                                            {order.nombre_cliente}
                                        </h3>
                                        <p className="text-xs opacity-50 font-mono">
                                            {new Date(order.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>

                                    {/* Items List */}
                                    <div className="flex-1 space-y-4 mb-8">
                                        {order.items_pedido?.map((item) => (
                                            <div key={item.id} className="flex justify-between items-start gap-4 pb-4 border-b border-foreground/5 last:border-0">
                                                <div className="flex-1">
                                                    <p className="text-lg font-bold leading-tight uppercase">
                                                        <span className="text-urban-yellow mr-2">{item.cantidad}x</span>
                                                        {item.nombre_producto}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="space-y-3 mt-auto">
                                        {order.estado === 'pendiente' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'preparando')}
                                                className="w-full bg-urban-red text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-sm"
                                            >
                                                👨‍🍳 Preparar
                                            </button>
                                        )}
                                        {order.estado === 'preparando' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'listo')}
                                                className="w-full bg-urban-yellow text-black py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-sm"
                                            >
                                                ✅ Marcar Listo
                                            </button>
                                        )}
                                        {order.estado === 'listo' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'entregado')}
                                                className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                            >
                                                🚚 Entregado
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Cliente Info Hover */}
                                <div className="p-4 bg-foreground/5 text-center">
                                    <p className="text-[10px] uppercase opacity-40 font-bold mb-1">Contacto Directo</p>
                                    <p className="text-sm font-mono text-urban-yellow">{order.telefono_cliente}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

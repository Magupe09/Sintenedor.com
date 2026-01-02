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
                                        {/* Status Update Buttons */}
                                        {order.estado === 'pendiente' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'preparando')}
                                                className="w-full bg-urban-red text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-sm mb-2"
                                            >
                                                👨‍🍳 Preparar
                                            </button>
                                        )}
                                        {order.estado === 'preparando' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'listo')}
                                                className="w-full bg-urban-yellow text-black py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-sm mb-2"
                                            >
                                                ✅ Marcar Listo
                                            </button>
                                        )}
                                        {order.estado === 'listo' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'entregado')}
                                                className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)] mb-2"
                                            >
                                                🚚 Entregado
                                            </button>
                                        )}

                                        {/* WhatsApp Shortcut Button */}
                                        <button
                                            onClick={() => {
                                                const id = order.id.slice(0, 5);
                                                let msg = '';
                                                if (order.estado === 'pendiente') msg = `¡Hola ${order.nombre_cliente}! Recibimos tu pedido de Sintenedor #${id}. ¡Pronto empezaremos a prepararlo! 🍕`;
                                                else if (order.estado === 'preparando') msg = `¡Hola! Tu pedido #${id} de Sintenedor ya está en el horno 👨‍🍳🔥`;
                                                else if (order.estado === 'listo') msg = `¡Buenas noticias! Tu pedido #${id} está LISTO ✅🍕 ¿Vienes por él o te lo llevamos?`;
                                                else msg = `¡Gracias por elegir Sintenedor! Tu pedido #${id} ha sido entregado. ¡Cuéntanos qué te pareció! 🍕✨`;

                                                const url = `https://wa.me/${order.telefono_cliente.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
                                                window.open(url, '_blank');
                                            }}
                                            className="w-full bg-green-600/10 border border-green-600/30 text-green-500 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all text-[10px] flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.41 0 .01 5.403.007 12.04a11.72 11.72 0 001.591 5.919L0 24l6.149-1.613a11.77 11.77 0 005.891 1.569h.005c6.64 0 12.039-5.403 12.042-12.042a11.761 11.761 0 00-3.483-8.511z" />
                                            </svg>
                                            Avisar cliente
                                        </button>
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

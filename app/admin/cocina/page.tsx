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
    const [view, setView] = useState<'active' | 'history'>('active');
    const supabase = createClient();

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('pedidos')
                .select(`
                    *,
                    items_pedido (*)
                `)
                .neq('estado', 'cancelado')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('💥 Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

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
                setOrders(originalOrders);
                throw error;
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Fallo al cambiar el estado del pedido.');
            fetchOrders();
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm('¿Seguro que quieres eliminar este pedido permanentemente? Esta acción no se puede deshacer.')) return;

        try {
            const { error } = await supabase
                .from('pedidos')
                .delete()
                .eq('id', orderId);

            if (error) throw error;
            setOrders(current => current.filter(o => o.id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Error al eliminar el pedido.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendiente': return 'bg-urban-red border-urban-red/50 text-white';
            case 'preparando': return 'bg-urban-yellow text-black border-urban-yellow/50';
            case 'listo': return 'bg-green-500 text-white border-green-500/50';
            case 'entregado': return 'bg-blue-600 text-white border-blue-600/50';
            default: return 'bg-foreground/10 text-foreground';
        }
    };

    const activeOrders = orders.filter(o => o.estado !== 'entregado');
    const historyOrders = orders.filter(o => o.estado === 'entregado');
    const displayedOrders = view === 'active' ? activeOrders : historyOrders;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 pt-24 md:p-12 lg:p-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="text-white">
                    <h1 className="text-6xl md:text-8xl font-[family-name:var(--font-urban-heading)] uppercase tracking-tighter leading-none mb-2">
                        Cocina <span className="text-urban-yellow">Sintenedor</span>
                    </h1>
                    <p className="text-sm uppercase tracking-widest opacity-80 font-bold">
                        Panel de Control de Banquetes • Tiempo Real
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="/">
                        <button className="px-6 py-2 border border-white/20 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all font-bold">
                            Inicio
                        </button>
                    </Link>
                </div>
            </header>

            {/* View Selector Tabs */}
            <div className="flex gap-4 mb-12 border-b border-white/10 pb-4">
                <button
                    onClick={() => setView('active')}
                    className={`text-sm uppercase tracking-[0.2em] font-bold pb-2 transition-all ${view === 'active' ? 'text-urban-yellow border-b-2 border-urban-yellow' : 'text-gray-500 hover:text-white'}`}
                >
                    Panel Activo ({activeOrders.length})
                </button>
                <button
                    onClick={() => setView('history')}
                    className={`text-sm uppercase tracking-[0.2em] font-bold pb-2 transition-all ${view === 'history' ? 'text-urban-yellow border-b-2 border-urban-yellow' : 'text-gray-500 hover:text-white'}`}
                >
                    Registro Diario ({historyOrders.length})
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-40">
                    <span className="text-2xl font-bold animate-pulse uppercase tracking-[1em]">Cocinando...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {displayedOrders.length === 0 ? (
                        <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                            <p className="text-4xl opacity-10 uppercase font-[family-name:var(--font-urban-heading)] italic">
                                {view === 'active' ? 'La cocina está en calma...' : 'No hay entregas registradas hoy.'}
                            </p>
                        </div>
                    ) : (
                        displayedOrders.map((order) => (
                            <div key={order.id} className="relative group bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden flex flex-col hover:border-urban-yellow/30 transition-all duration-500 shadow-2xl">
                                {/* Estado Badge */}
                                <div className={`px-5 py-2 text-[10px] uppercase font-bold tracking-widest flex justify-between items-center ${getStatusColor(order.estado)}`}>
                                    <span>{order.estado}</span>
                                    <span>#{order.id.slice(0, 5)}</span>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="mb-6 flex justify-between items-start">
                                        <div>
                                            <h3 className="text-3xl font-[family-name:var(--font-urban-heading)] uppercase leading-none mb-1 text-white">
                                                {order.nombre_cliente}
                                            </h3>
                                            <p className="text-xs opacity-70 font-mono text-white">
                                                {new Date(order.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteOrder(order.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-urban-red transition-all"
                                            title="Eliminar pedido"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Items List */}
                                    <div className="flex-1 space-y-4 mb-8">
                                        {order.items_pedido?.map((item) => (
                                            <div key={item.id} className="flex justify-between items-start gap-4 pb-4 border-b border-white/10 last:border-0 text-white">
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
                                        {/* Backtrack Button (Undo) */}
                                        <div className="flex gap-2">
                                            {order.estado !== 'pendiente' && (
                                                <button
                                                    onClick={() => {
                                                        const prev = order.estado === 'preparando' ? 'pendiente' :
                                                            order.estado === 'listo' ? 'preparando' : 'listo';
                                                        updateStatus(order.id, prev);
                                                    }}
                                                    className="flex-1 bg-white/5 border border-white/10 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                                                >
                                                    ↩ Regresar
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
                                                className={`flex-[2] py-2 rounded-xl font-bold uppercase tracking-widest transition-all text-[10px] flex items-center justify-center gap-2 border ${order.estado === 'entregado' ? 'bg-green-600 border-green-500 text-white' : 'bg-green-600/10 border-green-600/30 text-green-500 hover:bg-green-600 hover:text-white'}`}
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.41 0 .01 5.403.007 12.04a11.72 11.72 0 001.591 5.919L0 24l6.149-1.613a11.77 11.77 0 005.891 1.569h.005c6.64 0 12.039-5.403 12.042-12.042a11.761 11.761 0 00-3.483-8.511z" />
                                                </svg>
                                                Avisar
                                            </button>
                                        </div>

                                        {/* Next Status Button */}
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

                                {/* Cliente Info Hover (Bottom Strip) */}
                                <div className="p-4 bg-white/5 text-center flex justify-between items-center px-8">
                                    <div>
                                        <p className="text-[10px] uppercase opacity-60 font-bold text-white tracking-widest">Teléfono</p>
                                        <p className="text-sm font-mono text-urban-yellow font-bold">{order.telefono_cliente}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase opacity-60 font-bold text-white tracking-widest">Total</p>
                                        <p className="text-sm font-mono text-white font-bold">${order.total.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

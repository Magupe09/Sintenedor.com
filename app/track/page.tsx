'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import Link from 'next/link';

interface Order {
    id: string;
    nombre_cliente: string;
    telefono_cliente: string;
    total: number;
    estado: string;
    created_at: string;
    codigo_seguimiento: string;
    items_pedido?: {
        nombre_producto: string;
        cantidad: number;
        precio_unitario: number;
    }[];
}

interface RecentOrder {
    id: string;
    codigo_seguimiento: string;
    estado: string;
    total: number;
    created_at: string;
}

export default function TrackPage() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const supabase = createClient();

    // Cargar todos los pedidos activos al inicio
    useEffect(() => {
        loadActiveOrders();
    }, []);

    // Verificar si hay código específico en la URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code && activeOrders.length > 0) {
            // Buscar el pedido específico por código
            const order = activeOrders.find(o => o.codigo_seguimiento === code.toUpperCase());
            if (order) {
                setSelectedOrder(order);
            }
        }
    }, [activeOrders]);

    const loadActiveOrders = async () => {
        setLoading(true);
        try {
            console.log('📦 Cargando pedidos activos...');

            const { data, error } = await supabase
                .from('pedidos')
                .select(`
                    *,
                    items_pedido (*)
                `)
                .neq('estado', 'entregado') // Solo pedidos no entregados
                .not('codigo_seguimiento', 'is', null) // Solo pedidos con código de seguimiento
                .order('created_at', { ascending: false }); // Más recientes primero

            if (error) {
                console.error('❌ Error cargando pedidos activos:', error);
                setError('Error al cargar los pedidos activos');
                return;
            }

            console.log(`✅ Cargados ${data?.length || 0} pedidos activos`);
            setActiveOrders(data || []);

        } catch (err) {
            console.error('❌ Error en loadActiveOrders:', err);
            setError('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const selectOrder = (order: Order) => {
        setSelectedOrder(order);
        // Limpiar la URL si había un código automático
        if (window.location.search) {
            window.history.replaceState({}, '', window.location.pathname);
        }
    };

    const backToList = () => {
        setSelectedOrder(null);
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-urban-heading)] uppercase tracking-tighter mb-4">
                        {selectedOrder ? 'SEGUIMIENTO ACTIVO' : 'PEDIDOS ACTIVOS'}
                    </h1>
                    <p className="text-lg opacity-70 max-w-2xl mx-auto mb-4">
                        {selectedOrder
                            ? "Tu pedido está siendo preparado en tiempo real"
                            : "Selecciona tu pedido para ver el estado de preparación"
                        }
                    </p>

                    {/* Botón de volver cuando hay pedido seleccionado */}
                    {selectedOrder && (
                        <button
                            onClick={backToList}
                            className="mb-6 bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-all flex items-center gap-2 mx-auto"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Ver Todos los Pedidos
                        </button>
                    )}
            </div>

            {/* Lista de pedidos activos */}
            {!selectedOrder && (
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin w-12 h-12 border-4 border-urban-yellow border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-xl font-bold opacity-70">Cargando pedidos activos...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-urban-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-urban-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-xl font-bold text-urban-red mb-2">Error al cargar pedidos</p>
                            <p className="text-sm opacity-70">{error}</p>
                        </div>
                    ) : activeOrders.length === 0 ? (
                        <div className="text-center py-20 bg-foreground/5 rounded-3xl border border-dashed border-foreground/10">
                            <div className="w-20 h-20 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold opacity-30 uppercase tracking-widest italic">
                                No hay pedidos activos
                            </p>
                            <p className="text-sm opacity-50 mt-2">Todos los pedidos han sido entregados</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 hover:border-urban-yellow/30 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_30px_rgba(240,200,8,0.1)]"
                                    onClick={() => selectOrder(order)}
                                >
                                    {/* Header con código y estado */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-urban-yellow/10 rounded-full flex items-center justify-center group-hover:bg-urban-yellow/20 transition-colors">
                                                <span className="text-sm font-mono font-bold text-urban-yellow">
                                                    {order.codigo_seguimiento}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs opacity-60 uppercase tracking-widest font-bold">Pedido</p>
                                                <p className="font-bold text-sm">#{order.id.slice(0, 8)}</p>
                                            </div>
                                        </div>

                                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                            order.estado === 'pendiente' ? 'bg-urban-red/20 text-urban-red' :
                                            order.estado === 'preparando' ? 'bg-urban-yellow/20 text-urban-yellow' :
                                            'bg-green-500/20 text-green-500'
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full ${
                                                order.estado === 'pendiente' ? 'bg-urban-red animate-pulse' :
                                                order.estado === 'preparando' ? 'bg-urban-yellow animate-pulse' :
                                                'bg-green-500'
                                            }`}></div>
                                            {order.estado}
                                        </div>
                                    </div>

                                    {/* Información del pedido */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="opacity-60">Total:</span>
                                            <span className="font-bold text-urban-yellow">${order.total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="opacity-60">Items:</span>
                                            <span className="font-bold">{order.items_pedido?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="opacity-60">Hora:</span>
                                            <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </div>

                                    {/* Call to action */}
                                    <div className="text-center pt-3 border-t border-foreground/10">
                                        <p className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                                            Click para ver seguimiento →
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* OrderStatusTracker cuando hay pedido seleccionado */}
            {selectedOrder && (
                <div className="space-y-8">
                    {/* Tracker de Estado */}
                    <div className="flex justify-center">
                        <OrderStatusTracker
                            status={selectedOrder.estado}
                            orderId={selectedOrder.id}
                        />
                    </div>

                    {/* Detalles del Pedido */}
                    <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-[family-name:var(--font-urban-heading)] uppercase tracking-tight">
                                Detalles del Pedido
                            </h2>
                            <span className="text-xs bg-urban-yellow/10 text-urban-yellow px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                #{selectedOrder.id.slice(0, 8)}
                            </span>
                        </div>

                        {/* Items */}
                        <div className="space-y-4 mb-6">
                            {selectedOrder.items_pedido?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-foreground/10 last:border-0">
                                    <div>
                                        <p className="font-bold uppercase tracking-tight">
                                            <span className="text-urban-yellow mr-2">{item.cantidad}x</span>
                                            {item.nombre_producto}
                                        </p>
                                    </div>
                                    <p className="text-sm opacity-60">
                                        {formatPrice(item.precio_unitario * item.cantidad)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center pt-4 border-t border-foreground/20">
                            <span className="text-lg font-bold uppercase tracking-widest">Total</span>
                            <span className="text-2xl font-[family-name:var(--font-urban-heading)] text-urban-yellow">
                                {formatPrice(selectedOrder.total)}
                            </span>
                        </div>

                        {/* Información del cliente */}
                        <div className="mt-6 pt-4 border-t border-foreground/10">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-[10px] uppercase opacity-60 tracking-widest mb-1">Cliente</p>
                                    <p className="font-bold">{selectedOrder.nombre_cliente}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase opacity-60 tracking-widest mb-1">Fecha</p>
                                    <p className="font-bold">
                                        {new Date(selectedOrder.created_at).toLocaleDateString()} {new Date(selectedOrder.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="text-center mt-16">
                <Link href="/" className="text-urban-yellow hover:text-white transition-colors underline underline-offset-4">
                    ← Volver al menú
                </Link>
            </div>
        </div>
    );
}

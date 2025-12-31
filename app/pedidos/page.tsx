'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Mock data for orders
const MOCK_ORDERS = [
    {
        id: 'ORD-7721',
        date: '2025-12-28',
        items: [
            { name: 'Pizza Pepperoni', quantity: 2, price: 14000 },
            { name: 'Coca Cola', quantity: 2, price: 3000 }
        ],
        total: 34000,
        status: 'Entregado',
        pointsEarned: 34
    },
    {
        id: 'ORD-6542',
        date: '2025-12-20',
        items: [
            { name: 'Classic Cheese', quantity: 1, price: 16000 },
            { name: 'Bebida', quantity: 1, price: 3000 }
        ],
        total: 19000,
        status: 'Entregado',
        pointsEarned: 19
    }
];

export default function OrdersPage() {
    const { user } = useAuth();

    if (!user) {
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

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-urban-heading)] uppercase tracking-tighter">Mis Pedidos</h1>
                <Link href="/perfil">
                    <div className="bg-foreground/5 border border-foreground/10 p-3 rounded-xl hover:bg-foreground/10 transition-colors">
                        <span className="text-xs uppercase tracking-widest">Mi Perfil 👤</span>
                    </div>
                </Link>
            </div>

            <div className="space-y-6">
                {MOCK_ORDERS.length === 0 ? (
                    <div className="text-center py-20 bg-foreground/5 rounded-3xl border border-dashed border-foreground/10">
                        <p className="text-xl opacity-50 mb-4">Aún no has hecho ningún pedido...</p>
                        <Link href="/">
                            <button className="text-urban-yellow hover:text-white transition-colors underline underline-offset-4">
                                ¡Pide algo rico ahora!
                            </button>
                        </Link>
                    </div>
                ) : (
                    MOCK_ORDERS.map((order) => (
                        <div key={order.id} className="bg-foreground/5 border border-foreground/10 rounded-3xl p-6 md:p-8 hover:border-foreground/20 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold uppercase tracking-tight">{order.id}</h3>
                                        <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20 uppercase font-bold">
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs opacity-50 font-mono">{order.date}</p>
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
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between text-sm">
                                            <span className="opacity-80">
                                                <span className="font-bold text-foreground">{item.quantity}x</span> {item.name}
                                            </span>
                                            <span className="opacity-40">${(item.price * item.quantity).toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2 bg-urban-yellow/10 px-4 py-2 rounded-full border border-urban-yellow/20">
                                    <span className="text-lg">✨</span>
                                    <p className="text-xs font-bold text-urban-yellow uppercase tracking-widest">
                                        Ganaste {order.pointsEarned} S-Points
                                    </p>
                                </div>

                                <button className="w-full md:w-auto bg-foreground/5 border border-foreground/20 hover:bg-foreground hover:text-background text-foreground px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                                    Repetir Pedido
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

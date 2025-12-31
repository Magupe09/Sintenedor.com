'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MemberCard from '@/components/MemberCard';
import Link from 'next/link';
import Toast from '@/components/Toast';

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Form states
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '');
            setPhone(user.user_metadata?.phone || '');
            setAddress(user.user_metadata?.address || '');
        }
    }, [user]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await updateProfile({
            full_name: fullName,
            phone: phone,
            address: address
        });
        setLoading(false);

        if (error) {
            setToast({ message: 'Error al actualizar: ' + error.message, type: 'error' });
        } else {
            setToast({ message: '¡Perfil actualizado con éxito!', type: 'success' });
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <div className="max-w-md">
                    <h1 className="text-4xl font-[family-name:var(--font-urban-heading)] mb-4">Uups...</h1>
                    <p className="mb-6 opacity-70">Debes iniciar sesión para ver tu perfil exclusivo.</p>
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
            <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-urban-heading)] mb-8 uppercase tracking-tighter">Mi Club</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Left Side: Member Card & Info */}
                <div className="space-y-8">
                    <MemberCard />

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                        <h2 className="text-2xl font-[family-name:var(--font-urban-heading)] mb-4 text-urban-yellow">Tus Beneficios</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="text-urban-red text-xl">🔥</span>
                                <p className="text-sm opacity-80">
                                    <span className="font-bold text-white">Envío Gratis:</span> Por ser miembro, tus pedidos tienen prioridad y envío sin costo.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-urban-red text-xl">💎</span>
                                <p className="text-sm opacity-80">
                                    <span className="font-bold text-white">S-Points:</span> Acumula puntos por cada compra y canjéalos por comida gratis.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-urban-red text-xl">🚀</span>
                                <p className="text-sm opacity-80">
                                    <span className="font-bold text-white">Secret Menu:</span> Acceso a platos que nadie más puede pedir.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Data Form */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                    <h2 className="text-2xl font-[family-name:var(--font-urban-heading)] mb-6 uppercase tracking-widest">Información de Entrega</h2>
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Nombre Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-urban-red transition-colors"
                                placeholder="..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Teléfono de Contacto</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-urban-red transition-colors"
                                placeholder="Ej: +57 300..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Dirección Principal</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-urban-red transition-colors resize-none"
                                placeholder="Donde llega la magia..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-foreground text-background font-bold py-4 rounded-full uppercase tracking-widest hover:bg-urban-yellow hover:text-black transition-all disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Guardando...' : 'Actualizar mis datos'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Navigation back and extra links */}
            <div className="mt-12 flex gap-4">
                <Link href="/pedidos" className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-urban-red underline-offset-4">
                    Ver mis pedidos
                </Link>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-urban-yellow underline-offset-4">
                    Volver al Inicio
                </Link>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

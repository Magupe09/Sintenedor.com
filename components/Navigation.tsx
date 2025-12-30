'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navigation() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* FAB (Floating Action Button) - Bottom Right */}
            <button
                onClick={toggleMenu}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg hover:scale-110 transition-all z-[60] flex items-center justify-center
                    ${isOpen ? 'bg-white text-black rotate-90' : 'bg-black text-white'}
                `}
            >
                {isOpen ? (
                    // Icono X (Cerrar)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    // Icono Hamburguesa (Menú)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </button>

            {/* OVERLAY / TELÓN A PANTALLA COMPLETA */}
            <div
                className={`fixed inset-0 bg-[#020202] z-[55] flex flex-col items-center justify-center transition-all duration-500 ease-in-out
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                `}
            >
                {/* 1. CABECERA VIP (Marketing / Login) */}
                <div className="absolute top-10 w-full px-8 text-center">
                    <div className="border border-[#333] p-6 rounded-xl bg-[#0a0a0a]">
                        <p className="text-gray-400 text-sm font-[family-name:var(--font-urban-body)] mb-2">
                            {user ? `Hola, ${user.user_metadata?.full_name || 'Amigo'}` : '¿Aún no eres miembro?'}
                        </p>
                        {user ? (
                            <button
                                onClick={() => { signOut(); toggleMenu(); }}
                                className="bg-[#111] border border-white text-white px-8 py-2 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors font-[family-name:var(--font-urban-heading)]"
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <Link href="/registro" onClick={toggleMenu}>
                                <button className="bg-[#DD1C1A] text-white px-8 py-2 rounded-full font-bold uppercase tracking-widest hover:bg-[#F0C808] hover:text-black transition-colors font-[family-name:var(--font-urban-heading)]">
                                    Únete al Club
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* 2. MENÚ DE NAVEGACIÓN */}
                <nav className="flex flex-col gap-6 text-center">
                    <Link
                        href="/"
                        onClick={toggleMenu}
                        className="text-5xl md:text-7xl font-[family-name:var(--font-urban-heading)] text-white hover:text-[#DD1C1A] transition-colors uppercase tracking-tight"
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/" // Por ahora va al home, luego a /menu
                        onClick={toggleMenu}
                        className="text-5xl md:text-7xl font-[family-name:var(--font-urban-heading)] text-white hover:text-[#DD1C1A] transition-colors uppercase tracking-tight"
                    >
                        Menú Completo
                    </Link>
                    <Link
                        href="/carrito"
                        onClick={toggleMenu}
                        className="text-5xl md:text-7xl font-[family-name:var(--font-urban-heading)] text-gray-500 hover:text-white transition-colors uppercase tracking-tight"
                    >
                        Tu Pedido
                    </Link>

                    {/* Admin Link - Solo visible para admin */}
                    {user?.email === 'maonvacation@gmail.com' && (
                        <Link
                            href="/admin"
                            onClick={toggleMenu}
                            className="text-3xl md:text-4xl font-[family-name:var(--font-urban-heading)] text-[#F0C808] hover:text-[#DD1C1A] transition-colors uppercase tracking-tight border-t border-[#333] pt-6 mt-4"
                        >
                            🔧 Panel Admin
                        </Link>
                    )}
                </nav>

                {/* 3. FOOTER (Social) */}
                <div className="absolute bottom-24 flex gap-6 text-gray-500">
                    <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
                    <span className="cursor-pointer hover:text-white transition-colors">TikTok</span>
                </div>
            </div>
        </>
    );
}

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
                className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-all z-[60] flex items-center justify-center border-2
                    ${isOpen ? 'bg-white border-black text-black rotate-90' : 'bg-[#0a0a0a] border-white/10 text-white'}
                `}
            >
                {isOpen ? (
                    // Icono X (Cerrar)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    // Icono Hamburguesa "Branded" (Usando colores del proyecto)
                    <div className="flex flex-col gap-1 w-8 items-center transform -rotate-6 transition-transform group-hover:rotate-0">
                        {/* Pan Superior - Amarillo Proyecto */}
                        <div className="w-full h-2.5 bg-[#F0C808] rounded-t-full shadow-sm" />

                        {/* Queso/Salsa - Blanco Proyecto */}
                        <div className="w-[110%] h-1 bg-[#FAFFFD] rounded-full opacity-90" />

                        {/* Carne - Rojo Proyecto */}
                        <div className="w-full h-2.5 bg-[#DD1C1A] rounded-sm shadow-md" />

                        {/* Pan Inferior - Amarillo Proyecto */}
                        <div className="w-full h-1.5 bg-[#F0C808] rounded-b-lg shadow-sm" />
                    </div>
                )}
            </button>

            {/* OVERLAY / TELÓN A PANTALLA COMPLETA */}
            <div
                className={`fixed inset-0 bg-background z-[55] flex flex-col items-center justify-center transition-all duration-500 ease-in-out overflow-y-auto pt-24 pb-12
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                `}
            >
                {/* EFECTO DE LUZ / GLOW DE FONDO */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(221,28,26,0.08)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_center,rgba(221,28,26,0.12)_0%,transparent_60%)]" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(240,200,8,0.05)_0%,transparent_40%)]" />
                </div>

                {/* LOGO DE FONDO (MARCA DE AGUA) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                    <img
                        src="/assets/logo.png"
                        alt=""
                        className="w-[110%] h-[110%] md:w-[70%] md:h-[70%] object-contain opacity-[0.15] dark:opacity-[0.25] transition-opacity duration-1000 grayscale brightness-110"
                    />
                </div>

                {/* 1. CABECERA VIP (Marketing / Login) */}
                <div className="absolute top-10 w-full px-8 text-center z-10">
                    <div className="border border-[#333] p-6 rounded-xl bg-[#0a0a0a]/60 backdrop-blur-md">
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
                <nav className="relative z-10 flex flex-col gap-4 md:gap-6 text-center max-h-full">
                    <Link
                        href="/"
                        onClick={toggleMenu}
                        className="text-4xl md:text-7xl font-[family-name:var(--font-urban-heading)] text-foreground hover:text-[#DD1C1A] transition-colors uppercase tracking-tight"
                    >
                        Inicio
                    </Link>

                    {user && (
                        <>
                            <Link
                                href="/perfil"
                                onClick={toggleMenu}
                                className="text-4xl md:text-7xl font-[family-name:var(--font-urban-heading)] text-urban-yellow hover:text-foreground transition-colors uppercase tracking-tight"
                            >
                                Mi Perfil
                            </Link>
                            <Link
                                href="/pedidos"
                                onClick={toggleMenu}
                                className="text-4xl md:text-7xl font-[family-name:var(--font-urban-heading)] text-foreground hover:text-[#DD1C1A] transition-colors uppercase tracking-tight"
                            >
                                Mis Pedidos
                            </Link>
                        </>
                    )}

                    <Link
                        href="/" // Por ahora va al home, luego a /menu
                        onClick={toggleMenu}
                        className="text-4xl md:text-7xl font-[family-name:var(--font-urban-heading)] text-foreground hover:text-[#DD1C1A] transition-colors uppercase tracking-tight"
                    >
                        Menú Completo
                    </Link>
                    <Link
                        href="/carrito"
                        onClick={toggleMenu}
                        className="text-4xl md:text-7xl font-[family-name:var(--font-urban-heading)] text-gray-500 hover:text-foreground transition-colors uppercase tracking-tight"
                    >
                        Tu Pedido
                    </Link>

                    {/* Admin Link - Solo visible para admin */}
                    {user?.email === 'maonvacation@gmail.com' && (
                        <Link
                            href="/admin"
                            onClick={toggleMenu}
                            className="text-2xl md:text-4xl font-[family-name:var(--font-urban-heading)] text-[#F0C808] hover:text-[#DD1C1A] transition-colors uppercase tracking-tight border-t border-white/10 pt-4 mt-2"
                        >
                            🔧 Panel Admin
                        </Link>
                    )}
                </nav>

                {/* 3. FOOTER (Social) */}
                <div className="absolute bottom-24 flex gap-6 text-gray-500 z-10">
                    <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
                    <span className="cursor-pointer hover:text-white transition-colors">TikTok</span>
                </div>
            </div>
        </>
    );
}

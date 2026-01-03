'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartIcon() {
    const { cart } = useCart();
    const pathname = usePathname();
    const [animate, setAnimate] = useState(false);
    const [mounted, setMounted] = useState(false);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const isOpen = pathname === '/carrito';

    // Hydration fix: Only render on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Trigger animation when totalItems changes
    useEffect(() => {
        if (totalItems > 0) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 600);
            return () => clearTimeout(timer);
        }
    }, [totalItems]);

    if (!mounted) return null;
    if (totalItems === 0 && !isOpen) return null;

    return (
        <Link
            href={isOpen ? '/' : '/carrito'}
            className={`fixed bottom-6 left-6 z-[70] flex items-center justify-center transition-all duration-300 group
                ${animate ? 'animate-cart-bounce' : 'hover:scale-110'}
            `}
        >
            <div
                className={`relative rounded-2xl shadow-2xl transition-colors duration-300 flex items-center justify-center shrink-0 overflow-visible
                    ${isOpen ? 'bg-red-600' : 'bg-black/80 backdrop-blur-md border border-white/10'}
                `}
                style={{
                    width: 'var(--btn-size)',
                    height: 'var(--btn-size)',
                    '--btn-size': '70px'
                } as any}
            >
                {/* Responsive size force */}
                <style jsx>{`
                    @media (min-width: 768px) {
                        div { --btn-size: 80px !important; }
                    }
                `}</style>

                {isOpen ? (
                    // Icono de "X" (Cerrar)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    // LOGO COMO CARRITO (Forced size 70px-80px)
                    <div className="relative flex items-center justify-center w-full h-full">
                        <img
                            src="/assets/logo.png"
                            alt="Carrito"
                            className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(221,28,26,0.3)]"
                        />

                        {/* BADGE DEL CONTADOR - Posicionado arriba como una moneda */}
                        {totalItems > 0 && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#DD1C1A] text-white text-[12px] md:text-[13px] font-black w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 border-white shadow-[0_4px_10px_rgba(221,28,26,0.3)] transform transition-all group-hover:-translate-y-1">
                                {totalItems}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}


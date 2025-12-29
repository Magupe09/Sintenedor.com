'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function CartIcon() {
    const { cart } = useCart();
    const pathname = usePathname();

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Determinamos si el carrito está "abierto" (si estamos en la página)
    const isOpen = pathname === '/carrito';

    // Si está vacío Y no estamos en la página del carrito, no mostramos nada.
    // (Si estamos dentro, sí lo mostramos para poder "cerrar" y salir)
    if (totalItems === 0 && !isOpen) return null;

    return (
        <Link
            href={isOpen ? '/' : '/carrito'} // Lógica de Toogle: Si está abierto, ve a Home. Si no, ve a Carrito.
            className={`fixed bottom-6 left-6 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all z-50 flex items-center justify-center gap-2 ${isOpen ? 'bg-red-600 rotate-0' : 'bg-black'
                }`}
        >
            {isOpen ? (
                // Icono de "X" (Cerrar)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                // Icono del Carrito (Abrir)
                <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                    </svg>
                    <span className="font-bold text-sm">
                        {totalItems}
                    </span>
                </>
            )}
        </Link>
    );
}

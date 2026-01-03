'use client';

import MenuItem from "@/components/MenuItem";
import ProductModal from "@/components/ProductModal";
import { MENU_ITEMS, Product } from "@/lib/data";
import { useState } from "react";

export default function MenuList() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    return (
        // CONTENEDOR PRINCIPAL
        // sm+: H-screen + Overflow hidden (No scroll)
        // Mobile (<640px): Scroll normal
        <div className="w-full h-full sm:h-screen sm:overflow-hidden flex flex-col items-center bg-transparent">

            {/* HEADER - 1/3 en tablet, un poco más grande (40vh) en desktop */}
            <div className="shrink-0 w-full px-4 z-10 
                            flex items-center justify-center
                            pt-6 pb-2
                            sm:h-[33vh] lg:h-[40vh] sm:py-0">
                <img
                    src="/assets/sintenedor_trimmed.png"
                    alt="Sintenedor"
                    className="
                        block
                        mx-auto
                        w-auto
                        h-[95%]
                        sm:h-full
                        lg:h-full
                        max-h-[180px]
                        sm:max-h-full
                        object-contain
                        transition-all duration-500
                    "
                />
            </div>

            {/* BANNER DE RASTREO - Solo visible en desktop/tablet */}
            <div className="hidden sm:block shrink-0 w-full px-4 mb-4">
                <div className="max-w-md mx-auto">
                    <a
                        href="/track"
                        className="block bg-gradient-to-r from-urban-yellow/20 to-urban-red/20 backdrop-blur-md border border-urban-yellow/30 rounded-2xl p-4 hover:border-urban-yellow/50 transition-all duration-300 group cursor-pointer shadow-[0_0_20px_rgba(240,200,8,0.1)]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-urban-yellow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold uppercase tracking-widest text-urban-yellow mb-1">
                                    ¿Ya hiciste un pedido?
                                </p>
                                <p className="text-xs opacity-80 leading-tight">
                                    Rastrea tu pedido en tiempo real con tu código único
                                </p>
                            </div>
                            <svg className="w-4 h-4 text-urban-yellow group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                </div>
            </div>

            {/* GRID CONTAINER
                Móvil: Reducido al 75% para ver más video de fondo
                Desktop: 60% vh para compensar el logo más grande
            */}
            <div className="flex-1 w-full flex items-center justify-center min-h-0 px-4 pb-8 sm:pb-12 md:pb-32 lg:pb-12">
                <div className="grid gap-6 md:gap-x-10 md:gap-y-10 w-[75%] sm:w-full h-fit max-h-full
                                grid-cols-1 overflow-y-auto 
                                sm:grid-cols-2 sm:overflow-visible sm:max-w-[440px] md:max-w-[720px]
                                lg:grid-cols-4 lg:max-w-[1400px]">
                    {MENU_ITEMS.map((item) => (
                        <MenuItem
                            key={item.id}
                            product={item}
                            onClick={() => setSelectedProduct(item)}
                        />
                    ))}
                </div>
            </div>

            {/* MODAL DE DETALLES */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}

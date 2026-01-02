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

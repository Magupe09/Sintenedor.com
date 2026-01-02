'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/data';
import { useCart } from '@/context/CartContext';

interface MenuItemProps {
  product: Product;
  onClick?: () => void;
}

export default function MenuItem({ product, onClick }: MenuItemProps) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  // Auto-hide fire after 2 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(product.price);

  return (
    <div
      onClick={onClick}
      className="group relative w-full aspect-[3/4] md:aspect-[4/3] lg:aspect-[2/3] overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(240,200,8,0.15)] shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-[#F0C808]/20 hover:border-[#F0C808]/60 cursor-pointer"
    >
      {/* 1. IMAGEN DE FONDO (Full Cover) */}
      <div className="absolute inset-0 bg-gray-800">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 font-bold tracking-widest">
            NO IMAGE
          </div>
        )}
      </div>

      {/* 2. OVERLAY GRADIENTES (Para legibilidad) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent opacity-90" />
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/80 to-transparent opacity-90" />

      {/* 3. TÍTULO EN LA PARTE SUPERIOR */}
      <div className="absolute top-0 left-0 w-full p-5 md:p-4 lg:p-8 z-20">
        <h3 className="text-xl md:text-lg lg:text-4xl text-[#FAFFFD] uppercase tracking-tighter drop-shadow-md font-[family-name:var(--font-urban-heading)] lg:leading-[0.8]">
          {product.name}
        </h3>
      </div>

      {/* 4. INFO Y ACCIONES EN LA PARTE INFERIOR */}
      <div className="absolute bottom-0 left-0 w-full p-5 md:p-4 lg:p-6 flex flex-col gap-1 md:gap-1 lg:gap-2 z-10">
        {/* Descripción corta */}
        <p className="text-xs md:text-[10px] lg:text-lg text-gray-300 line-clamp-1 md:line-clamp-1 lg:line-clamp-2 font-[family-name:var(--font-urban-body)] opacity-80">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          {/* Precio destacado */}
          <span className="text-xl md:text-lg lg:text-2xl text-[#F0C808] drop-shadow-sm font-[family-name:var(--font-urban-heading)] tracking-wider">
            {formattedPrice}
          </span>

          {/* Botón Urbano */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
                setShowToast(true);
              }}
              className="bg-[#DD1C1A] text-white px-4 py-1.5 md:px-5 md:py-2 lg:px-6 lg:py-2 rounded-lg font-bold text-xs md:text-sm lg:text-lg uppercase tracking-widest hover:bg-[#F0C808] hover:text-black transition-colors active:scale-95 shadow-lg font-[family-name:var(--font-urban-heading)]"
            >
              AÑADIR +
            </button>

            {/* Fire emoji emerging from button */}
            <div
              className={`absolute -top-6 left-1/2 -translate-x-1/2 transition-all duration-150 pointer-events-none ${showToast ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-0'
                }`}
            >
              <span className="text-xl">🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

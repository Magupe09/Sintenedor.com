'use client';

import Image from 'next/image';
import { Product } from '@/lib/data';
import { useCart } from '@/context/CartContext';

interface MenuItemProps {
  product: Product;
}

export default function MenuItem({ product }: MenuItemProps) {
  const { addToCart } = useCart();

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(product.price);

  return (
    <div className="group relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-xl transition-transform hover:scale-[1.02]">
      {/* 1. IMAGEN DE FONDO (Full Cover) */}
      <div className="absolute inset-0 bg-gray-900">
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

      {/* 2. OVERLAY GRADIENTE (Para legibilidad) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/60 to-transparent opacity-90" />

      {/* 3. INFO Y ACCIONES (Flotando encima) */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-2 z-10">
        {/* Nombre con fuente Urban */}
        <h3 className="text-4xl text-[#FAFFFD] uppercase tracking-wide drop-shadow-md font-[family-name:var(--font-urban-heading)]">
          {product.name}
        </h3>

        {/* Descripción corta */}
        <p className="text-sm text-gray-300 line-clamp-2 font-[family-name:var(--font-urban-body)] mb-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2">
          {/* Precio destacado */}
          <span className="text-2xl text-[#F0C808] drop-shadow-sm font-[family-name:var(--font-urban-heading)] tracking-wider">
            {formattedPrice}
          </span>

          {/* Botón Urbano */}
          <button
            onClick={() => {
              addToCart(product);
              // Podríamos usar un toast aquí mejor que un alert
              // alert(`${product.name} ready!`);
            }}
            className="bg-[#DD1C1A] text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest hover:bg-[#F0C808] hover:text-black transition-colors active:scale-95 shadow-lg font-[family-name:var(--font-urban-heading)]"
          >
            AÑADIR +
          </button>
        </div>
      </div>
    </div>
  );
}

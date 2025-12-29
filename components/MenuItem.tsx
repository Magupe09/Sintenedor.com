
'use client';

import Image from 'next/image';
import { Product } from '@/lib/data'; // 👈 Importamos la "forma" que definimos antes

// ----------------------------------------------------------------------
// 🎓 ZONA DE APRENDIZAJE: PROPS
// ----------------------------------------------------------------------
// Los componentes en React reciben "Props" (argumentos).
// Aquí le decimos: "Este componente OBLIGATORIAMENTE necesita recibir
// un 'product' que cumpla con la interface Product".
// ----------------------------------------------------------------------

interface MenuItemProps {
  product: Product;
}

export default function MenuItem({ product }: MenuItemProps) {
  // formatear el precio a pesos (ej: $12.000)
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col gap-3">
      {/* 1. Imagen (si existe) */}
      {/* Usamos Next Image para optimización automática */}
      <div className="relative w-full h-48 rounded-md overflow-hidden bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      {/* 2. Información */}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
      </div>

      {/* 3. Precio y Botón */}
      <div className="flex items-center justify-between mt-2">
        <span className="font-semibold text-green-700 text-lg">
          {formattedPrice}
        </span>

        <button
          className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          // Por ahora este botón no hace nada, eso lo veremos en el Módulo 3
          onClick={() => alert(`Añadir ${product.name} (Próximamente)`)}
        >
          Añadir +
        </button>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { Product } from '@/lib/data';
import { useEffect, useState } from 'react';

interface ProductModalProps {
    product: Product;
    onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!product) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            {/* OVERLAY DARK / BLUR */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

            {/* CONTENIDO DEL MODAL */}
            <div
                className="relative w-full h-full flex flex-col items-center justify-between py-12 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                {/* 1. SECCIÓN IMAGEN (CENTRAL Y FLOTANTE) */}
                <div className="relative flex-1 w-full flex items-center justify-center pointer-events-none">

                    {/* GLOW DE FONDO (Para resaltar la transparencia) */}
                    <div className="absolute w-[400px] h-[400px] bg-[#DD1C1A]/10 rounded-full blur-[120px] animate-pulse" />

                    {/* POLVO DE HORNEAR (HARINA) */}
                    <div className="absolute inset-0 z-20 overflow-hidden">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute bg-white/40 rounded-full animate-snow"
                                style={{
                                    width: Math.random() * 3 + 1 + 'px',
                                    height: Math.random() * 3 + 1 + 'px',
                                    left: Math.random() * 100 + '%',
                                    top: '-5%',
                                    animationDuration: Math.random() * 2 + 1.5 + 's',
                                    animationDelay: Math.random() * 5 + 's',
                                }}
                            />
                        ))}
                    </div>

                    {/* IMAGEN DE PRODUCTO CON SOMBRA REALISTA */}
                    <div className="relative w-[85%] h-[85%] max-w-4xl z-10 animate-float">
                        {(product.modalImage || product.image) && (
                            <Image
                                src={product.modalImage || product.image || ""}
                                alt={product.name}
                                fill
                                className="object-contain drop-shadow-[0_45px_100px_rgba(0,0,0,0.95)]"
                                priority
                            />
                        )}
                    </div>
                </div>

                {/* 2. SECCIÓN INFO (INFERIOR) */}
                <div className="relative w-full text-center p-6 sm:p-10 z-30">
                    <div className="max-w-5xl mx-auto flex flex-col gap-6">
                        <h2 className="text-5xl sm:text-7xl md:text-[8rem] font-[family-name:var(--font-urban-heading)] text-white uppercase tracking-tight leading-[0.75] animate-fade-up">
                            {product.name}
                        </h2>

                        {product.ingredients && product.ingredients.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                {product.ingredients.map((ing, i) => (
                                    <span
                                        key={i}
                                        className="px-6 py-2 bg-white/[0.03] backdrop-blur-md rounded-full text-xs md:text-sm text-gray-300 font-[family-name:var(--font-urban-body)] uppercase tracking-[0.3em] border border-white/5"
                                    >
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="text-sm sm:text-lg md:text-xl text-gray-400 font-[family-name:var(--font-urban-body)] italic max-w-3xl mx-auto leading-relaxed opacity-80 mt-2">
                            {product.description}
                        </p>
                    </div>
                </div>

                {/* BOTÓN DE CIERRE (FLOTANTE ARRIBA) */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 text-white/20 hover:text-white transition-all hover:rotate-90 z-[100] bg-white/5 rounded-full border border-white/5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <style jsx global>{`
        @keyframes snow {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(80vh); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(1deg); }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-snow {
          animation: snow linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }
      `}</style>
        </div>
    );
}

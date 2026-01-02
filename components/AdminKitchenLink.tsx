'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

/**
 * Reusable component for accessing the Kitchen dashboard.
 * Designed for employee profiles and administration panels.
 */
export default function AdminKitchenLink() {
    const { user } = useAuth();

    // For now, any logged-in user can see it for easier testing, 
    // but this is where role-based logic would go later.
    if (!user) return null;

    return (
        <Link href="/admin/cocina" className="block group">
            <div className="relative overflow-hidden bg-gradient-to-br from-urban-red to-[#900] border border-white/20 p-6 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 text-8xl opacity-10 font-[family-name:var(--font-urban-heading)]">
                    KITCHEN
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 mb-1">
                            Staff Only • Acceso Directo
                        </p>
                        <h3 className="text-3xl font-[family-name:var(--font-urban-heading)] uppercase leading-none text-white">
                            Panel de <span className="text-urban-yellow">Cocina</span>
                        </h3>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/10 group-hover:bg-urban-yellow group-hover:text-black transition-all">
                        <span className="text-2xl">👨‍🍳</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                        Gestionar banquetes en tiempo real
                    </p>
                </div>
            </div>
        </Link>
    );
}

'use client';

import { useAuth } from '@/context/AuthContext';

export default function MemberCard() {
    const { user, points } = useAuth();

    const userName = user?.user_metadata?.full_name || 'Miembro VIP';
    const memberSince = user?.created_at ? new Date(user.created_at).getFullYear() : '2024';

    return (
        <div className="relative w-full max-w-sm aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl group border border-white/10">
            {/* Background Layer with Gradient and Mesh Effect */}
            <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-20 -mt-20 shrink-0" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl -ml-10 -mb-10 shrink-0" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            {/* Content Layer */}
            <div className="relative h-full p-6 flex flex-col justify-between text-white font-[family-name:var(--font-urban-body)]">
                {/* Header: Logo/Title */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-[family-name:var(--font-urban-heading)] tracking-wider text-yellow-500 uppercase">SinTenedor Club</h3>
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">Exclusive Member</p>
                    </div>
                    <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center bg-white/5 backdrop-blur-sm">
                        <span className="text-xl">🍴</span>
                    </div>
                </div>

                {/* Body: Points */}
                <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Puntos Acumulados</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-[family-name:var(--font-urban-heading)] text-white">
                            {points.toLocaleString()}
                        </span>
                        <span className="text-yellow-500 text-sm font-bold uppercase tracking-tighter">S-Points</span>
                    </div>
                </div>

                {/* Footer: User Info & Member Date */}
                <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-2">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60">Titular</p>
                        <p className="text-sm font-bold tracking-wide truncate max-w-[150px] uppercase">
                            {userName}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest opacity-60">Desde</p>
                        <p className="text-sm font-mono font-bold tracking-widest">
                            {memberSince}
                        </p>
                    </div>
                </div>
            </div>

            {/* Shine Effect Animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        </div>
    );
}

import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
    const supabase = await createClient()

    // Get user count from Supabase Auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    const userCount = users?.length || 0

    return (
        <div className="min-h-screen bg-[#020202] text-white p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-[family-name:var(--font-urban-heading)] mb-2">
                        PANEL DE ADMINISTRACIÓN
                    </h1>
                    <p className="text-gray-400 font-[family-name:var(--font-urban-body)]">
                        Gestiona usuarios y pedidos de Sintenedor
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                    {/* Users Card */}
                    <div className="bg-[#111] border border-[#333] rounded-xl p-6 hover:border-[#DD1C1A] transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm uppercase tracking-widest">
                                Usuarios Registrados
                            </h3>
                            <svg className="w-8 h-8 text-[#DD1C1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-[family-name:var(--font-urban-heading)]">
                            {userCount}
                        </p>
                    </div>

                    {/* Orders Card (Placeholder) */}
                    <div className="bg-[#111] border border-[#333] rounded-xl p-6 opacity-50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm uppercase tracking-widest">
                                Pedidos (WhatsApp)
                            </h3>
                            <svg className="w-8 h-8 text-[#F0C808]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-[family-name:var(--font-urban-heading)]">
                            -
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Próximamente</p>
                    </div>

                    {/* Revenue Card (Placeholder) */}
                    <div className="bg-[#111] border border-[#333] rounded-xl p-6 opacity-50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm uppercase tracking-widest">
                                Ingresos
                            </h3>
                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-[family-name:var(--font-urban-heading)]">
                            -
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Próximamente</p>
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Users Management */}
                    <Link
                        href="/admin/users"
                        className="bg-gradient-to-br from-[#DD1C1A] to-[#a01513] rounded-xl p-8 hover:scale-105 transition-transform group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-[family-name:var(--font-urban-heading)]">
                                GESTIONAR USUARIOS
                            </h2>
                            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <p className="text-white/80 font-[family-name:var(--font-urban-body)]">
                            Ver, buscar y exportar usuarios registrados
                        </p>
                    </Link>

                    {/* Orders Management (Disabled) */}
                    <div className="bg-[#111] border border-[#333] rounded-xl p-8 opacity-50 cursor-not-allowed">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-[family-name:var(--font-urban-heading)]">
                                GESTIONAR PEDIDOS
                            </h2>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-[family-name:var(--font-urban-body)]">
                            Próximamente - Por ahora usa WhatsApp
                        </p>
                    </div>

                </div>

                {/* Back to Site */}
                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="text-gray-400 hover:text-white transition-colors font-[family-name:var(--font-urban-body)] inline-flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al sitio
                    </Link>
                </div>

            </div>
        </div>
    )
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    created_at: string;
    user_metadata: {
        full_name?: string;
        phone?: string;
    };
    app_metadata: {
        provider?: string;
    };
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Filter users based on search term
        if (searchTerm) {
            const filtered = users.filter(user =>
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.user_metadata?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.user_metadata?.phone?.includes(searchTerm)
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        setLoading(true);
        // Note: This requires admin privileges - we'll need to create an API route
        // For now, we'll use a workaround
        try {
            const { data, error } = await supabase.auth.admin.listUsers();
            if (error) throw error;
            setUsers(data.users as User[]);
            setFilteredUsers(data.users as User[]);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback: show current user only
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUsers([user as User]);
                setFilteredUsers([user as User]);
            }
        }
        setLoading(false);
    };

    const exportToCSV = () => {
        const headers = ['Nombre', 'Email', 'Teléfono', 'Fecha de Registro', 'Método'];
        const rows = filteredUsers.map(user => [
            user.user_metadata?.full_name || '-',
            user.email || '-',
            user.user_metadata?.phone || '-',
            new Date(user.created_at).toLocaleDateString('es-ES'),
            user.app_metadata?.provider === 'google' ? 'Google' : 'Email'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `usuarios_sintenedor_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            href="/admin"
                            className="text-gray-400 hover:text-white transition-colors font-[family-name:var(--font-urban-body)] inline-flex items-center gap-2 mb-4"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al panel
                        </Link>
                        <h1 className="text-4xl font-[family-name:var(--font-urban-heading)]">
                            GESTIÓN DE USUARIOS
                        </h1>
                        <p className="text-gray-400 mt-2">
                            {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} registrado{filteredUsers.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <button
                        onClick={exportToCSV}
                        disabled={filteredUsers.length === 0}
                        className="bg-[#F0C808] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#d4b007] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exportar CSV
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DD1C1A] transition-colors"
                    />
                </div>

                {/* Users Table */}
                {loading ? (
                    <div className="text-center py-12 text-gray-400">
                        Cargando usuarios...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
                    </div>
                ) : (
                    <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#0a0a0a] border-b border-[#333]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Teléfono
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Fecha de Registro
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Método
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#333]">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#0a0a0a] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">
                                                    {user.user_metadata?.full_name || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-300">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-300">
                                                    {user.user_metadata?.phone || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-300">
                                                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.app_metadata?.provider === 'google'
                                                        ? 'bg-blue-900 text-blue-200'
                                                        : 'bg-gray-800 text-gray-300'
                                                    }`}>
                                                    {user.app_metadata?.provider === 'google' ? 'Google' : 'Email'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

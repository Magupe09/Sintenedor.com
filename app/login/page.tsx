'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { signInWithEmail, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await signInWithEmail(email, password);

        if (error) {
            alert("Error de acceso: " + error.message);
        } else {
            // Router push is handled in Context but safe to do here too or just wait
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decorations (Urban Style) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#DD1C1A]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F0C808]/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Container */}
            <div className="w-full max-w-md z-10 relative">

                {/* Header */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block text-4xl font-[family-name:var(--font-urban-heading)] text-white hover:text-[#DD1C1A] transition-colors mb-2">
                        SINTENEDOR
                    </Link>
                    <h2 className="text-2xl font-[family-name:var(--font-urban-body)] text-gray-400 font-light">
                        Bienvenido al Club
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Email Input */}
                    <div className="group">
                        <label className="block text-[#F0C808] text-xs uppercase tracking-widest mb-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            placeholder="TU CORREO"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-[#333] py-4 text-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#DD1C1A] transition-colors font-[family-name:var(--font-urban-body)]"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="group">
                        <label className="block text-[#F0C808] text-xs uppercase tracking-widest mb-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="CONTRASEÑA"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-[#333] py-4 text-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#DD1C1A] transition-colors font-[family-name:var(--font-urban-body)]"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-6 w-full bg-[#FAFFFD] text-black font-[family-name:var(--font-urban-heading)] text-2xl py-4 rounded-full hover:bg-[#DD1C1A] hover:text-white hover:scale-105 transition-all duration-300 uppercase tracking-wide"
                    >
                        Ingresar
                    </button>

                </form>

                {/* Footer / Links */}
                <div className="mt-10 text-center flex flex-col gap-4">
                    <Link href="/registro" className="text-gray-500 hover:text-white transition-colors text-sm font-[family-name:var(--font-urban-body)]">
                        ¿No tienes cuenta? <span className="text-[#F0C808] underline decoration-[#F0C808]">Regístrate gratis</span>
                    </Link>
                    <Link href="#" className="text-gray-600 hover:text-gray-400 transition-colors text-xs">
                        Olvidé mi contraseña
                    </Link>
                </div>

            </div>
        </div>
    );
}

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

                    {/* Google Button */}
                    <button
                        type="button"
                        onClick={async () => {
                            setLoading(true);
                            await signInWithGoogle();
                        }}
                        className="w-full bg-white text-black font-bold py-4 rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continuar con Google
                    </button>

                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <div className="h-px bg-gray-800 flex-1" />
                        O con correo
                        <div className="h-px bg-gray-800 flex-1" />
                    </div>

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

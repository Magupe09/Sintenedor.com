'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { signUpWithEmail, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await signUpWithEmail(formData.email, formData.password, {
            full_name: formData.name,
            phone: formData.phone // Important for WhatsApp marketing
        });

        if (error) {
            alert("Error al registrar: " + error.message);
        } else {
            alert("¡Bienvenido al Club! Por favor verifica tu correo.");
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">

            {/* Background Decorations */}
            <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-urban-red/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Container */}
            <div className="w-full max-w-md z-10 relative">

                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block text-4xl font-[family-name:var(--font-urban-heading)] text-foreground hover:text-urban-red transition-colors mb-2">
                        SINTENEDOR
                    </Link>
                    <h2 className="text-2xl font-[family-name:var(--font-urban-body)] text-foreground font-bold uppercase tracking-tight">
                        Crea tu Cuenta
                    </h2>
                    <p className="text-foreground/40 text-sm mt-1 uppercase tracking-widest font-bold">
                        Y empieza a acumular puntos.
                    </p>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-6">
                    {/* Google Button */}
                    <button
                        type="button"
                        disabled={loading}
                        onClick={async () => {
                            setLoading(true);
                            const { error } = await signInWithGoogle();
                            if (error) {
                                alert("Error al registrar con Google: " + error.message);
                                setLoading(false);
                            }
                            // Si no hay error, Supabase maneja la redirección
                        }}
                        className="w-full bg-foreground text-background font-bold py-4 rounded-full flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="animate-pulse">Conectando...</span>
                        ) : (
                            <>
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
                                Registrarse con Google
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-4 text-foreground/20 text-sm">
                        <div className="h-px bg-foreground/10 flex-1" />
                        O con correo
                        <div className="h-px bg-foreground/10 flex-1" />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Name */}
                        <div className="group">
                            <label className="block text-urban-yellow text-[10px] uppercase tracking-widest mb-1 font-bold opacity-60">Tu Nombre</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="..."
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-foreground/5 border-l-4 border-foreground/10 focus:border-urban-yellow px-4 py-4 text-foreground placeholder-foreground/20 focus:outline-none transition-colors font-[family-name:var(--font-urban-body)] rounded-r-lg"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className="group">
                            <label className="block text-urban-yellow text-[10px] uppercase tracking-widest mb-1 font-bold opacity-60">WhatsApp / Celular</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="..."
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-foreground/5 border-l-4 border-foreground/10 focus:border-urban-yellow px-4 py-4 text-foreground placeholder-foreground/20 focus:outline-none transition-colors font-[family-name:var(--font-urban-body)] rounded-r-lg"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="block text-urban-yellow text-[10px] uppercase tracking-widest mb-1 font-bold opacity-60">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="..."
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-foreground/5 border-l-4 border-foreground/10 focus:border-urban-yellow px-4 py-4 text-foreground placeholder-foreground/20 focus:outline-none transition-colors font-[family-name:var(--font-urban-body)] rounded-r-lg"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label className="block text-urban-yellow text-[10px] uppercase tracking-widest mb-1 font-bold opacity-60">Crea tu Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="..."
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-foreground/5 border-l-4 border-foreground/10 focus:border-urban-yellow px-4 py-4 text-foreground placeholder-foreground/20 focus:outline-none transition-colors font-[family-name:var(--font-urban-body)] rounded-r-lg"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full bg-urban-red text-white font-[family-name:var(--font-urban-heading)] text-2xl py-4 rounded-lg shadow-[4px_4px_0px_var(--foreground)] hover:translate-y-1 hover:shadow-none hover:bg-urban-yellow hover:text-black transition-all duration-200 uppercase tracking-wide disabled:opacity-50"
                        >
                            {loading ? 'Registrando...' : 'Registrarse Ahora'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <Link href="/login" className="text-foreground/40 hover:text-foreground transition-colors text-sm font-[family-name:var(--font-urban-body)]">
                        ¿Ya tienes cuenta? <span className="text-foreground font-bold underline underline-offset-4">Inicia Sesión</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}

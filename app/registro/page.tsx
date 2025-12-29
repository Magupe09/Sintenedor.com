'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { signUpWithEmail } = useAuth();
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
        console.log("Registering...", formData);

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
        <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-[#DD1C1A]/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Container */}
            <div className="w-full max-w-md z-10 relative">

                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block text-4xl font-[family-name:var(--font-urban-heading)] text-white hover:text-[#DD1C1A] transition-colors mb-2">
                        SINTENEDOR
                    </Link>
                    <h2 className="text-2xl font-[family-name:var(--font-urban-body)] text-white font-bold">
                        CREA TU CUENTA
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Y empieza a acumular puntos.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="TU NOMBRE"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[#111] border-l-4 border-[#333] focus:border-[#F0C808] px-4 py-4 text-white placeholder-gray-600 focus:outline-none transition-colors font-[family-name:var(--font-urban-body)] rounded-r-lg"
                        required
                    />

                    {/* Phone (Important for WhatsApp Marketing) */}
                    <input
                        type="tel"
                        name="phone"
                        placeholder="WHATSAPP / TELÉFONO"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-[#111] border-l-4 border-[#333] focus:border-[#F0C808] px-4 py-4 text-white placeholder-gray-600 focus:outline-none transition-colors font-[family-name:var(--font-urban-body)] rounded-r-lg"
                        required
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="CORREO ELECTRÓNICO"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#111] border-l-4 border-[#333] focus:border-[#F0C808] px-4 py-4 text-white placeholder-gray-600 focus:outline-none transition-colors font-[family-name:var(--font-urban-body)] rounded-r-lg"
                        required
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="CREA UNA CONTRASEÑA"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-[#111] border-l-4 border-[#333] focus:border-[#F0C808] px-4 py-4 text-white placeholder-gray-600 focus:outline-none transition-colors font-[family-name:var(--font-urban-body)] rounded-r-lg"
                        required
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-4 w-full bg-[#DD1C1A] text-white font-[family-name:var(--font-urban-heading)] text-2xl py-4 rounded-lg shadow-[4px_4px_0px_#fff] hover:translate-y-1 hover:shadow-none hover:bg-red-700 transition-all duration-200 uppercase tracking-wide"
                    >
                        Registrarse Ahora
                    </button>

                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <Link href="/login" className="text-gray-500 hover:text-white transition-colors text-sm font-[family-name:var(--font-urban-body)]">
                        ¿Ya tienes cuenta? <span className="text-[#FAFFFD] font-bold underline">Inicia Sesión</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}

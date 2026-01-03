'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NosotrosPage() {
    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 pt-24 md:p-12 lg:p-24 overflow-hidden relative">
            {/* Fondo con Textura/Branding */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <img
                    src="/assets/logo.png"
                    alt=""
                    className="w-full h-full object-cover grayscale brightness-200"
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24"
                >
                    <h1 className="text-7xl md:text-9xl font-[family-name:var(--font-urban-heading)] uppercase tracking-tighter leading-none mb-6">
                        <span className="text-urban-yellow block md:inline">Sintenedor</span>
                    </h1>
                    <div className="h-2 w-24 bg-urban-red rounded-full mb-8"></div>
                    <p className="text-lg md:text-2xl font-light max-w-2xl text-gray-400 leading-relaxed uppercase tracking-tight">
                        No somos un restaurante. Somos una <span className="text-white font-bold italic">Dark Kitchen</span> urbana diseñada para los que no tienen tiempo que perder y tienen un paladar que no perdona.
                    </p>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                    {/* Left Column: Info & Map */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-12"
                    >
                        <section>
                            <h2 className="text-xs uppercase tracking-[0.4em] text-urban-yellow font-bold mb-6">La Historia</h2>
                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                Sintenedor nació en las calles, bajo el concepto de que la mejor comida no necesita una mesa elegante, solo ingredientes reales y una llama potente. Nos especializamos en comida que puedes disfrutar donde sea, con la calidad de un banquete de lujo.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xs uppercase tracking-[0.4em] text-urban-yellow font-bold mb-6">Encuéntranos</h2>
                            <div className="relative rounded-[40px] overflow-hidden border border-white/10 aspect-video group">
                                <div className="absolute inset-0 bg-urban-red/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.421456382062!2d-74.06364!3d4.67!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a7a!2sBogota%20Urban%20Center!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                            <p className="mt-4 text-xs opacity-50 uppercase tracking-widest font-mono">CALLE 85 #11-54, BOGOTÁ • DARK KITCHEN BASE</p>
                        </section>

                        <section>
                            <h2 className="text-xs uppercase tracking-[0.4em] text-urban-yellow font-bold mb-8 text-center md:text-left">Canales Oficiales</h2>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                {[
                                    { name: 'Instagram', color: 'hover:bg-pink-600', url: '#' },
                                    { name: 'TikTok', color: 'hover:bg-black hover:border-white', url: '#' },
                                    { name: 'YouTube', color: 'hover:bg-red-600', url: '#' },
                                    { name: 'Facebook', color: 'hover:bg-blue-600', url: '#' }
                                ].map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.url}
                                        className={`px-6 py-3 border border-white/10 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all duration-300 ${social.color}`}
                                    >
                                        {social.name}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[50px] backdrop-blur-3xl"
                    >
                        <h2 className="text-4xl font-[family-name:var(--font-urban-heading)] uppercase mb-8">Contacto <span className="text-urban-red">Directo</span></h2>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-50 ml-2">Tu Nombre / Nick</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-3xl p-5 text-sm focus:outline-none focus:border-urban-yellow transition-all"
                                    placeholder="Juan Pizza"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-50 ml-2">Correo Electronico</label>
                                <input
                                    type="email"
                                    className="w-full bg-black/50 border border-white/10 rounded-3xl p-5 text-sm focus:outline-none focus:border-urban-yellow transition-all"
                                    placeholder="juan@banquete.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-50 ml-2">¿En qué podemos ayudarte?</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-black/50 border border-white/10 rounded-3xl p-5 text-sm focus:outline-none focus:border-urban-yellow transition-all resize-none"
                                    placeholder="Quiero organizar un evento con Sintenedor..."
                                ></textarea>
                            </div>

                            <button className="w-full bg-urban-yellow text-black font-bold py-5 rounded-3xl uppercase tracking-widest hover:bg-white transition-all text-sm shadow-[0_20px_40px_rgba(240,200,8,0.2)]">
                                Enviar Mensaje
                            </button>

                            <div className="pt-8 border-t border-white/5">
                                <Link
                                    href="https://wa.me/573015347481"
                                    className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest text-[#25D366] hover:scale-105 transition-transform"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.41 0 .01 5.403.007 12.04a11.72 11.72 0 001.591 5.919L0 24l6.149-1.613a11.77 11.77 0 005.891 1.569h.005c6.64 0 12.039-5.403 12.042-12.042a11.761 11.761 0 00-3.483-8.511z" />
                                    </svg>
                                    Asistencia por WhatsApp
                                </Link>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Redes Sociales Flotantes Derecha (Marketing) */}
            <div className="fixed top-1/2 right-4 -translate-y-1/2 flex flex-col gap-6 opacity-30 hover:opacity-100 transition-opacity hidden xl:flex">
                <span className="[writing-mode:vertical-lr] text-[8px] uppercase tracking-[1em] font-bold text-gray-500 mb-4">Siguenos</span>
                <div className="w-[1px] h-12 bg-white/20 mx-auto"></div>
                {/* Aquí irían iconos reales, por ahora texto */}
                <span className="text-[10px] font-bold cursor-pointer hover:text-urban-yellow">IG</span>
                <span className="text-[10px] font-bold cursor-pointer hover:text-urban-yellow">TK</span>
                <span className="text-[10px] font-bold cursor-pointer hover:text-urban-yellow">YT</span>
            </div>
        </div>
    );
}

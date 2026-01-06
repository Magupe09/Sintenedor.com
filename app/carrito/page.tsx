'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function CartPage() {
    const { cart, removeFromCart, total, clearCart } = useCart();

    // Estados locales para el formulario y validaciones
    const [clientName, setClientName] = React.useState('');
    const [clientPhone, setClientPhone] = React.useState('');
    const [acceptsMarketing, setAcceptsMarketing] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [orderCompleted, setOrderCompleted] = React.useState<{ trackingCode?: string; orderId: string } | null>(null);
    const [errors, setErrors] = React.useState({ name: '', phone: '' });

    // Validaciones
    const validateName = (name: string) => {
        if (name.length > 0 && name.length < 3) return "El nombre debe tener al menos 3 letras";
        if (name.length > 0 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) return "El nombre solo debe contener letras";
        return "";
    };

    const validatePhone = (phone: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        if (phone.length > 0 && cleanPhone.length !== 10) return "El teléfono debe tener 10 dígitos";
        if (phone.length > 0 && !/^3\d{9}$/.test(cleanPhone)) return "Debe ser un número celular válido (empieza por 3)";
        return "";
    };

    // Formateador de moneda
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const { user } = useAuth();
    const supabase = createClient();

    // Pre-llenar campos con datos del usuario autenticado
    React.useEffect(() => {
        if (user?.user_metadata) {
            const metadata = user.user_metadata;
            console.log('📋 Metadatos del usuario autenticado:', metadata);

            // Los metadatos pueden venir de diferentes proveedores
            const fullName = metadata.full_name || metadata.name || metadata.display_name;
            const phone = metadata.phone || metadata.phone_number;

            if (fullName && !clientName) {
                setClientName(fullName);
                console.log('✅ Pre-llenando nombre:', fullName);
            }
            if (phone && !clientPhone) {
                setClientPhone(phone);
                console.log('✅ Pre-llenando teléfono:', phone);
            }
        }
    }, [user]);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación final antes de enviar
        const nameErr = validateName(clientName);
        const phoneErr = validatePhone(clientPhone);

        if (nameErr || phoneErr) {
            setErrors({ name: nameErr, phone: phoneErr });
            return;
        }

        setIsSubmitting(true);

        try {
            let anonymousUserId = null;
            let trackingCode = null;

            console.log('🚀 Iniciando proceso de checkout...');

            // 1. Si no hay usuario autenticado, crear registro de usuario anónimo
            if (!user) {
                console.log('👤 Usuario no autenticado, creando registro anónimo...');

                // Generar código de seguimiento único
                let attempts = 0;
                const maxAttempts = 10;

                do {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    trackingCode = '';
                    for (let i = 0; i < 6; i++) {
                        trackingCode += chars.charAt(Math.floor(Math.random() * chars.length));
                    }

                    console.log(`🔍 Verificando código único: ${trackingCode}`);

                    // Verificar si ya existe
                    const { data: existing, error: checkError } = await supabase
                        .from('usuarios_anonimos')
                        .select('codigo_seguimiento')
                        .eq('codigo_seguimiento', trackingCode)
                        .single();

                    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
                        console.error('❌ Error verificando código único:', checkError);
                        throw checkError;
                    }

                    if (!existing) {
                        console.log('✅ Código único encontrado:', trackingCode);
                        break; // Código único encontrado
                    }
                    attempts++;
                } while (attempts < maxAttempts);

                if (attempts >= maxAttempts) {
                    throw new Error('No se pudo generar un código único. Inténtalo de nuevo.');
                }

                console.log('📝 Creando usuario anónimo...');
                const { data: anonUserData, error: anonUserError } = await supabase
                    .from('usuarios_anonimos')
                    .insert({
                        nombre: clientName,
                        telefono: clientPhone.replace(/\D/g, ''),
                        codigo_seguimiento: trackingCode,
                        acepta_marketing: acceptsMarketing
                    })
                    .select()
                    .single();

                if (anonUserError) {
                    console.error('❌ Error creando usuario anónimo:', anonUserError);
                    throw anonUserError;
                }

                anonymousUserId = anonUserData.id;
                console.log('✅ Usuario anónimo creado:', anonymousUserId);
            }

            // 2. Guardar el pedido en la Base de Datos
            console.log('🍕 Creando pedido con datos:', {
                user_id: user?.id || null,
                usuario_anonimo_id: anonymousUserId,
                codigo_seguimiento: trackingCode,
                total: total,
                nombre_cliente: clientName,
                telefono_cliente: clientPhone.replace(/\D/g, ''),
                estado: 'pendiente'
            });

            const { data: orderData, error: orderError } = await supabase
                .from('pedidos')
                .insert({
                    user_id: user?.id || null,
                    usuario_anonimo_id: anonymousUserId,
                    codigo_seguimiento: trackingCode,
                    total: total,
                    nombre_cliente: clientName,
                    telefono_cliente: clientPhone.replace(/\D/g, ''), // Guardamos solo números
                    estado: 'pendiente'
                })
                .select()
                .single();

            if (orderError) {
                console.error('❌ Error creando pedido:', orderError);
                throw orderError;
            }

            console.log('✅ Pedido creado exitosamente:', {
                id: orderData.id,
                codigo_seguimiento: orderData.codigo_seguimiento,
                usuario_anonimo_id: orderData.usuario_anonimo_id
            });

            // 3. Guardar los items del pedido
            console.log('📦 Guardando items del pedido...');
            const orderItems = cart.map(item => ({
                pedido_id: orderData.id,
                producto_id: item.product.id,
                nombre_producto: item.product.name,
                cantidad: item.quantity,
                precio_unitario: item.product.price
            }));

            console.log('Items a insertar:', orderItems);

            const { error: itemsError } = await supabase
                .from('items_pedido')
                .insert(orderItems);

            if (itemsError) {
                console.error('❌ Error guardando items:', itemsError);
                throw itemsError;
            }

            console.log('✅ Items guardados correctamente');

            // 3. Construimos el mensaje de texto para WhatsApp
            let message = `Hola *Sintenedor*, quiero hacer un pedido`;

            // Agregar ID o código de seguimiento según el tipo de usuario
            if (trackingCode) {
                message += ` (Código: ${trackingCode})`;
            } else {
                message += ` (ID: ${orderData.id.slice(0, 8)})`;
            }

            message += `:\n\n`;

            cart.forEach(item => {
                message += `🍕 ${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}\n`;
            });

            message += `\n💰 *Total: ${formatPrice(total)}*\n`;
            message += `------------------\n`;
            message += `👤 *Cliente:* ${clientName}\n`;
            message += `📱 *Teléfono:* ${clientPhone}`;

            // Agregar información de tracking para usuarios anónimos
            if (trackingCode) {
                message += `\n\n🔗 *Sigue tu pedido aquí:* ${window.location.origin}/track?code=${trackingCode}`;
            }

            // Mostrar confirmación del pedido
            setOrderCompleted({
                trackingCode: trackingCode || undefined,
                orderId: orderData.id
            });

            // Abrir WhatsApp después de un breve delay para que el usuario vea la confirmación
            setTimeout(() => {
                const encodedMessage = encodeURIComponent(message);
                const phoneNumber = "573015347481";
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
            }, 2000);

            clearCart();

        } catch (error: any) {
            console.error("❌ Error completo al procesar el pedido:", {
                error,
                message: error?.message,
                code: error?.code,
                details: error?.details,
                hint: error?.hint,
                stack: error?.stack
            });

            let errorMsg = "Error desconocido";
            if (error?.message) {
                errorMsg = error.message;
            } else if (error?.code) {
                errorMsg = `Código de error: ${error.code}`;
            }

            alert(`Uups, el motor de pedidos falló: ${errorMsg}. Revisa la consola para más detalles.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Pantalla de confirmación del pedido
    if (orderCompleted) {
        return (
            <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-8 text-foreground">
                <div className="text-center max-w-lg">
                    <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-urban-heading)] uppercase tracking-tight mb-6 text-urban-yellow">
                        ¡Pedido Enviado! 🎉
                    </h1>

                    <p className="text-xl opacity-90 mb-8 leading-relaxed">
                        Tu pedido ha sido registrado correctamente. En breve recibirás confirmación por WhatsApp con todos los detalles.
                    </p>

                    {/* Código de seguimiento para usuarios anónimos */}
                    {orderCompleted.trackingCode && (
                        <div className="bg-gradient-to-r from-urban-yellow/20 to-urban-red/20 border border-urban-yellow/30 rounded-2xl p-6 mb-8 shadow-[0_0_30px_rgba(240,200,8,0.2)]">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-8 h-8 bg-urban-yellow rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest mb-3 text-urban-yellow">
                                Tu Código de Seguimiento
                            </p>
                            <p className="text-4xl font-mono font-black text-urban-yellow mb-4 tracking-wider">
                                {orderCompleted.trackingCode}
                            </p>
                            <p className="text-sm opacity-80 leading-relaxed">
                                🔗 <strong>Importante:</strong> Guarda este código único para rastrear tu pedido en tiempo real desde cualquier dispositivo.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {orderCompleted.trackingCode && (
                            <Link
                                href={`/track?code=${orderCompleted.trackingCode}`}
                                className="block w-full bg-gradient-to-r from-urban-yellow to-urban-red text-black py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(240,200,8,0.4)] text-lg"
                            >
                                📍 Rastrear Mi Pedido Ahora
                            </Link>
                        )}

                        <div className="flex gap-3">
                            <Link
                                href="/track"
                                className="flex-1 bg-foreground/10 text-foreground py-3 rounded-full font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all border border-foreground/20"
                            >
                                🔍 Buscar Otro Pedido
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 bg-urban-red text-white py-3 rounded-full font-bold uppercase tracking-widest hover:bg-urban-yellow hover:text-black transition-all"
                            >
                                🍕 Volver al Menú
                            </Link>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-8 p-4 bg-foreground/5 rounded-xl border border-foreground/10">
                        <p className="text-sm opacity-70 leading-relaxed">
                            💡 <strong>¿Necesitas ayuda?</strong> Si tienes alguna duda sobre tu pedido, escríbenos por WhatsApp.
                            También puedes acceder a "Rastrear Pedido" desde el menú principal en cualquier momento.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-4 text-foreground">
                <h1 className="text-2xl font-bold font-[family-name:var(--font-urban-heading)] uppercase tracking-tight">Tu carrito está vacío 😢</h1>
                <Link href="/" className="text-urban-red hover:text-urban-yellow transition-colors font-bold uppercase tracking-widest text-sm underline underline-offset-4">
                    ← Volver al menú
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 pt-24 max-w-4xl mx-auto text-foreground">
            <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-urban-heading)] mb-8 uppercase tracking-tighter">Tu Pedido</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Lista de Items */}
                <div className="md:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 border border-foreground/10 p-4 rounded-xl shadow-sm bg-foreground/5 items-center backdrop-blur-sm">
                            <div className="flex-1">
                                <h3 className="font-bold uppercase tracking-tight">{item.product.name}</h3>
                                <p className="text-xs opacity-60">
                                    Precio: {formatPrice(item.product.price)} x {item.quantity}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-urban-yellow font-[family-name:var(--font-urban-heading)]">
                                    {formatPrice(item.product.price * item.quantity)}
                                </p>
                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="text-urban-red text-[10px] uppercase font-bold tracking-widest hover:underline mt-1"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen y Formulario */}
                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl h-fit space-y-4 backdrop-blur-sm">
                    <h2 className="text-2xl font-[family-name:var(--font-urban-heading)] border-b border-foreground/10 pb-2 uppercase tracking-tight">Resumen</h2>
                    <div className="flex justify-between items-center">
                        <span className="text-sm uppercase tracking-widest opacity-60">Total:</span>
                        <span className="font-[family-name:var(--font-urban-heading)] text-3xl text-urban-yellow">{formatPrice(total)}</span>
                    </div>

                    <form onSubmit={handleCheckout} className="space-y-4 mt-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2 font-bold">Nombre</label>
                            <input
                                type="text"
                                required
                                className={`w-full bg-background border rounded-xl p-3 text-sm text-foreground focus:outline-none transition-colors ${errors.name ? 'border-urban-red' : 'border-foreground/10 focus:border-urban-red'}`}
                                value={clientName}
                                onChange={(e) => {
                                    setClientName(e.target.value);
                                    setErrors(prev => ({ ...prev, name: validateName(e.target.value) }));
                                }}
                                placeholder="Pide a nombre de..."
                            />
                            {errors.name && <p className="text-[10px] text-urban-red mt-1 font-bold uppercase tracking-widest">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2 font-bold">Teléfono</label>
                            <input
                                type="tel"
                                required
                                className={`w-full bg-background border rounded-xl p-3 text-sm text-foreground focus:outline-none transition-colors ${errors.phone ? 'border-urban-red' : 'border-foreground/10 focus:border-urban-red'}`}
                                value={clientPhone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setClientPhone(val);
                                    setErrors(prev => ({ ...prev, phone: validatePhone(val) }));
                                }}
                                placeholder="Tu celular (10 dígitos)"
                            />
                            {errors.phone && <p className="text-[10px] text-urban-red mt-1 font-bold uppercase tracking-widest">{errors.phone}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="marketing"
                                checked={acceptsMarketing}
                                onChange={(e) => setAcceptsMarketing(e.target.checked)}
                                className="w-3 h-3 text-urban-yellow bg-background border-foreground/10 rounded focus:ring-urban-yellow focus:ring-1"
                            />
                            <label htmlFor="marketing" className="text-[9px] uppercase tracking-widest opacity-60 font-bold">
                                Acepto recibir ofertas y promociones por email/WhatsApp
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !!errors.name || !!errors.phone || !clientName || !clientPhone}
                            className="w-full bg-foreground text-background py-4 rounded-full font-bold uppercase tracking-widest hover:bg-urban-yellow hover:text-black transition-all disabled:bg-gray-400/20 disabled:text-gray-500 mt-2"
                        >
                            {isSubmitting ? 'Enviando...' : 'Confirmar Pedido'}
                        </button>
                    </form>

                    <Link href="/" className="block text-center text-[10px] uppercase font-bold tracking-widest opacity-50 hover:opacity-100 hover:text-urban-red transition-all underline underline-offset-4">
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function CartPage() {
    const { cart, removeFromCart, total, clearCart } = useCart();

    // Estados locales para el formulario
    const [clientName, setClientName] = React.useState('');
    const [clientPhone, setClientPhone] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

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

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Guardar en la Base de Datos (Supabase)
            const { data: orderData, error: orderError } = await supabase
                .from('pedidos')
                .insert({
                    user_id: user?.id || null,
                    total: total,
                    nombre_cliente: clientName,
                    telefono_cliente: clientPhone,
                    estado: 'pendiente'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Guardar los items del pedido
            const orderItems = cart.map(item => ({
                pedido_id: orderData.id,
                producto_id: item.product.id,
                nombre_producto: item.product.name,
                cantidad: item.quantity,
                precio_unitario: item.product.price
            }));

            const { error: itemsError } = await supabase
                .from('items_pedido')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Construimos el mensaje de texto para WhatsApp
            let message = `Hola *Sintenedor*, quiero hacer un pedido (ID: ${orderData.id.slice(0, 8)}):\n\n`;

            cart.forEach(item => {
                message += `🍕 ${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}\n`;
            });

            message += `\n💰 *Total: ${formatPrice(total)}*\n`;
            message += `------------------\n`;
            message += `👤 *Cliente:* ${clientName}\n`;
            message += `📱 *Teléfono:* ${clientPhone}`;

            const encodedMessage = encodeURIComponent(message);
            const phoneNumber = "573015347481";
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');

            clearCart();
            alert("Pedido enviado correctamente. ¡Pronto estará listo!");

        } catch (error: any) {
            console.error("Error al procesar el pedido:", error);
            const errorMsg = error.message || "Error desconocido";
            alert(`Uups, el motor de pedidos falló: ${errorMsg}. Inténtalo de nuevo o llámanos.`);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                className="w-full bg-background border border-foreground/10 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-urban-red transition-colors"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Pide a nombre de..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2 font-bold">Teléfono</label>
                            <input
                                type="tel"
                                required
                                className="w-full bg-background border border-foreground/10 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-urban-red transition-colors"
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                placeholder="Tu celular de contacto"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-foreground text-background py-4 rounded-full font-bold uppercase tracking-widest hover:bg-urban-yellow hover:text-black transition-all disabled:bg-gray-400 mt-2"
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

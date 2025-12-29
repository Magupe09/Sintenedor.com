'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
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

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderData = {
            cliente: {
                nombre: clientName,
                telefono: clientPhone,
            },
            items: cart.map(item => ({
                id: item.product.id,
                nombre: item.product.name,
                precio: item.product.price,
                cantidad: item.quantity
            })),
            total: total
        };

        try {
            const response = await fetch('/pedidos/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                alert('¡Pedido enviado con éxito!');
                clearCart();

            } else {
                alert('Hubo un error al enviar el pedido');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Tu carrito está vacío 😢</h1>
                <Link href="/" className="text-blue-600 hover:underline">
                    ← Volver al menú
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Lista de Items */}
                <div className="md:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 border p-4 rounded-lg shadow-sm bg-white items-center">
                            <div className="flex-1">
                                <h3 className="font-bold">{item.product.name}</h3>
                                <p className="text-sm text-gray-500">
                                    Precio: {formatPrice(item.product.price)} x {item.quantity}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">
                                    {formatPrice(item.product.price * item.quantity)}
                                </p>
                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="text-red-500 text-sm hover:underline mt-1"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen y Formulario */}
                <div className="bg-gray-50 p-6 rounded-lg h-fit space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Resumen</h2>
                    <div className="flex justify-between text-lg">
                        <span>Total:</span>
                        <span className="font-bold text-green-700">{formatPrice(total)}</span>
                    </div>

                    <form onSubmit={handleCheckout} className="space-y-3 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                required
                                className="w-full border rounded-md p-2 text-sm"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input
                                type="tel"
                                required
                                className="w-full border rounded-md p-2 text-sm"
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                placeholder="Tu celular"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Enviando...' : 'Confirmar Pedido'}
                        </button>
                    </form>

                    <Link href="/" className="block text-center text-sm text-blue-600 hover:underline">
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </div>
    );
}

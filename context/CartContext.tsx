'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/data';

// 1. Definimos la forma de un item en el carrito
interface CartItem {
    product: Product;
    quantity: number;
}

// 2. Definimos qué datos y funciones tendrá nuestro contexto
interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    total: number;
}

// 3. Creamos el contexto con un valor inicial indefinido
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Creamos el Proveedor (Provider) que envolverá nuestra app
export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Cargar carrito del localStorage al iniciar
    useEffect(() => {
        const storedCart = localStorage.getItem('sintenedor_cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // Guardar en localStorage cada vez que cambie el carrito
    useEffect(() => {
        localStorage.setItem('sintenedor_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === product.id);
            if (existingItem) {
                // Si ya existe, aumentamos cantidad
                return prevCart.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Si no existe, lo agregamos con cantidad 1
            return [...prevCart, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === productId);
            // Si no existe (raro), no hacemos nada
            if (!existingItem) return prevCart;

            // Si hay más de 1, restamos cantidad
            if (existingItem.quantity > 1) {
                return prevCart.map((item) =>
                    item.product.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }

            // Si solo queda 1, lo eliminamos del todo
            return prevCart.filter((item) => item.product.id !== productId);
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    // Calcular el total
    const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

// 5. Hook personalizado para usar el carrito fácilmente
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
}

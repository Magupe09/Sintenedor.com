// ----------------------------------------------------------------------
// 🎓 ZONA DE APRENDIZAJE: INTERFACES
// ----------------------------------------------------------------------
// En TypeScript, una "Interface" es un contrato.
// Le dice al código: "Para que algo sea considerado un Producto,
// OBLIGATORIAMENTE debe tener un id, un nombre, un precio, etc."
//
// Esto evita errores. Si intentas crear un producto sin precio,
// el editor te gritará en rojo antes de que guardes el archivo.
// ----------------------------------------------------------------------

// 1. Definimos la FORMA que tiene un Producto
export interface Product {
  id: string;        // Identificador único (ej: "p1")
  name: string;      // Nombre visible (ej: "Pizza Margarita")
  description: string; // Descripción corta
  price: number;     // Precio numérico (para poder sumar luego)
  image?: string;    // Foto de fondo para el tarjetón del menú
  modalImage?: string; // Foto PNG sin fondo para el modal (Efecto flotante)
  category: 'pizzas' | 'hamburguesas' | 'bebidas';
  ingredients?: string[];
}

// 2. Definimos la FORMA que tiene un Item en el Carrito
// Un item del carrito es el Producto + la cantidad que quiere el cliente
export interface CartItem extends Product {
  quantity: number;
}

// ----------------------------------------------------------------------
// 📦 DATOS DE PRUEBA (MOCK DATA)
// ----------------------------------------------------------------------
// Como no tenemos base de datos aún, usamos esta lista fija.
// En el futuro, estos datos vendrán de Supabase o n8n.
// ----------------------------------------------------------------------

export const MENU_ITEMS: Product[] = [
  // PIZZAS
  {
    id: "p1",
    name: "Pizza Margarita",
    description: "La clásica. Salsa de tomate, mozzarella fior di latte y albahaca fresca.",
    price: 12000,
    category: "pizzas",
    image: "/assets/pizza_margarita.png",
    modalImage: "/assets/pizza_margarita.png",
    ingredients: ["Mozzarella", "Tomate", "Albahaca", "Aceite de Oliva"]
  },
  {
    id: "p2",
    name: "Pizza Pepperoni",
    description: "Doble pepperoni americano y extra queso mozzarella.",
    price: 14000,
    category: "pizzas",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80",
    modalImage: "/assets/sinfondopepe.png",
    ingredients: ["Pepperoni", "Mozzarella", "Salsa Secreta", "Orégano"]
  },

  // HAMBURGUESAS
  {
    id: "h1",
    name: "Classic Cheese",
    description: "150g de carne angus, queso cheddar, lechuga, tomate y salsa de la casa.",
    price: 16000,
    category: "hamburguesas",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
    modalImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
    ingredients: ["Carne Angus", "Cheddar", "Lechuga", "Tomate"]
  },

  // BEBIDAS
  {
    id: "b1",
    name: "Coca Cola",
    description: "Lata 350ml bien fría.",
    price: 3000,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80"
  }
];

import MenuItem from "@/components/MenuItem";
import { MENU_ITEMS } from "@/lib/data";

export default function MenuList() {
    return (
        // CONTENEDOR PRINCIPAL
        // sm+: H-screen + Overflow hidden (No scroll)
        // Mobile (<640px): Scroll normal
        <div className="w-full h-full sm:h-screen sm:overflow-hidden flex flex-col items-center bg-[#020202]">

            {/* HEADER */}
            <div className="shrink-0 py-6 text-center z-10 w-full max-w-7xl mx-auto px-4">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-[family-name:var(--font-urban-heading)] text-[#DD1C1A] uppercase tracking-tighter drop-shadow-sm leading-none">
                    Sintenedor
                </h1>
                <p className="text-sm sm:text-lg font-[family-name:var(--font-urban-body)] text-white max-w-2xl mx-auto">
                    Explora los sabores más callejeros.
                </p>
            </div>

            {/* GRID CONTAINER
                sm (Tablet 640px-1024px): 
                - flex-1 (ocupa el resto de la altura)
                - Centrado vertical y horizontalmente.
                - IMPORTANTE: max-w limitado. 
                  Como son 2 cols x 2 rows, el ratio total es aprox 3:4.
                  Si limitamos el ancho, la altura se reduce proporcionalmente para caber.
                  Usamos 'max-w-lg' o 'max-w-xl' para asegurar que entre en vertical.
                
                lg (Desktop 1024px+):
                - Permitimos más ancho (max-w-7xl) para las 4 columnas en fila.
            */}
            <div className="flex-1 w-full flex items-center justify-center min-h-0 px-4 pb-4">
                <div className="grid gap-4 w-full h-fit max-h-full
                                grid-cols-1 overflow-y-auto 
                                sm:grid-cols-2 sm:overflow-visible sm:max-w-md md:max-w-lg
                                lg:grid-cols-4 lg:max-w-7xl">
                    {MENU_ITEMS.map((item) => (
                        <MenuItem key={item.id} product={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

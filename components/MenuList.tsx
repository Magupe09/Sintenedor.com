import MenuItem from "@/components/MenuItem";
import { MENU_ITEMS } from "@/lib/data";

export default function MenuList() {
    return (
        // CONTENEDOR PRINCIPAL
        // sm+: H-screen + Overflow hidden (No scroll)
        // Mobile (<640px): Scroll normal
        <div className="w-full h-full sm:h-screen sm:overflow-hidden flex flex-col items-center bg-transparent">

            {/* HEADER - 1/3 en tablet, un poco más grande (40vh) en desktop */}
            <div className="shrink-0 w-full px-4 z-10 
                            flex items-center justify-center
                            pt-6 pb-2
                            sm:h-[33vh] lg:h-[40vh] sm:py-0">
                <img
                    src="/assets/sintenedor_trimmed.png"
                    alt="Sintenedor"
                    className="
                        block
                        mx-auto
                        w-auto
                        h-[80%]
                        sm:h-[85%]
                        lg:h-[95%]
                        max-h-[140px]
                        sm:max-h-full
                        object-contain
                        transition-all duration-500
                    "
                />
            </div>

            {/* GRID CONTAINER
                Móvil: Reducido al 75% para ver más video de fondo
                Desktop: 60% vh para compensar el logo más grande
            */}
            <div className="flex-1 w-full flex items-center justify-center min-h-0 px-4 pb-8 sm:pb-12 md:pb-32 lg:pb-12">
                <div className="grid gap-6 md:gap-10 w-[75%] sm:w-full h-fit max-h-full
                                grid-cols-1 overflow-y-auto 
                                sm:grid-cols-2 sm:overflow-visible sm:max-w-[440px] md:max-w-[500px]
                                lg:grid-cols-4 lg:max-w-7xl">
                    {MENU_ITEMS.map((item) => (
                        <MenuItem key={item.id} product={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

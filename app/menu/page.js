import MenuItem from "@/components/MenuItem";
import { MENU_ITEMS } from "@/lib/data";
export default function Page() {
    return <div>
        <h1>Menu</h1>
        <p>En esta pagina podras ver todo el menu de la pizzeria</p>
        {MENU_ITEMS.map((item) => (
            <MenuItem key={item.id} product={item} />
        ))}
    </div>
}

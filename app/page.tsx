import Image from "next/image";
import MenuList from "@/components/MenuList";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <MenuList />
    </div>
  );
}

import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="
        bg-neutral-900 
        md:rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header>Header</Header>
    </div>
  );
}

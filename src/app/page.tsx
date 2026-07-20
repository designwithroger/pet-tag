import Image from "next/image";
import HeroArc from "@/components/HeroArc";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="pt-16 sm:pt-24 pb-6 sm:pb-10 flex justify-center">
        <Image src="/logo.svg" alt="Petag" width={1600} height={497} className="h-8 sm:h-11 w-auto" priority />
      </div>

      <HeroArc />

      <div className="pt-8 pb-8 text-center">
        <p className="text-xs text-ink/35">Powered by Capybara Creative</p>
      </div>
    </main>
  );
}

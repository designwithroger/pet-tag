import HeroArc from "@/components/HeroArc";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroArc />

      <div className="pt-8 pb-8 text-center">
        <p className="text-xs text-ink/35">Powered by Capybara Creative</p>
      </div>
    </main>
  );
}

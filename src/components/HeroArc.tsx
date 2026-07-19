"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

// Pixel-matched to folioblox.framer.website's "Behind the Designs" row
// (measured directly from the live site via devtools: declared card is
// 280x400, seven cards taper 276x522 → 145x207 → 276x522, gap ~12px,
// radius 30px). Confirmed by zoomed screenshot: cards are perfectly flat,
// axis-aligned rectangles — the wave look comes entirely from the size
// taper + shared vertical center, no rotation. The reference also uses the
// SAME absolute sizes at every breakpoint — mobile isn't a scaled-down
// variant, it just lets the two largest edge cards bleed off-screen.
const photos = [
  { src: "/hero/hero-1.jpg", w: 276, h: 522 },
  { src: "/hero/hero-3.jpg", w: 190, h: 316 },
  { src: "/hero/hero-4.jpg", w: 155, h: 236 },
  { src: "/hero/hero-9.jpg", w: 145, h: 207 },
  { src: "/hero/hero-6.jpg", w: 155, h: 236 },
  { src: "/hero/hero-7.webp", w: 190, h: 316 },
  { src: "/hero/hero-8.webp", w: 276, h: 522 },
];

export default function HeroArc() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-arc-photo]",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="w-full">
      <div className="px-4 pb-8 sm:pb-12 flex flex-col items-center text-center">
        <h1 className="font-heading text-2xl sm:text-5xl font-semibold text-ink tracking-tight leading-tight max-w-xs sm:max-w-xl">
          Encuentra el camino de vuelta a casa
        </h1>
        <p className="mt-3 text-sm sm:text-base text-ink/50 leading-relaxed max-w-xs sm:max-w-md">
          Texto descriptivo de que hace la plataforma para ayudar a las mascotas a regresar a su
          dueño.
        </p>
        <Link
          href="/signup"
          className="mt-5 flex items-center justify-center h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-teal text-cream text-sm font-heading font-semibold"
        >
          Crear el perfil de mi mascota
        </Link>
      </div>

      <div className="flex items-center justify-center gap-3 overflow-hidden" style={{ paddingBottom: "8px" }}>
        {photos.map((p) => (
          <div key={p.src} data-arc-photo className="shrink-0" style={{ width: p.w, height: p.h }}>
            <div className="w-full h-full rounded-[30px] overflow-hidden shadow-lg shadow-ink/20 ring-1 ring-ink/5 relative">
              <Image src={p.src} alt="" fill sizes="280px" className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

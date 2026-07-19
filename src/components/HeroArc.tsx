"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const photos = [
  { src: "/hero/hero-1.jpg", angle: -90 },
  { src: "/hero/hero-2.jpg", angle: -67.5 },
  { src: "/hero/hero-3.jpg", angle: -45 },
  { src: "/hero/hero-4.jpg", angle: -22.5 },
  { src: "/hero/hero-9.jpg", angle: 0 },
  { src: "/hero/hero-6.jpg", angle: 22.5 },
  { src: "/hero/hero-7.webp", angle: 45 },
  { src: "/hero/hero-8.webp", angle: 67.5 },
  { src: "/hero/hero-10.jpg", angle: 90 },
];

export default function HeroArc() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-arc-photo]",
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.7, stagger: 0.05, ease: "back.out(1.6)" }
      );
      gsap.fromTo(
        "[data-arc-text]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.35, ease: "power3.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative w-full h-[340px] sm:h-[580px] overflow-hidden"
    >
      {photos.map((p) => (
        <div
          key={p.src}
          data-arc-photo
          className="absolute left-1/2 bottom-24 sm:bottom-44 [--radius:170px] sm:[--radius:280px] w-[72px] h-[104px] sm:w-32 sm:h-44"
          style={{
            transform: `translateX(-50%) rotate(${p.angle}deg) translateY(calc(-1 * var(--radius)))`,
          }}
        >
          <div className="w-full h-full rounded-[24px] overflow-hidden shadow-lg shadow-ink/20 ring-1 ring-ink/5">
            <Image src={p.src} alt="" fill sizes="160px" className="object-cover" />
          </div>
        </div>
      ))}

      <div
        data-arc-text
        className="absolute left-1/2 bottom-1 sm:bottom-4 -translate-x-1/2 flex flex-col items-center text-center px-4 w-full max-w-[175px] sm:max-w-[280px]"
      >
        <h1 className="font-heading text-xl sm:text-4xl font-semibold text-ink tracking-tight leading-tight">
          Encuentra el camino de vuelta a casa
        </h1>
        <p className="mt-2 sm:mt-3 text-[11px] sm:text-sm text-ink/50 leading-snug sm:leading-relaxed">
          Texto descriptivo de que hace la plataforma para ayudar a las mascotas a regresar a su
          dueño.
        </p>
        <Link
          href="/signup"
          className="mt-3 sm:mt-5 flex items-center justify-center h-8 sm:h-11 px-4 sm:px-6 rounded-full bg-teal text-cream text-[11px] sm:text-sm font-heading font-semibold whitespace-nowrap"
        >
          Crear el perfil de mi mascota
        </Link>
      </div>
    </div>
  );
}

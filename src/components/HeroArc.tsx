"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

// A real, continuously-spinning 3D cylinder carousel — matches the actual
// mechanism behind folioblox.framer.website's "Behind the Designs" row
// (confirmed via devtools: its rotateY matrices change over time, meaning
// it's a live-animated carousel with no single static state to copy
// pixel-for-pixel). Every card shares one declared size; the size/tilt
// variation you see is real perspective foreshortening from translateZ,
// not hand-authored per-card values.
const photos = [
  "/hero/hero-1.jpg",
  "/hero/hero-2.jpg",
  "/hero/hero-3.jpg",
  "/hero/hero-4.jpg",
  "/hero/hero-9.jpg",
  "/hero/hero-6.jpg",
  "/hero/hero-7.webp",
  "/hero/hero-8.webp",
  "/hero/hero-10.jpg",
  "/hero/hero-5.webp",
];

const COUNT = photos.length;
const STEP = 360 / COUNT;

export default function HeroArc() {
  const rootRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-arc-text]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion && carouselRef.current) {
        gsap.to(carouselRef.current, {
          rotationY: "+=360",
          duration: 40,
          repeat: -1,
          ease: "none",
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="w-full">
      <div
        data-arc-text
        className="px-4 pb-8 sm:pb-12 flex flex-col items-center text-center"
      >
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

      <div
        className="relative w-full h-[260px] sm:h-[420px] overflow-hidden"
        style={{ perspective: "1400px" }}
      >
        <div
          ref={carouselRef}
          className="absolute left-1/2 top-1/2 w-0 h-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {photos.map((src, i) => (
            <div
              key={src}
              className="absolute w-[130px] h-[195px] sm:w-[220px] sm:h-[330px] [--z:150px] sm:[--z:260px] -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `rotateY(${i * STEP}deg) translateZ(var(--z))`,
                backfaceVisibility: "hidden",
              }}
            >
              <div className="w-full h-full rounded-[24px] sm:rounded-[30px] overflow-hidden shadow-lg shadow-ink/20 ring-1 ring-ink/5 relative">
                <Image src={src} alt="" fill sizes="220px" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

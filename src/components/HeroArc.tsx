"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

// Exact mechanism from folioblox.framer.website's "Behind the Designs"
// carousel — extracted from its actual CSS rules (devtools), not guessed:
//   .framer-1wafx0o "Slider"  -> transform: perspective(600px)
//   .framer-75r392  "Circle"  -> the rotor; its rotateY is driven continuously
//   12 image cards, each 280x400px, border-radius 30px, backface-visibility
//   hidden, arranged in 6 "pair" wrappers (each a 1400px-wide flex row with
//   justify-content: space-between, so one card sits at the far left edge
//   and one at the far right edge — i.e. ±700px from the wrapper's own
//   center) spaced 30° apart. That's mathematically identical to 12 cards
//   each placed with `translateZ(700px) rotateY(n * 30deg)` around one
//   pivot, which is what we build directly below.
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
  "/hero/hero-11.webp",
  "/hero/hero-12.jpg",
];

const COUNT = photos.length; // 12
const STEP = 360 / COUNT; // 30deg, matches the reference exactly
const RADIUS = 700; // px, matches the reference's 1400px-wide pair wrapper / 2
const PERSPECTIVE = 600; // px, matches the reference's perspective(600px)

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

      if (carouselRef.current) {
        // Push the whole cylinder back in Z so its nearest card never
        // pierces the perspective plane (radius 700 > perspective 600
        // otherwise sends that card's projection to infinity/NaN territory
        // and Chrome drops the whole 3D layer instead of just that card).
        gsap.set(carouselRef.current, { z: -500 });
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion && carouselRef.current) {
        gsap.to(carouselRef.current, {
          rotationY: "+=360",
          duration: 48,
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
        className="relative w-full h-[300px] sm:h-[440px] overflow-hidden"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        <div
          ref={carouselRef}
          className="absolute left-1/2 top-1/2 w-0 h-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {photos.map((src, i) => (
            <div
              key={src}
              className="absolute w-[280px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[30px] overflow-hidden shadow-lg shadow-ink/20 ring-1 ring-ink/5"
              style={{
                transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <Image src={src} alt="" fill sizes="280px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

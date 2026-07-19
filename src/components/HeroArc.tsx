"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

// Mechanism from folioblox.framer.website's "Behind the Designs" carousel:
// perspective(600px), 12 image cards at 280x400/30px-radius spaced 30°
// apart on a cylinder. The reference is actually static at rest (measured
// its front card's width for 8s straight — never changed), and that front
// card sits at ~1518px wide, i.e. ~5.4x its declared 280px: it's deliberately
// let to blow up as it nears the camera plane, not avoided. Solving
// scale = perspective / (perspective - radius) for that observed 5.4x at
// perspective=600 gives the real effective radius: ~490px (our earlier
// 700px guess, taken directly from the 1400px pair-wrapper's half-width,
// didn't account for the card's own half-width offset from that wrapper's
// rotation origin — this 490 is calibrated against the live site's actual
// rendered output instead).
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
const RADIUS = 490; // px, calibrated so the front card reaches ~5.4x scale, same as the reference
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

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

// Exact reproduction of folioblox.framer.website's carousel geometry, now
// that the convex orientation revealed how its numbers fit together:
// a full 12-card ring (30° steps), radius 700, perspective 600, cards
// 280x400 with 30px radius — viewed from the ring's near side, so the
// center card recedes (z=-700 → projected ~129px wide, matching the
// ~145px measured on the live site) and the ±90° cards swing out to
// full size at the screen edges (matching its measured ~276px).
// backface-visibility:hidden (same as the reference) culls the cards on
// the front half of the ring, which would otherwise fly past the camera.
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
const STEP = 360 / COUNT; // 30°, same as the reference
const RADIUS = 700; // px, same as the reference
const PERSPECTIVE = 600; // px, same as the reference

export default function HeroArc() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-arc-text]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        "[data-arc-photo]",
        { opacity: 0 },
        { opacity: 1, duration: 0.7, stagger: 0.05, ease: "power3.out" }
      );

      // Spin the whole ring. Because the cards sit on the near side
      // (translateZ negative), rotating the ring sweeps them across the
      // front, edge-to-edge, exactly like the reference. Skipped for users
      // who prefer reduced motion.
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion && ringRef.current) {
        gsap.to(ringRef.current, {
          rotationY: "-=360",
          duration: 44,
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
          ref={ringRef}
          className="absolute left-1/2 top-1/2 w-0 h-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {photos.map((src, i) => (
            <div
              key={src}
              data-arc-photo
              className="absolute w-[280px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[30px] overflow-hidden shadow-lg shadow-ink/20 ring-1 ring-ink/5"
              style={{
                transform: `rotateY(${i * STEP}deg) translateZ(-${RADIUS}px)`,
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

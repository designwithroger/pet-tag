"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

// Same 3D-cylinder mechanism as folioblox.framer.website's carousel
// (perspective + rotateY + translateZ per card, backface-visibility
// hiding the far side), but tuned to stay in the safe zone: radius is
// kept well under the perspective distance so no card's Z ever
// approaches the camera plane. Measuring the reference directly showed
// its "pierce the camera" blowup only shows up transiently — at rest it
// reads as this same even taper, large in the middle, smaller at the
// edges, nothing swallowing the whole row.
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
];

const COUNT = photos.length; // 11
const ANGLE_SPAN = 140; // degrees, total sweep from first to last card
const STEP = ANGLE_SPAN / (COUNT - 1);
const START = -ANGLE_SPAN / 2;
const RADIUS = 350; // px — well under PERSPECTIVE, so cos(0)*RADIUS never nears it
const PERSPECTIVE = 900; // px

export default function HeroArc() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-arc-text]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        "[data-arc-photo]",
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.7, stagger: 0.05, ease: "power3.out" }
      );
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
        className="relative w-full h-[280px] sm:h-[420px] overflow-hidden"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        <div
          className="absolute left-1/2 top-1/2 w-0 h-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {photos.map((src, i) => (
            <div
              key={src}
              data-arc-photo
              className="absolute w-[180px] h-[260px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] overflow-hidden shadow-lg shadow-ink/20 ring-1 ring-ink/5"
              style={{
                transform: `rotateY(${START + i * STEP}deg) translateZ(${RADIUS}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <Image src={src} alt="" fill sizes="200px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { PetRow } from "@/lib/pet";
import { zoneTileUrl } from "@/lib/tile";

export default function PetCard({ pet }: { pet: PetRow }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-photo]",
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9 }
      )
        .fromTo(
          "[data-hero-stagger]",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
          "-=0.45"
        )
        .fromTo(
          "[data-below]",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.2"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const waLink = `https://wa.me/${pet.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    pet.whatsapp_message
  )}`;
  const hasZoneMap = pet.zone_lat != null && pet.zone_lng != null;

  return (
    <div ref={rootRef} className="w-full max-w-sm mx-auto">
      <div className="relative rounded-[28px] overflow-hidden shadow-xl shadow-black/10 bg-ink aspect-[3/4]">
        <Image
          data-hero-photo
          src={pet.photo_url || "/pet-photo.webp"}
          alt={`Foto de ${pet.name}`}
          fill
          priority
          className="object-cover"
        />

        <div
          className="absolute inset-x-0 bottom-0 h-[68%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(26,20,16,0.96) 0%, rgba(26,20,16,0.82) 38%, rgba(26,20,16,0.15) 78%, rgba(26,20,16,0) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-3">
          <div data-hero-stagger className="flex items-center gap-1.5">
            <h1 className="font-serif text-2xl font-semibold text-cream tracking-tight">
              {pet.name}
            </h1>
            {pet.verified && (
              <img src="/icons/blue/badge-check.svg" alt="Verificado" className="w-5 h-5" />
            )}
          </div>

          {(pet.species || pet.age) && (
            <p data-hero-stagger className="text-xs uppercase tracking-wide text-cream/60">
              {[pet.species, pet.age].filter(Boolean).join(" · ")}
            </p>
          )}

          {pet.bio && (
            <p data-hero-stagger className="text-sm text-cream/85 leading-snug max-w-[85%]">
              {pet.bio}
            </p>
          )}

          <div data-hero-stagger className="pt-1">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-cream text-ink font-medium text-sm h-12 px-5 transition-transform active:scale-[0.98]"
            >
              <img src="/icons/message-circle.svg" alt="" className="w-4 h-4" />
              Contactar
            </a>
          </div>
        </div>
      </div>

      {pet.phone && (
        <a
          data-below
          href={`tel:${pet.phone}`}
          className="mt-4 flex items-center gap-3 rounded-2xl bg-white/60 border border-ink/8 p-4"
        >
          <div className="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
            <img src="/icons/phone.svg" alt="" className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-ink/50 leading-none mb-1">
              Teléfono de contacto{pet.owner_name ? ` · ${pet.owner_name}` : ""}
            </p>
            <p className="text-sm font-medium truncate">{pet.phone}</p>
          </div>
        </a>
      )}

      {pet.zone && (
        <div data-below className="mt-3 rounded-2xl bg-white/60 border border-ink/8 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
              <img src="/icons/map-pin.svg" alt="" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-ink/50 leading-none mb-1">Zona donde vive</p>
              <p className="text-sm font-medium truncate">{pet.zone}</p>
            </div>
          </div>

          {hasZoneMap && (
            <>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${pet.zone_lat},${pet.zone_lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 rounded-xl overflow-hidden h-28 relative bg-ink/5 block active:opacity-80 transition-opacity"
              >
                <img
                  src={zoneTileUrl(pet.zone_lat!, pet.zone_lng!)}
                  alt={`Mapa referencial de la zona: ${pet.zone}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img
                    src="/icons/accent/map-pin.svg"
                    alt=""
                    className="w-7 h-7 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] -translate-y-1"
                  />
                </div>
              </a>
              <p className="mt-2 text-[11px] text-ink/40 leading-snug">
                Ubicación aproximada de la zona, no la dirección exacta.
              </p>
            </>
          )}
        </div>
      )}

      <p data-below className="mt-6 mb-4 text-center text-xs text-ink/40">
        Powered by Petag
      </p>
    </div>
  );
}

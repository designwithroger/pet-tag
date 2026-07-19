import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { PetRow } from "@/lib/pet";
import type { TagRow } from "@/lib/tag";
import PetCard from "@/components/PetCard";

export default async function TagPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: tag } = await supabase
    .from("tags")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle<TagRow>();

  if (!tag) notFound();

  if (tag.status === "claimed" && tag.pet_id) {
    const { data: pet } = await supabase
      .from("pets")
      .select("*")
      .eq("id", tag.pet_id)
      .maybeSingle<PetRow>();

    if (pet) {
      return (
        <main className="flex-1 flex justify-center px-4 pt-8 pb-8 sm:pb-16">
          <PetCard pet={pet} />
        </main>
      );
    }
  }

  const nextUrl = `/dashboard/pets/new?tag=${tag.code}`;

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-heading text-2xl font-semibold mb-2">Activa este tag</h1>
        <p className="text-sm text-ink/60 mb-8 leading-relaxed">
          Este tag NFC todavía no tiene una mascota asociada. Crea una cuenta o inicia sesión para
          completar el perfil — no necesitas configurar nada más en el tag.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href={`/signup?next=${encodeURIComponent(nextUrl)}`}
            className="flex items-center justify-center h-11 rounded-full bg-teal text-cream text-sm font-heading font-semibold"
          >
            Crear cuenta y activar
          </Link>
          <Link
            href={`/login?next=${encodeURIComponent(nextUrl)}`}
            className="flex items-center justify-center h-11 rounded-full border border-ink/12 text-sm font-medium"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </main>
  );
}

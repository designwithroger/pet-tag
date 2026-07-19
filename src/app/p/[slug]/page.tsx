import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { PetRow } from "@/lib/pet";
import PetCard from "@/components/PetCard";

async function getPet(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pets")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<PetRow>();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pet = await getPet(slug);
  if (!pet) return { title: "Mascota no encontrada | Pet Tag" };
  return {
    title: `${pet.name} | Pet Tag`,
    description: `Escanea el tag NFC de ${pet.name} para contactar a su familia.`,
  };
}

export default async function PetPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pet = await getPet(slug);

  if (!pet) notFound();

  return (
    <main className="flex-1 flex justify-center px-4 pt-8 pb-8 sm:pb-16">
      <PetCard pet={pet} />
    </main>
  );
}

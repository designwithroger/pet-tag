import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PetForm from "@/components/PetForm";
import type { PetRow } from "@/lib/pet";
import { updatePet, deletePet } from "../../actions";

export default async function EditPetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const { error } = await searchParams;

  const { data: pet } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle<PetRow>();

  if (!pet) notFound();

  const updatePetWithId = updatePet.bind(null, pet.id);
  const deletePetWithId = deletePet.bind(null, pet.id);

  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      <h1 className="font-serif text-2xl font-semibold mb-1">Editar {pet.name}</h1>
      <p className="text-xs text-ink/50 mb-6">Link público: /p/{pet.slug}</p>

      <PetForm pet={pet} action={updatePetWithId} error={error} />

      <form action={deletePetWithId} className="mt-6">
        <button type="submit" className="text-xs text-accent underline">
          Eliminar este perfil
        </button>
      </form>
    </main>
  );
}

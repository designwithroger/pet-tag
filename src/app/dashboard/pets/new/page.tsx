import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PetForm from "@/components/PetForm";
import { createPet } from "../actions";

export default async function NewPetPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await searchParams;

  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      <h1 className="font-serif text-2xl font-semibold mb-6">Nueva mascota</h1>
      <PetForm action={createPet} error={error} />
    </main>
  );
}

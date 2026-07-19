import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PetForm from "@/components/PetForm";
import type { TagRow } from "@/lib/tag";
import { createPet } from "../actions";

export default async function NewPetPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; tag?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error, tag } = await searchParams;

  let tagCode: string | null = null;
  if (tag) {
    const { data } = await supabase
      .from("tags")
      .select("*")
      .eq("code", tag.toUpperCase())
      .maybeSingle<TagRow>();
    if (data && data.status === "unclaimed") tagCode = data.code;
  }

  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      <h1 className="font-heading text-2xl font-semibold mb-1">Nueva mascota</h1>
      {tagCode && (
        <p className="text-xs text-teal font-medium mb-6">
          Este perfil quedará vinculado al tag {tagCode}
        </p>
      )}
      {!tagCode && <div className="mb-6" />}
      <PetForm action={createPet} error={error} tagCode={tagCode} />
    </main>
  );
}

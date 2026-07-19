"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/pet";

function readPetFields(formData: FormData) {
  return {
    name: String(formData.get("name") || "").trim(),
    species: String(formData.get("species") || "").trim(),
    age: String(formData.get("age") || "").trim(),
    bio: String(formData.get("bio") || "").trim(),
    zone: String(formData.get("zone") || "").trim(),
    zone_lat: formData.get("zone_lat") ? Number(formData.get("zone_lat")) : null,
    zone_lng: formData.get("zone_lng") ? Number(formData.get("zone_lng")) : null,
    owner_name: String(formData.get("owner_name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    whatsapp_message: String(formData.get("whatsapp_message") || "").trim(),
  };
}

async function uploadPhotoIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ownerId: string,
  formData: FormData
) {
  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${ownerId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("pet-photos").upload(path, file, {
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("pet-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function createPet(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fields = readPetFields(formData);
  const tagCode = String(formData.get("tag_code") || "").trim().toUpperCase();
  const baseSlug = slugify(fields.name) || "mascota";
  let slug = baseSlug;
  let attempt = 0;
  let newPetId: string | null = null;

  const photo_url = await uploadPhotoIfPresent(supabase, user.id, formData);

  // Retry with a short suffix if the slug is taken (unique constraint on slug).
  while (attempt < 5) {
    const { data, error } = await supabase
      .from("pets")
      .insert({ ...fields, slug, photo_url, owner_id: user.id })
      .select("id")
      .single();

    if (!error) {
      newPetId = data.id;
      break;
    }
    if (error.code === "23505") {
      attempt += 1;
      slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
      continue;
    }
    redirect(`/dashboard/pets/new?error=${encodeURIComponent(error.message)}`);
  }

  if (tagCode && newPetId) {
    await supabase
      .from("tags")
      .update({
        status: "claimed",
        pet_id: newPetId,
        claimed_by: user.id,
        claimed_at: new Date().toISOString(),
      })
      .eq("code", tagCode)
      .eq("status", "unclaimed");
    revalidatePath(`/t/${tagCode}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updatePet(petId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fields = readPetFields(formData);
  const photo_url = await uploadPhotoIfPresent(supabase, user.id, formData);

  const { error } = await supabase
    .from("pets")
    .update({ ...fields, ...(photo_url ? { photo_url } : {}) })
    .eq("id", petId)
    .eq("owner_id", user.id);

  if (error) {
    redirect(`/dashboard/pets/${petId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/pets/${petId}/edit`);
  redirect("/dashboard");
}

export async function deletePet(petId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("pets").delete().eq("id", petId).eq("owner_id", user.id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

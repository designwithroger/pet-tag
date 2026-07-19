"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/admin";
import { generateTagCode } from "@/lib/tag";

async function requireAdmin() {
  const { isAdmin } = await getCurrentProfile();
  if (!isAdmin) redirect("/dashboard");
}

export async function generateTags(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const count = Math.min(Math.max(Number(formData.get("count")) || 1, 1), 200);
  const rows = Array.from({ length: count }, () => ({ code: generateTagCode() }));

  // Codes are short and random; collisions are rare but possible — retry once per row on conflict.
  const { error } = await supabase.from("tags").insert(rows);
  if (error && error.code === "23505") {
    const retryRows = Array.from({ length: count }, () => ({ code: generateTagCode() }));
    await supabase.from("tags").insert(retryRows);
  }

  revalidatePath("/admin");
}

export async function unlinkTag(tagId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("tags")
    .update({ status: "unclaimed", pet_id: null, claimed_by: null, claimed_at: null })
    .eq("id", tagId);
  revalidatePath("/admin");
}

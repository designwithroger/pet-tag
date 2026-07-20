"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function requestReset(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const email = String(formData.get("email") || "").trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  // Always land on the same confirmation, even if the email doesn't exist, so
  // we don't leak which addresses have accounts.
  redirect("/forgot-password?sent=1");
}

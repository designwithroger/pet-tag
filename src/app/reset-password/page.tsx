import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updatePassword } from "./actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Reached without a valid recovery session (link expired, opened on another
  // device, or never came from the email).
  if (!user) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-heading text-2xl font-semibold mb-2">Link no válido</h1>
          <p className="text-sm text-ink/60 mb-6">
            El link de recuperación expiró o no es válido. Solicita uno nuevo.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-ink text-cream text-sm font-medium"
          >
            Solicitar nuevo link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-2xl font-semibold mb-1">Nueva contraseña</h1>
        <p className="text-sm text-ink/60 mb-6">Elige una nueva contraseña para tu cuenta.</p>

        {error && (
          <p className="mb-4 text-sm rounded-lg bg-accent/10 text-accent px-3 py-2">{error}</p>
        )}

        <form action={updatePassword} className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-ink/50 mb-1 block" htmlFor="password">
              Nueva contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full h-11 rounded-xl border border-ink/12 px-3 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>
          <div>
            <label className="text-xs text-ink/50 mb-1 block" htmlFor="confirm">
              Confirmar contraseña
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              minLength={6}
              className="w-full h-11 rounded-xl border border-ink/12 px-3 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>
          <button
            type="submit"
            className="mt-2 h-11 rounded-full bg-ink text-cream text-sm font-medium"
          >
            Guardar contraseña
          </button>
        </form>
      </div>
    </main>
  );
}

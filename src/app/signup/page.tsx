import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; check_email?: string; next?: string }>;
}) {
  const { error, check_email, next } = await searchParams;

  if (check_email) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-heading text-2xl font-semibold mb-2">Revisa tu correo</h1>
          <p className="text-sm text-ink/60">
            Te enviamos un link de confirmación. Ábrelo para activar tu cuenta y luego inicia sesión.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-2xl font-semibold mb-1">Crea tu cuenta</h1>
        <p className="text-sm text-ink/60 mb-6">
          Regístrate para crear el perfil de tu mascota y generar su link.
        </p>

        {error && (
          <p className="mb-4 text-sm rounded-lg bg-accent/10 text-accent px-3 py-2">{error}</p>
        )}

        <form action={signup} className="flex flex-col gap-3">
          <input type="hidden" name="next" value={next ?? "/dashboard"} />
          <div>
            <label className="text-xs text-ink/50 mb-1 block" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full h-11 rounded-xl border border-ink/12 px-3 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>
          <div>
            <label className="text-xs text-ink/50 mb-1 block" htmlFor="password">
              Contraseña
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
          <button
            type="submit"
            className="mt-2 h-11 rounded-full bg-ink text-cream text-sm font-medium"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-ink font-medium underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}

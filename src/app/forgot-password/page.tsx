import Link from "next/link";
import { requestReset } from "./actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  if (sent) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-heading text-2xl font-semibold mb-2">Revisa tu correo</h1>
          <p className="text-sm text-ink/60">
            Si existe una cuenta con ese correo, te enviamos un link para restablecer tu contraseña.
            Ábrelo desde este mismo dispositivo.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm text-teal font-heading font-semibold">
            Volver a inicio de sesión
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-2xl font-semibold mb-1">Recuperar contraseña</h1>
        <p className="text-sm text-ink/60 mb-6">
          Ingresa tu correo y te enviaremos un link para crear una nueva contraseña.
        </p>

        {error && (
          <p className="mb-4 text-sm rounded-lg bg-accent/10 text-accent px-3 py-2">{error}</p>
        )}

        <form action={requestReset} className="flex flex-col gap-3">
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
          <button
            type="submit"
            className="mt-2 h-11 rounded-full bg-ink text-cream text-sm font-medium"
          >
            Enviar link de recuperación
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60 text-center">
          <Link href="/login" className="text-ink font-medium underline">
            Volver a inicio de sesión
          </Link>
        </p>
      </div>
    </main>
  );
}

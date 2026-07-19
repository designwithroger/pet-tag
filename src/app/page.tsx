import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-3xl font-semibold tracking-tight mb-3">Pet Tag</h1>
        <p className="text-sm text-ink/60 mb-8 leading-relaxed">
          Crea el perfil de tu mascota, genera su link y escríbelo en un tag NFC. Cuando alguien
          lo escanee, verá cómo contactarte.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/signup"
            className="flex items-center justify-center h-11 rounded-full bg-ink text-cream text-sm font-medium"
          >
            Crear el perfil de mi mascota
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center h-11 rounded-full border border-ink/12 text-sm font-medium"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </main>
  );
}

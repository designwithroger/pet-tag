import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PetRow } from "@/lib/pet";
import { logout } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .returns<PetRow[]>();

  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Tus mascotas</h1>
          <p className="text-xs text-ink/50">{user.email}</p>
        </div>
        <form action={logout}>
          <button className="text-sm text-ink/50 underline" type="submit">
            Salir
          </button>
        </form>
      </div>

      <Link
        href="/dashboard/pets/new"
        className="flex items-center justify-center h-11 rounded-full bg-ink text-cream text-sm font-medium mb-6"
      >
        + Nueva mascota
      </Link>

      {(!pets || pets.length === 0) && (
        <p className="text-sm text-ink/50 text-center py-12">
          Aún no has creado ningún perfil. Crea el primero para generar su link.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {pets?.map((pet) => (
          <div
            key={pet.id}
            className="flex items-center gap-3 rounded-2xl bg-white/60 border border-ink/8 p-3"
          >
            <div className="w-12 h-12 rounded-full bg-ink/5 overflow-hidden shrink-0">
              {pet.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{pet.name}</p>
              <p className="text-xs text-ink/50 truncate">/p/{pet.slug}</p>
            </div>
            <Link
              href={`/p/${pet.slug}`}
              target="_blank"
              className="text-xs text-ink/60 underline shrink-0"
            >
              Ver
            </Link>
            <Link
              href={`/dashboard/pets/${pet.id}/edit`}
              className="text-xs text-ink font-medium underline shrink-0"
            >
              Editar
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

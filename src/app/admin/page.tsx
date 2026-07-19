import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/admin";
import { generateTags, unlinkTag } from "./actions";

export default async function AdminPage() {
  const { user, isAdmin } = await getCurrentProfile();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin) redirect("/dashboard");

  const supabase = await createClient();

  const { data: tags } = await supabase
    .from("tags")
    .select("id, code, status, created_at, pets(name, slug), claimed_by")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, role")
    .order("created_at", { ascending: false });

  const { data: pets } = await supabase
    .from("pets")
    .select("id, name, slug, owner_id, created_at")
    .order("created_at", { ascending: false });

  const claimedCount = tags?.filter((t) => t.status === "claimed").length ?? 0;
  const unclaimedCount = tags?.filter((t) => t.status === "unclaimed").length ?? 0;

  return (
    <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
      <h1 className="font-heading text-2xl font-semibold mb-1">Admin</h1>
      <p className="text-xs text-ink/50 mb-8">{user.email}</p>

      <section className="mb-10">
        <h2 className="font-heading text-lg font-semibold mb-3">Tags NFC</h2>
        <div className="flex gap-4 text-sm text-ink/60 mb-4">
          <span>{unclaimedCount} sin reclamar</span>
          <span>{claimedCount} activados</span>
        </div>

        <form action={generateTags} className="flex items-center gap-2 mb-6">
          <input
            type="number"
            name="count"
            defaultValue={20}
            min={1}
            max={200}
            className="w-24 h-10 rounded-xl border border-ink/12 px-3 text-sm bg-white/60"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-full bg-ink text-cream text-sm font-medium"
          >
            Generar tags
          </button>
        </form>

        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {tags?.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-xl bg-white/60 border border-ink/8 px-3 py-2 text-sm"
            >
              <code className="font-medium">{t.code}</code>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  t.status === "claimed" ? "bg-verified/10 text-verified" : "bg-ink/5 text-ink/50"
                }`}
              >
                {t.status === "claimed" ? "activado" : "sin reclamar"}
              </span>
              {t.pets?.[0] && (
                <Link href={`/p/${t.pets[0].slug}`} target="_blank" className="text-ink/60 underline text-xs">
                  {t.pets[0].name}
                </Link>
              )}
              <a
                href={`/t/${t.code}`}
                target="_blank"
                className="ml-auto text-xs text-ink/40 underline"
              >
                /t/{t.code}
              </a>
              {t.status === "claimed" && (
                <form action={unlinkTag.bind(null, t.id)}>
                  <button type="submit" className="text-xs text-accent underline">
                    Desvincular
                  </button>
                </form>
              )}
            </div>
          ))}
          {(!tags || tags.length === 0) && (
            <p className="text-sm text-ink/40">Aún no hay tags generados.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold mb-3">Clientes</h2>
        <div className="flex flex-col gap-2">
          {profiles?.map((p) => {
            const ownedPets = pets?.filter((pet) => pet.owner_id === p.id) ?? [];
            return (
              <div key={p.id} className="rounded-xl bg-white/60 border border-ink/8 px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{p.email}</span>
                  {p.role === "admin" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal">
                      admin
                    </span>
                  )}
                </div>
                {ownedPets.length > 0 && (
                  <p className="text-xs text-ink/50 mt-1">
                    {ownedPets.map((pet) => pet.name).join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

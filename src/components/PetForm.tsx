"use client";

import { useRef, useState } from "react";
import type { PetRow } from "@/lib/pet";

export default function PetForm({
  pet,
  action,
  error,
}: {
  pet?: Partial<PetRow>;
  action: (formData: FormData) => void;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {error && (
        <p className="text-sm rounded-lg bg-accent/10 text-accent px-3 py-2">{error}</p>
      )}

      <Field label="Nombre de la mascota" name="name" defaultValue={pet?.name} required />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Especie / raza" name="species" defaultValue={pet?.species} />
        <Field label="Edad" name="age" defaultValue={pet?.age} />
      </div>

      <div>
        <label className="text-xs text-ink/50 mb-1 block" htmlFor="bio">
          Descripción corta
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={pet?.bio}
          rows={3}
          className="w-full rounded-xl border border-ink/12 px-3 py-2 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
      </div>

      <PhotoField existingPhotoUrl={pet?.photo_url} />

      <hr className="border-ink/8" />

      <Field label="Zona donde vive (ej. Chuao, Caracas)" name="zone" defaultValue={pet?.zone} />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Latitud de la zona"
          name="zone_lat"
          type="number"
          step="any"
          defaultValue={pet?.zone_lat ?? undefined}
        />
        <Field
          label="Longitud de la zona"
          name="zone_lng"
          type="number"
          step="any"
          defaultValue={pet?.zone_lng ?? undefined}
        />
      </div>
      <p className="text-[11px] text-ink/40 -mt-2">
        Usa una coordenada aproximada de la zona, no la dirección exacta.
      </p>

      <hr className="border-ink/8" />

      <Field label="Nombre del dueño/contacto" name="owner_name" defaultValue={pet?.owner_name} />
      <Field label="Teléfono de contacto" name="phone" defaultValue={pet?.phone} />
      <div>
        <label className="text-xs text-ink/50 mb-1 block" htmlFor="whatsapp_message">
          Mensaje pre-cargado de WhatsApp
        </label>
        <input
          id="whatsapp_message"
          name="whatsapp_message"
          defaultValue={pet?.whatsapp_message}
          placeholder="Hola! Encontré a tu mascota..."
          className="w-full h-11 rounded-xl border border-ink/12 px-3 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
      </div>

      <button type="submit" className="mt-2 h-11 rounded-full bg-ink text-cream text-sm font-medium">
        Guardar
      </button>
    </form>
  );
}

function PhotoField({ existingPhotoUrl }: { existingPhotoUrl?: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingPhotoUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div>
      <label className="text-xs text-ink/50 mb-1 block">Foto</label>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-ink/5 overflow-hidden shrink-0 border border-ink/8">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="min-w-0">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center h-9 px-4 rounded-full border border-ink/12 text-xs font-medium"
          >
            {existingPhotoUrl ? "Cambiar foto" : "Subir foto"}
          </button>
          {fileName ? (
            <p className="text-[11px] text-ink/50 mt-1 truncate">{fileName}</p>
          ) : existingPhotoUrl ? (
            <p className="text-[11px] text-ink/40 mt-1">Deja sin cambiar para mantener la actual</p>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        id="photo"
        name="photo"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setFileName(file.name);
          setPreview(URL.createObjectURL(file));
        }}
      />
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="text-xs text-ink/50 mb-1 block" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        required={required}
        className="w-full h-11 rounded-xl border border-ink/12 px-3 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-ink/20"
      />
    </div>
  );
}

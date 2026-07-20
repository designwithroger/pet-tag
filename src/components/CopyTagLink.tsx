"use client";

import { useState } from "react";

export default function CopyTagLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    // Absolute URL is what gets written to the physical NFC tag.
    const url = `${window.location.origin}/t/${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked (e.g. insecure context) — select-and-copy fallback
      window.prompt("Copia el link del tag:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="text-xs text-teal font-medium underline shrink-0"
      title="Copiar el link para grabarlo en el collar NFC"
    >
      {copied ? "¡Copiado!" : "Copiar link"}
    </button>
  );
}

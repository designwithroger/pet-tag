# Pet Tag — Style Lock

## Source
Visual reference: user-provided "Which is Better" comparison mockup (Option B — full-bleed photo card with bottom gradient overlay, name/badge/stats/CTA sitting inside the overlay). No image file was available on disk to run `extract_palette.py` against (it was shared inline in chat, not saved locally), so this palette is a **manual visual read** of the reference, not an automated pixel extraction. Noting this honestly per the skill's honesty rule.

Read from the reference: near-black overlay gradient (not pure black), warm off-white/cream card background, colorful illustrated backdrop (coral/salmon, olive green, mustard yellow), a blue verified badge, amber star rating, solid black pill CTA button with white icon+text, circular secondary icon button.

## Palette (contrast-checked with check_contrast.py — all used pairs pass AA)
- `--ink` `#1A1410` — near-black, primary fill / body text / overlay base
- `--cream` `#F5F0E8` — page background, card background, text-on-dark
- `--accent` `#E8592E` — warm coral/terracotta, used sparingly (link-style accents, active states) — 3.14:1 on cream (passes UI-component floor), 5.12:1 on ink
- `--verified` `#3B82F6` — verified badge blue (kept close to reference, not extracted)
- `--star` `#F5A623` — rating star amber
- `--olive` `#5C6E3C` / `--mustard` `#D9A441` — supporting illustrated-backdrop tones for decorative gradient/blobs behind the pet photo if no photo is used
- `--teal` `#1C4B4E` — real brand color from the client-supplied logo SVG (`public/logo.svg`), used for the landing page logo, primary CTA, and link accents. 8.55:1 on cream, 9.70:1 white-on-teal — both pass AA.

Never pair `--ink` text on `--ink` fill (fails, see check_contrast.py output) — CTA text is always `--cream`/white on ink, never ink-on-ink.

## Typography (superseded 2026-07-19 — real brand assets arrived)
- Headings/UI-emphasis: `Clash Display` Semibold (self-hosted via `next/font/local`, `src/app/fonts/ClashDisplay-Semibold.woff2`, Fontshare free license, web use confirmed) — Tailwind class `font-heading`
- Body: `Clash Display` Regular (`ClashDisplay-Regular.woff2`) — Tailwind class `font-sans` (default)
- Replaces the original Fraunces/Inter pairing below, which was the pre-brand placeholder. `font-serif`/`--font-fraunces` no longer exist anywhere in the codebase — don't reintroduce them.
- Logo: real wordmark SVG at `public/logo.svg`, teal fill `#1C4B4E`

<details><summary>Original placeholder pairing (superseded, kept for history)</summary>

- Headings: `Fraunces` (serif) — variable weight, use 600/700
- Body/UI: `Inter` — 400/500/600
- Both via `next/font/google`, no CDN
</details>

## Layout pattern
Mobile-first single-column "link in bio" card, full-viewport on small screens:
1. Full-bleed pet photo, top ~65% of viewport, rounded-b-none / card has rounded corners on all sides with padding at very small viewport
2. Gradient overlay `linear-gradient(to top, ink 0%, ink/70% 40%, transparent 75%)` bottom half of photo
3. Inside overlay (bottom-anchored): pet name + verified badge, one-line description, stat row (rating · zone/barrio · age or similar), pill row: black "Contact owner" pill (phone icon) + circular bookmark/share icon button
4. Below the card (or within on very small screens): secondary info block — full address/zone detail, alt contact method, small map/pin visual
5. Corner radius: `rounded-[28px]` on the card (matches reference's soft-but-present radius), `rounded-full` on all pill/circular buttons
6. Shadow: soft, single layer, `shadow-xl shadow-black/10` — no double/glow shadows

## Spacing/radius scale
- radius: sm 8px, md 16px, lg 28px, full 9999px
- spacing: 4/8/12/16/24/32/48px steps, card inner padding 20-24px

## Assets
- Icons: Iconify, Lucide set, tinted to `--ink` (on cream) or `--cream` (on ink overlay) depending on placement — fetched via `fetch_icons.py`, no attribution needed
- Photo: real photo placeholder for the pet (dog) fetched from Openverse (CC0/PDM, attribution-free) via `fetch_photos.py` — swap for the real pet's photo later, file path documented in code comment
- Logo: real client-supplied wordmark SVG (`public/logo.svg`, `--teal` fill) — supersedes the earlier plan for a constructed paw-print mark. Favicon still needs generating from this mark via `export_favicons.py`.
- Motion: GSAP + ScrollTrigger via `assets/gsap-starter.js` — hero entrance timeline (photo scale-in, overlay content staggered fade/rise), reveal-on-scroll for the secondary info block below the fold

## Decisions log
See `.tastemaker/decisions.log`

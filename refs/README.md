# Reference Images

Drop visual references in this folder. `.png` `.jpg` `.jpeg` `.webp` `.pdf`.
Full-page screenshots beat crops — long scrolls show layout rhythm, crops don't.

**For each one, tell me what to take from it.** "Looks good" isn't usable direction:

- "the layout — how the hero splits and where the CTA sits"
- "the type pairing, ignore the colors"
- "the color restraint — how little color they use"
- "the motion — how sections enter on scroll"
- "overall vibe, ignore the specifics"

Name files descriptively (`hero-layout_stripe.png`, `type_kornferry.png`) and I'll record
each in `docs/sop/08-design-system.md`. Live site URLs work just as well — paste in chat.

---

## Files in this folder

| File | What it is | What we take from it |
|---|---|---|
| `dirA-*.png` | Direction A mockups (home, mega nav, service pages, candidate/client landings, job board) | Layout, hierarchy, and the navy/brass world. **Not** copy — the mock text is fabricated. |
| `dirA-logo-lockup.png` | Direction A wordmark, `ARSAN` over a two-line descriptor | The lockup proportions. Measured: **Cormorant Garamond, ~0.18em tracking** — reproduced as live text in `src/components/ui/logo.tsx`, not shipped as an image (D-052). |
| `dirB-home-rejected.png` | Rejected alternate direction | Kept only as an anti-reference. |
| `arsan-current-live-logo.png` | ARSAN's **actual** logo, pulled from arsancg.com | Not in use. Open question Q-18 — Direction A drops this icon and the "International Consulting Group" descriptor. Needs Marianna/Armida sign-off before we either honour or retire it. |

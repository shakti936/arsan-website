# ARSAN Website — Project Instructions

Rebuild of `arsancg.com` for ARSAN Consulting Group. Bilingual (EN/ES) executive search
firm, US + Mexico, manufacturing/industrial vertical.

**Read `docs/sop/README.md` at the start of every session.** It is the operating manual
for this build — stack, decisions, packages, prompts, open questions.

---

## The SOP is not optional

`docs/sop/` is maintained **in real time**, not written up at the end. These are rules,
not suggestions:

1. **Decisions → `docs/sop/01-decision-log.md`, in the same session the decision is made.**
   Include date, options considered, and why the winner won. A decision that isn't logged
   didn't happen — the next session will re-litigate it.
2. **Packages → `docs/sop/03-packages.md`, at install time.** Never `bun add` without
   adding the row: package, version, why it's here, what breaks without it. Never invent
   version numbers — read them from the lockfile.
3. **Prompts that changed direction or produced real output → `docs/sop/06-prompts.md`,
   verbatim.** Including failures. Routine back-and-forth is skipped; turning points are not.
4. **Unknowns → `docs/sop/11-open-questions.md`,** flagged blocking or non-blocking. Never
   leave an open question in chat scrollback.
5. **Setup steps → `docs/sop/04-setup-from-scratch.md` as they are actually run,** with the
   real command and any surprise that cost more than five minutes.
6. **When unsure whether something belongs in the SOP — ask Drew.** Don't guess, don't
   silently omit.
7. **No secret values in `docs/sop/`, ever.** Env var names and their source: yes. Values: no.

## Architecture constraints specific to this project

- **This site does not own jobs, candidates, or auth.** A separate internal repo does. The
  public site is a *client* of that system. Do not create canonical jobs/applications
  tables here without an explicit decision logged in `01-decision-log.md`.
- **GHL is CRM. Supabase is product data.** Never conflated. All lead communication — SMS,
  email, calls — goes through GHL.
- **EN/ES from day one.** No hardcoded user-facing strings. Metadata, JSON-LD, validation
  messages, and error states are localized too.
- **RLS before any Supabase table ships.** Service role key is server-side only.
- Phased delivery P1→P4 (see `docs/sop/00-project-brief.md`). Each phase gets its own spec
  and implementation plan.

## Stack

Next.js App Router · TypeScript strict · Tailwind · Framer Motion · Bun · Biome · Zod ·
Supabase · GHL · Vercel. Full reasoning in `docs/sop/02-stack.md`. Conventions in
`docs/sop/05-conventions.md`.

## Before any PR

```
tsc --noEmit
bunx biome check .
bun run build
```

All three green. No exceptions.

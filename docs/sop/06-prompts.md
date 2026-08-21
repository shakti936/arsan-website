# 06 — Prompts, Skills & Agents

**Last updated:** 2026-08-20

What was actually said to Claude Code, what came back, and what it cost. Verbatim —
including typos, because the typos didn't matter and pretending otherwise makes the log
less useful. Failed prompts are recorded too; a prompt that wasted an hour is worth more
here than one that worked.

---

## Session 1 — 2026-08-20 · Foundation kickoff

### P1.1 — Kickoff (user, verbatim)

> set me up with a foundation for mdoern next js tailwind framer bun framework website grill me if you need any more infromatoin https://www.arsancg.com/ we are going to remake arsan website

**What Claude did:** invoked the `superpowers:brainstorming` skill, classified the work as
**architectural** (new project, no existing flow to read), inspected the empty working
directory, and fetched `arsancg.com` to build the business brief before asking anything.

**What worked:** "grill me if you need any more information" is the highest-leverage phrase
in this prompt. It licenses structured interrogation up front instead of assumptions
discovered three files into the build. **Reuse it on every new project kickoff.**

**Outcome:** two rounds of structured multiple-choice questions instead of a scaffold built
on guesses. Caught that the project is four subsystems, not one site — before any code.

---

### P1.2 — Question round 1 (Claude → Drew)

Asked as a 4-question multiple-choice block: **scope** (brochure → job board → portal),
**data layer** (GHL-only vs Supabase+GHL), **i18n** (EN/ES now vs later), **design direction**.

**Answers:** candidate/client portal · Supabase + GHL sync · bilingual from day one ·
"I will give you reference images of how we want it to look."

**Pattern worth reusing:** offering the *cheap* option first with its real tradeoff stated
("retrofitting i18n later means touching every route") gets a decision instead of a
deferral.

---

### P1.3 — Scope flag + question round 2 (Claude → Drew)

Claude pushed back before answering: four independent subsystems is not one spec.
Recommended phasing (P1 marketing → P2 job board → P3 portal → P4 admin), each with its
own spec and plan. Then asked: **phasing**, **portal users**, **jobs source**, **auth method**.

**Answers:** phase it · and — the important one — *"we are building a separate project, I
can provide git so you can see how the two systems need to intertwine."* Jobs, auth, and
internal workflow live in a **separate internal repo**.

**Why this mattered:** three of the four questions were answered by one fact Claude didn't
know. The public site is a **client** of the internal system, not the owner of the schema.
Had the scaffold gone ahead after round 1, it would have built jobs tables that immediately
became a second source of truth.

**Lesson for the next build:** ask *"does another system already own this data?"* in round
one, before asking how to model it.

---

### P1.4 — SOP request (user, verbatim)

> Make a SOP folder, on how we created this website what tools, frameowrk packages, etc and prompts that help us reach the end update in real time and if something comes up that youre not sure if we need to add to SOP or instrucitons then ask me

**Outcome:** this folder. Maintenance rules in [README.md](README.md).

---

## Skills used

| Skill | When | Verdict |
|---|---|---|
| `superpowers:brainstorming` | Kickoff | Correct call. Forced classification (architectural) and blocked scaffolding until the design is approved. Its "flag multi-subsystem scope early" rule is what caught the four-subsystem problem. |

## Skills expected later

| Skill | Phase | For |
|---|---|---|
| `superpowers:writing-plans` | After spec approval | Turn the P1 spec into a reviewable implementation plan |
| `impeccable` | P1 build | Frontend/UI design work once reference images land |
| `copy-content` agent or `/copy-review` | P1 content | Marketing copy — ARSAN's existing copy is thin |
| `seo-geo-optimizer` | End of P1 | Schema, metadata, AI-search citability |
| `superpowers:verification-before-completion` | Every phase close | Evidence before claiming done |
| `/code-review` | Before each merge | Correctness pass |

## Prompt patterns that work on this project

1. **"Grill me if you need more information"** — licenses up-front interrogation. Best
   single line to open a new project with.
2. **State what you're NOT sure about.** Drew's "I will send you the git repo" answer was
   worth more than any guess Claude could have made about jobs/auth.
3. **Push back before building.** Flagging "this is four subsystems" cost one message and
   saved a scaffold.
4. **Ask about ownership before modeling.** "Does another system already own this data?"

### P1.5 — 21st.dev component paste (2026-08-20)

Drew pasted two 21st.dev component prompts (Marquee; TestimonialsSection + shadcn Avatar).
**Neither was integrated verbatim.** What the paste got wrong, for next time:

1. The marquee injected an unscoped `<style>` tag per instance — two marquees on one page
   overwrite each other's duration. Rewritten: keyframes in `globals.css`, per-instance CSS
   vars, CSS hover-pause (drops `"use client"` entirely), `aria-hidden` duplicate copy,
   reduced-motion disable.
2. The testimonials component imported `@/components/ui/infinite-slider` — **not included
   in the paste**; it would not have compiled. Rebuilt on our Marquee (vertical).
3. Demo data was joke quotes from real public figures with hotlinked avatars
   (unavatar/GitHub) — external images + real names on fake quotes. Replaced with neutral
   mock quotes in the message catalogs, monogram initials, no external requests, and the
   `@radix-ui/react-avatar` dependency dropped (zero packages added).

**Lesson:** 21st.dev pastes are starting points. Check for missing dependencies, unscoped
styles, reduced-motion, and content liabilities before integrating.

## Prompts that failed

_None yet. When one does, it goes here with what it produced and what fixed it._

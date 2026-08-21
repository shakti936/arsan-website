# ARSAN Website — Standard Operating Procedure

The build log and operating manual for the arsancg.com rebuild. It records **what we
used, why we chose it, and how to do it again** — enough that someone with no context
could rebuild this site from scratch.

**Status:** Brainstorming / pre-scaffold. No code written yet.
**Last updated:** 2026-08-20

---

## Files

| File | What it holds |
|---|---|
| [00-project-brief.md](00-project-brief.md) | Who ARSAN is, what we're building, phase plan |
| [01-decision-log.md](01-decision-log.md) | Every decision, dated, with the reasoning. Append-only. |
| [02-stack.md](02-stack.md) | Frameworks and runtime, and why each was chosen |
| [03-packages.md](03-packages.md) | Every dependency, why it's installed, install command |
| [04-setup-from-scratch.md](04-setup-from-scratch.md) | Reproducible steps to recreate this repo |
| [05-conventions.md](05-conventions.md) | Code standards, file naming, structure rules |
| [06-prompts.md](06-prompts.md) | Prompts, skills, and agents used — verbatim, with outcomes |
| [07-integrations.md](07-integrations.md) | Supabase, GHL, internal system boundary, env vars |
| [08-design-system.md](08-design-system.md) | Tokens, type scale, motion, reference images |
| [09-content-and-i18n.md](09-content-and-i18n.md) | Copy sources, EN/ES workflow |
| [10-deploy-and-ops.md](10-deploy-and-ops.md) | Vercel, DNS, CI gates, rollback |
| [11-open-questions.md](11-open-questions.md) | Unresolved items, marked blocking or not |

---

## Maintenance rules

This SOP is updated **in real time**, not at the end. Rules:

1. **A decision is not made until it's in `01-decision-log.md`.** Add the entry in the
   same work session the decision happens, with date, the options considered, and why
   the winner won.
2. **A package is not installed until it's in `03-packages.md`.** One row: package,
   version, why it's here, what breaks without it.
3. **Prompts that produced real output go in `06-prompts.md` verbatim.** Including the
   ones that failed — a prompt that wasted an hour is worth recording.
4. **Anything unresolved goes in `11-open-questions.md`** with a blocking/non-blocking
   flag, not left in chat scrollback.
5. **When it's unclear whether something belongs in the SOP — ask Drew.** Don't guess,
   and don't quietly leave it out.
6. **No secret values, ever.** Env var *names* and where they come from: yes. Values: no.
   Not in this folder, not in commits, not in prompts.

## What does NOT go in here

- Anything derivable from the code itself (component APIs, file trees, type definitions)
- Git history — that's what git is for
- Secrets, API keys, tokens, customer data, resumes

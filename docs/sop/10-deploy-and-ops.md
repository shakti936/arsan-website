# 10 — Deploy & Ops

**Last updated:** 2026-08-20 · **Status:** repo live at
`github.com/shakti936/arsan-website` (Marianna's account, Drew collaborator — mirrors
aios-arsancg). Vercel: Marianna imports the repo in her dashboard; no env vars needed for
P1. Old-host/DNS questions still open (Q-03).

## Pipeline

| Environment | Trigger | URL |
|---|---|---|
| Preview | Every branch push | Vercel per-branch preview |
| Production | Promote from `main` | TBD (arsancg.com at cutover) |

## Pre-merge gate

All three must pass before any PR opens:

```
tsc --noEmit
bunx biome check .
bun run build
```

## Cutover

**Open questions before this can be planned:**

- What is arsancg.com currently hosted on (Wix / Squarespace / WordPress / other)?
- Who controls DNS?
- Does anything on the current site need to be preserved — form submission history,
  existing URLs worth redirecting, tracking pixels already installed?

### Cutover checklist (draft)

- [ ] 301 map from old URLs → new (protects whatever ranking exists)
- [ ] Verify `robots.txt` and sitemap on the new deployment
- [ ] Analytics/tracking installed and firing before DNS change, not after
- [ ] GHL form submissions verified end-to-end on production
- [ ] Lighthouse run on production URL, not preview
- [ ] Both `en` and `es` routes resolve, `hreflang` correct
- [ ] DNS TTL lowered ahead of the switch
- [ ] Rollback: keep old host live and reachable until the new site is confirmed stable

## Monitoring

TBD. At minimum, a notification path for form-submission failures — a lead that silently
fails to reach GHL is the most expensive bug this site can have.

## Rollback

Vercel keeps prior deployments; production rollback is a promotion of the last good build.
DNS-level rollback depends on TTL — lower it before cutover.

## Sanity — before the Studio works on a deployed URL

Not done yet, and not needed until a page reads from Sanity (Batch 2). Production
currently renders from `src/content/**`, which is the correct behaviour while the dataset
is empty. Two steps, and they have to happen together or the Studio loads and then fails
every request:

1. **Vercel env vars** — `NEXT_PUBLIC_SANITY_PROJECT_ID=shop59xi` and
   `NEXT_PUBLIC_SANITY_DATASET=production`. Both are `NEXT_PUBLIC_` by design: they ship
   to the browser inside the Studio bundle and are not secrets. Add to Production and
   Preview. Without them a deployed `/studio` shows the setup panel, which is a safe
   default rather than a broken page.
2. **Sanity CORS** — add the deployed origin with `--credentials`:
   ```
   bunx sanity cors add https://<domain> --credentials --project-id shop59xi
   ```
   Vercel preview URLs are per-deployment, so previews need either a wildcard origin or a
   stable preview alias. A wildcard on a client's dataset is worth a decision, not a
   default — the Studio authenticates with cookies, and the origin allowlist is what
   stops another site from using them.

`SANITY_API_READ_TOKEN` is only needed for draft previews. It IS a secret: server-side
only, never `NEXT_PUBLIC_`.


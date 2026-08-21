# 10 — Deploy & Ops

**Last updated:** 2026-08-20 · **Status:** OPEN — current host and DNS control unknown.

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

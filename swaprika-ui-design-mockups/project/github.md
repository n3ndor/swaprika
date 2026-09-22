repo: n3ndor/swaprika
branch: main

## Last sync

date: 2026-09-22T14:42:40Z

### Updated in this project

- Recreated the Swaprika web UI as a single Design Component on the Organic design system (warm cream, no dark theme, no mascot).
- Added an enter screen: the SWAPRIKA wordmark swaps letters into ingredient names, Enter lifts a curtain into the app.
- Situation-first swap finder built from `data/seed.sql` — 21 real edges, allow-list context filtering, honest empty states.
- Public documents hub: README, ADRs 0001-0006, schema/pricing reference, contributing and the licence split.

## Screen map

| Screen | Built from |
| --- | --- |
| Enter curtain | `web/public/favicon.svg`, `README.md` (positioning copy) |
| Find a swap | `data/seed.sql`, `src/schema/enums.ts`, `web/src/components/Demo.tsx` |
| Ingredients | `data/seed.sql` |
| Documents hub / reader | `README.md`, `CONTRIBUTING.md`, `docs/adr/0001`–`0006` |

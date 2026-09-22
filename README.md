# Swaprika

What to use instead of an ingredient, and where the swap actually works.

**[swaprika.nagysolution.com](https://swaprika.nagysolution.com)**

Butter becomes oil in a cake and ruins a croissant. Pick where you are cooking and
what ran out, and Swaprika shows what to use instead, what the swap keeps, what it
loses, what you have to adjust, and where it is known to fail.

## What is in it

- 22 ingredients and 68 swaps, each tied to the situations where it works and the
  ones where it fails
- Some situations, such as laminating a croissant, have only recorded failures. The
  honest answer there is that nothing works, and the site says so
- Every card flips between what you had and what to use instead

The whole dataset lives in [`web/src/data/swaps.ts`](web/src/data/swaps.ts). It is
common kitchen knowledge, written by hand. There is no backend, no API and no
account.

## Run it

```bash
npm run setup
npm run dev
```

## Deploy

```bash
npm run deploy
```

This builds the Astro site and uploads it to Cloudflare as static assets. No Worker
script runs, and Cloudflare serves static asset requests free and unmetered, so
there are no request limits to hit.

## Stack

Astro with a single React island. The look comes from the Organic design system,
vendored as [`web/src/styles/organic.css`](web/src/styles/organic.css), with the
Swaprika layer in [`web/src/styles/app.css`](web/src/styles/app.css). All animation
is plain CSS.

[`swaprika-ui-design-mockups/`](swaprika-ui-design-mockups) is the Claude Design
handoff the interface was built from.

## History

An earlier version served this data from a GraphQL API on Cloudflare Workers and
D1, with per plan field entitlements. It is preserved at the
[`graphql-api`](https://github.com/n3ndor/swaprika/tree/graphql-api) tag.

## Licence

MIT, code and data. See [LICENSE](LICENSE).

A [Nagy Solution](https://nagysolution.com) project.

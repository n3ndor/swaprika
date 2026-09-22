# Swaprika

A GraphQL API for **context aware ingredient substitution**.

Every food API can tell you that butter can be replaced by coconut oil. None of
them can tell you that it will ruin a croissant, that you need to put water back
when you swap in oil, or what you give up when you do.

**Try it: [swaprika.nagysolution.com/graphql](https://swaprika.nagysolution.com/graphql)**
The playground opens on a working query. Add the header `x-api-key: dev-key` to
unlock the paid fields.

```graphql
query {
  ingredient(id: "butter") {
    substitutions(context: { dishType: CAKE, requires: [VEGAN] }) {
      edges {
        node { canonicalName }
        ratio { amount basis note }
        preservesRoles
        losesRoles
        effects { dimension direction note }
        adjustments { action amount reason }
        reliability
      }
    }
  }
}
```

```json
{
  "node": { "canonicalName": "Neutral oil" },
  "ratio": {
    "amount": 0.8,
    "basis": "WEIGHT",
    "note": "Butter is roughly 80 percent fat and 16 percent water. Match the fat, then put the water back."
  },
  "preservesRoles": ["FAT"],
  "losesRoles": ["CREAMED_AIR", "WATER_CONTENT"],
  "effects": [
    { "dimension": "RISE", "direction": "LESS",
      "note": "No air is beaten in, because oil cannot be creamed." }
  ],
  "adjustments": [
    { "action": "ADD_LIQUID", "amount": "About 15 percent of the butter weight",
      "reason": "Butter carries water that the oil does not." }
  ],
  "reliability": "ESTABLISHED"
}
```

Now change `dishType: CAKE` to `technique: LAMINATION` and run it again. You get
an empty list, because no vegan fat in this dataset has been verified to survive
lamination. Returning nothing is the correct answer. See
[ADR 0006](docs/adr/0006-allow-list-context-filtering.md).

## Why the data is on the edge

A substitution is not a link between two ingredients. It is a **fact about a
context**, and the same pair of ingredients has many of them. `sub-11a` and
`sub-11b` in the seed data are both buttermilk to milk plus acid: one is acid as
a leavening reagent for pancakes, the other is acid as a tenderiser in a chicken
brine. Different ratios of usefulness, different failure modes, same pair.

That is why `SubstitutionEdge` carries `ratio`, `losesRoles`, `validFor`,
`effects` and `adjustments`, instead of being an empty Relay wrapper around a
node.

## Pricing is part of the schema

Field level entitlements are declared on the field, not checked in a handler:

```ts
effects: t.field({
  type: [Effect],
  authScopes: { minPlan: 'DEVELOPER' },
  ...
})
```

A free key resolves `node`, `ratio`, `preservesRoles`, `losesRoles` and
`dietary`. It gets `null` plus an explicit authorization error for the rest, and
the free fields in the same response still resolve. Try it:

```bash
curl -s localhost:8787/graphql -H 'content-type: application/json' \
  -H 'x-api-key: free-key' \
  -d '{"query":"{ ingredient(id:\"butter\"){ substitutions(context:{dishType:CAKE}){ edges { node{canonicalName} ratio{amount} effects{dimension} } } } }"}'
```

## Running it

```bash
npm install
npm run db:reset    # create the local D1 schema
npm run db:seed     # load the curated substitution data
npm run dev         # http://localhost:8787/graphql
```

The GraphiQL playground at `/graphql` opens on a working example query.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Cloudflare Workers | Free tier covers this entirely |
| Server | GraphQL Yoga | Fetch API native, so it runs on Workers unchanged |
| Schema | Pothos | `scope-auth` makes the pricing tier a schema concern |
| Database | D1 (SQLite) | Free, no ops, and recursive CTEs are enough |
| Query layer | Drizzle | Speaks both D1 and Postgres, so the escape hatch stays open |

Decisions are written down in [docs/adr](docs/adr).

## Licence

Split deliberately.

* **Code**: MIT. See [LICENSE](LICENSE).
* **Substitution data**: CC BY-NC-SA 4.0. See [LICENSE-DATA](LICENSE-DATA).
  Commercial use requires a separate licence.

Contributions require a copyright assignment so the dual licence keeps working.
Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Status

Early. The schema and the model are settled, the dataset is 21 hand built edges
chosen because context changes the answer. Growing the dataset is the work, not
the server.

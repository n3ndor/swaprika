export interface DocBlock {
  h: string;
  ps: string[];
  code?: string;
}

export interface Doc {
  id: string;
  kicker: string;
  group: string;
  title: string;
  summary: string;
  blocks: DocBlock[];
}

/**
 * The public reading room. Rendered into the static HTML on every build, not
 * fetched, so every word is readable without an account and without JavaScript.
 */
export const DOCS: Doc[] = [
  {
    id: 'readme',
    kicker: 'Guide',
    group: 'Start here',
    title: 'What Swaprika is',
    summary: 'The idea in one page, with the query that shows why context matters.',
    blocks: [
      {
        h: 'The problem',
        ps: [
          'Every food API can tell you that butter can be replaced by coconut oil. None of them can tell you that it will ruin a croissant, that you need to put water back when you swap in oil, or what you give up when you do.',
        ],
      },
      {
        h: 'Why the data is on the edge',
        ps: [
          'A substitution is not a link between two ingredients. It is a fact about a context, and the same pair of ingredients has many of them.',
          'Two entries in the seed data are both buttermilk to milk plus acid: one is acid as a leavening reagent for pancakes, the other is acid as a tenderiser in a chicken brine. Different ratios of usefulness, different failure modes, same pair.',
        ],
      },
      {
        h: 'Try it',
        ps: [
          'Change dishType: CAKE to technique: LAMINATION and run it again. You get an empty list, because no vegan fat in this dataset has been verified to survive lamination. Returning nothing is the correct answer.',
        ],
        code: `query {
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
}`,
      },
      {
        h: 'Status',
        ps: [
          'Early. The schema and the model are settled, the dataset is 21 hand built edges chosen because context changes the answer. Growing the dataset is the work, not the server.',
        ],
      },
    ],
  },
  {
    id: 'schema',
    kicker: 'Reference',
    group: 'Start here',
    title: 'Schema and pricing tiers',
    summary: 'Field level entitlements are declared on the field, not checked in a handler.',
    blocks: [
      {
        h: 'Entitlements live in the schema',
        ps: [
          'A free key resolves node, ratio, preservesRoles, losesRoles and dietary. It gets null plus an explicit authorization error for the rest, and the free fields in the same response still resolve.',
        ],
        code: `effects: t.field({
  type: [Effect],
  authScopes: { minPlan: 'DEVELOPER' },
  ...
})`,
      },
      {
        h: 'The stack',
        ps: [
          'Cloudflare Workers for the runtime, GraphQL Yoga for the server, Pothos for the schema, D1 (SQLite) for the database and Drizzle as the query layer.',
        ],
      },
    ],
  },
  {
    id: 'adr1',
    kicker: 'ADR 0001 / accepted',
    group: 'Decisions',
    title: 'GraphQL Yoga and Pothos, not Apollo Server',
    summary: 'The durable bet is the Fetch runtime model, not the library.',
    blocks: [
      {
        h: 'Context',
        ps: [
          'The API has to run on Cloudflare Workers, expose field level entitlements per pricing plan, and survive four years without a rewrite.',
        ],
      },
      {
        h: 'Reasoning',
        ps: [
          'Yoga is built on the W3C Fetch Request/Response model, which is what Workers, Deno and Bun all converged on. It runs on Workers unchanged. Apollo Server assumes a Node shaped world and needs adapters.',
          'Pothos was chosen over SDL first and over TypeGraphQL because its scope-auth plugin expresses per plan field access as a declarative field option. That turns the pricing tier into a schema concern instead of scattered handler checks.',
        ],
      },
    ],
  },
  {
    id: 'adr2',
    kicker: 'ADR 0002 / accepted',
    group: 'Decisions',
    title: 'D1 and Drizzle, with relational child tables',
    summary: 'Zero fixed cost was a hard requirement, and the joins are the substance.',
    blocks: [
      {
        h: 'Reasoning',
        ps: [
          'D1 is free up to 5 GB, needs no operations work, and is co located with Workers. An earlier draft assumed Postgres on a VPS, which was reversed once the cost constraint became explicit.',
          'Child rows are separate tables rather than JSON blobs. JSON would have been less code, but the joins are the substance of this project and context filtering should be pushable into SQL as the dataset grows.',
        ],
      },
      {
        h: 'Known limitation',
        ps: [
          'Context filtering currently happens in the resolver, against rows already batched by DataLoader. That is one query per child table per request, not one per parent row, so there is no N+1.',
        ],
      },
    ],
  },
  {
    id: 'adr3',
    kicker: 'ADR 0003 / accepted',
    group: 'Decisions',
    title: 'Substitution is not transitive, so there are no chains',
    summary: 'A beautiful query that returns nonsense is worse than no query.',
    blocks: [
      {
        h: 'Decision',
        ps: [
          'Substitution chains and a substitutionPath field will not be built. Recursion is exposed on the taxonomy, not on substitutions.',
        ],
      },
      {
        h: 'Reasoning',
        ps: [
          'Substitutability does not compose. If A works for B in some context, and B works for C in some other context, it does not follow that A works for C in either. Two hops from butter lands somewhere no cook would go.',
          'The taxonomy is genuinely hierarchical and genuinely recursive. It demonstrates the same engineering, depth limiting, cycle handling and DataLoader batching, without shipping wrong answers.',
        ],
      },
    ],
  },
  {
    id: 'adr6',
    kicker: 'ADR 0006 / accepted',
    group: 'Decisions',
    title: 'Context filtering is an allow list, not a deny list',
    summary: 'Absence of a recorded failure is not evidence of success.',
    blocks: [
      {
        h: 'Problem found during verification',
        ps: [
          'Under a deny list, asking for LAMINATION returned coconut oil, purely because nobody had written down that coconut oil fails at lamination. The absence of a recorded failure was being treated as evidence of success. That is the exact failure mode this project exists to avoid.',
        ],
      },
      {
        h: 'Consequence',
        ps: [
          'A substitution is returned for a context only if there is a row positively recording that it works there. Asking for a technique that has not been verified returns an empty list. That looks worse in a demo and is correct.',
        ],
      },
    ],
  },
  {
    id: 'adr5',
    kicker: 'ADR 0005 / temporary',
    group: 'Decisions',
    title: 'API keys are a placeholder map',
    summary: 'Three hardcoded development keys until there is something to protect.',
    blocks: [
      {
        h: 'Current state',
        ps: ['src/context.ts maps three hardcoded development keys to plans.'],
        code: `free-key -> FREE
dev-key  -> DEVELOPER
pro-key  -> PRO`,
      },
      {
        h: 'Before any public deploy',
        ps: [
          'Keys move to D1, stored hashed, with a plan, a created_at and a revocation flag. Rate limiting moves to the Cloudflare edge. Neither blocks local development and neither changes the schema.',
        ],
      },
    ],
  },
  {
    id: 'adr4',
    kicker: 'ADR 0004 / accepted',
    group: 'Licence',
    title: 'MIT for the code, CC BY-NC-SA for the data',
    summary: 'The server is not the valuable asset. The data is.',
    blocks: [
      {
        h: 'Decision',
        ps: [
          'Code is MIT. The curated substitution dataset is CC BY-NC-SA 4.0, with commercial use available under a separate licence from the copyright holder. Open Food Facts is deliberately excluded from the core dataset.',
        ],
      },
      {
        h: 'Reasoning',
        ps: [
          'Anyone can write this server. The substitution data is the only part that is hard to copy, so the two are licensed differently. Non commercial users take it free under CC BY-NC-SA, commercial users buy a licence.',
          'Open Food Facts is ODbL, which carries share alike obligations on derived databases. USDA FoodData Central is public domain and safe to mix in freely.',
        ],
      },
      {
        h: 'Consequence that must not be forgotten',
        ps: [
          'The dual licence only works while a single party holds the rights to the whole dataset. CONTRIBUTING.md therefore requires copyright assignment from the first commit.',
        ],
      },
    ],
  },
  {
    id: 'contrib',
    kicker: 'Contributing',
    group: 'Licence',
    title: 'How to add a substitution',
    summary: 'A substitution is a claim about cooking. It needs to be falsifiable.',
    blocks: [
      {
        h: 'Copyright assignment is required',
        ps: [
          'By submitting a pull request you agree that you are the original author, that you assign copyright in your contribution to the project maintainer, and that your contribution does not include data copied from a source with incompatible terms.',
        ],
      },
      {
        h: 'Every new edge must include',
        ps: [
          'A ratio with an explicit basis, WEIGHT or VOLUME, never a bare number.',
          'What culinary roles it preserves and what it loses.',
          'At least one excluded technique or dish type, or an explicit statement that there are none.',
          'A reliability value: ESTABLISHED, SITUATIONAL or CONTESTED.',
          'If you cannot fill in losesRoles you probably do not understand the substitution well enough yet. That field is the product.',
        ],
      },
    ],
  },
];

export const DOC_GROUPS = DOCS.reduce<{ name: string; items: Doc[] }[]>((groups, doc) => {
  const existing = groups.find((g) => g.name === doc.group);
  if (existing) existing.items.push(doc);
  else groups.push({ name: doc.group, items: [doc] });
  return groups;
}, []);

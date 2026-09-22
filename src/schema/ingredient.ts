import { eq } from 'drizzle-orm';
import { builder } from './builder';
import * as s from '../db/schema';
import {
  AdjustmentAction, Allergen, CulinaryRole, DietaryConstraint, DishType,
  EffectDimension, EffectDirection, MeasurementBasis, Reliability, Technique,
} from './enums';

type IngredientRow = s.IngredientRow;
type SubstitutionRow = s.SubstitutionRow;

/** One edge of the substitution connection. `sub` carries the relationship data. */
interface SubEdgeData {
  cursor: string;
  node: IngredientRow;
  sub: SubstitutionRow;
}

// ---------------------------------------------------------------------------
// Value objects
// ---------------------------------------------------------------------------

const LocalizedName = builder.objectRef<{ locale: string; value: string }>('LocalizedName');
LocalizedName.implement({
  fields: (t) => ({
    locale: t.exposeString('locale'),
    value: t.exposeString('value'),
  }),
});

const Ratio = builder.objectRef<SubstitutionRow>('Ratio');
Ratio.implement({
  description: 'How much of the replacement to use, and on what basis.',
  fields: (t) => ({
    amount: t.exposeFloat('ratioAmount'),
    basis: t.field({ type: MeasurementBasis, resolve: (r) => r.ratioBasis as 'WEIGHT' | 'VOLUME' }),
    note: t.exposeString('ratioNote', { nullable: true }),
  }),
});

const Effect = builder.objectRef<{ dimension: string; direction: string; note: string | null }>('Effect');
Effect.implement({
  fields: (t) => ({
    dimension: t.field({ type: EffectDimension, resolve: (e) => e.dimension as never }),
    direction: t.field({ type: EffectDirection, resolve: (e) => e.direction as never }),
    note: t.exposeString('note', { nullable: true }),
  }),
});

const Adjustment = builder.objectRef<{ action: string; amount: string | null; reason: string | null }>('Adjustment');
Adjustment.implement({
  description: 'What the cook must change to make the swap work.',
  fields: (t) => ({
    action: t.field({ type: AdjustmentAction, resolve: (a) => a.action as never }),
    amount: t.exposeString('amount', { nullable: true }),
    reason: t.exposeString('reason', { nullable: true }),
  }),
});

const Source = builder.objectRef<{ kind: string; citation: string }>('Source');
Source.implement({
  fields: (t) => ({
    kind: t.exposeString('kind'),
    citation: t.exposeString('citation'),
  }),
});

const DietaryImpact = builder.objectRef<{ satisfies: string[]; introduces: string[] }>('DietaryImpact');
DietaryImpact.implement({
  fields: (t) => ({
    satisfies: t.field({ type: [DietaryConstraint], resolve: (d) => d.satisfies as never }),
    introduces: t.field({ type: [Allergen], resolve: (d) => d.introduces as never }),
  }),
});

const AvailableContexts = builder.objectRef<{
  techniques: string[];
  dishTypes: string[];
  failingTechniques: string[];
  failingDishTypes: string[];
  total: number;
}>('AvailableContexts');
AvailableContexts.implement({
  description:
    'Which questions this ingredient can answer. There are three states, not two: a context that works, a context we have positively recorded as failing, and a context we simply have no data for. A client should offer the first two and grey out the third, because "this fails here" is an answer and "we never looked" is not.',
  fields: (t) => ({
    techniques: t.field({
      type: [Technique],
      description: 'Verified to work.',
      resolve: (v) => v.techniques as never,
    }),
    dishTypes: t.field({ type: [DishType], resolve: (v) => v.dishTypes as never }),
    failingTechniques: t.field({
      type: [Technique],
      description: 'Verified to fail. Still worth asking, because the answer is useful.',
      resolve: (v) => v.failingTechniques as never,
    }),
    failingDishTypes: t.field({ type: [DishType], resolve: (v) => v.failingDishTypes as never }),
    total: t.exposeInt('total', {
      description: 'How many substitutions exist at all under the given dietary constraints.',
    }),
  }),
});

const SubstitutionScope = builder.objectRef<{
  techniques: string[]; excludedTechniques: string[];
  dishTypes: string[]; excludedDishTypes: string[];
}>('SubstitutionScope');
SubstitutionScope.implement({
  description: 'The excluded lists are the product. Butter to a vegan block is fine until you try to laminate it.',
  fields: (t) => ({
    techniques: t.field({ type: [Technique], resolve: (v) => v.techniques as never }),
    excludedTechniques: t.field({ type: [Technique], resolve: (v) => v.excludedTechniques as never }),
    dishTypes: t.field({ type: [DishType], resolve: (v) => v.dishTypes as never }),
    excludedDishTypes: t.field({ type: [DishType], resolve: (v) => v.excludedDishTypes as never }),
  }),
});

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

const SubstitutionContext = builder.inputType('SubstitutionContext', {
  description: 'Context is an argument, not a post filter. It changes which substitutions exist at all.',
  fields: (t) => ({
    technique: t.field({ type: Technique, required: false }),
    dishType: t.field({ type: DishType, required: false }),
    requires: t.field({ type: [DietaryConstraint], required: false }),
    avoidAllergens: t.field({ type: [Allergen], required: false }),
  }),
});

// ---------------------------------------------------------------------------
// Ingredient
// ---------------------------------------------------------------------------

export const Ingredient = builder.objectRef<IngredientRow>('Ingredient');

Ingredient.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    canonicalName: t.exposeString('canonicalName'),

    names: t.field({
      type: [LocalizedName],
      args: { locale: t.arg.string({ required: false }) },
      resolve: async (parent, args, ctx) => {
        const rows = await ctx.loaders.namesByIngredient.load(parent.id);
        return args.locale ? rows.filter((r) => r.locale === args.locale) : rows;
      },
    }),

    roles: t.field({
      type: [CulinaryRole],
      resolve: async (parent, _args, ctx) =>
        (await ctx.loaders.rolesByIngredient.load(parent.id)).map((r) => r.role) as never,
    }),

    allergens: t.field({
      type: [Allergen],
      resolve: async (parent, _args, ctx) =>
        (await ctx.loaders.allergensByIngredient.load(parent.id)).map((r) => r.allergen) as never,
    }),

    // Recursion belongs here, on the taxonomy. NOT on substitutions.
    parent: t.field({
      type: Ingredient,
      nullable: true,
      resolve: async (p, _a, ctx) => (p.parentId ? ctx.loaders.ingredientById.load(p.parentId) : null),
    }),

    children: t.field({
      type: [Ingredient],
      resolve: async (p, _a, ctx) => ctx.loaders.childrenByParent.load(p.id),
    }),

    availableContexts: t.field({
      type: AvailableContexts,
      description:
        'Free tier on purpose. Knowing which questions are answerable should never be behind a paywall.',
      args: { requires: t.arg({ type: [DietaryConstraint], required: false }) },
      resolve: async (parent, args, ctx) => {
        const subs = await ctx.db
          .select()
          .from(s.substitutions)
          .where(eq(s.substitutions.fromId, parent.id));

        const techniques = new Set<string>();
        const dishTypes = new Set<string>();
        const failingTechniques = new Set<string>();
        const failingDishTypes = new Set<string>();
        let total = 0;

        for (const sub of subs) {
          if (args.requires?.length) {
            const dietary = await ctx.loaders.dietaryBySub.load(sub.id);
            const satisfied = new Set(
              dietary.filter((d) => d.kind === 'SATISFIES').map((d) => d.value),
            );
            if (!args.requires.every((r) => satisfied.has(r))) continue;
          }
          total += 1;
          for (const row of await ctx.loaders.scopeBySub.load(sub.id)) {
            const works = row.included === 1;
            if (row.dimension === 'TECHNIQUE') {
              (works ? techniques : failingTechniques).add(row.value);
            } else if (row.dimension === 'DISH_TYPE') {
              (works ? dishTypes : failingDishTypes).add(row.value);
            }
          }
        }

        return {
          techniques: [...techniques],
          dishTypes: [...dishTypes],
          // A context that works for one substitution is not "failing" overall.
          failingTechniques: [...failingTechniques].filter((v) => !techniques.has(v)),
          failingDishTypes: [...failingDishTypes].filter((v) => !dishTypes.has(v)),
          total,
        };
      },
    }),

    substitutions: t.connection(
      {
        type: Ingredient,
        args: { context: t.arg({ type: SubstitutionContext, required: false }) },
        resolve: async (parent, args, ctx) => {
          const subs = await ctx.db
            .select()
            .from(s.substitutions)
            .where(eq(s.substitutions.fromId, parent.id));

          const kept: SubstitutionRow[] = [];
          for (const sub of subs) {
            const c = args.context;
            if (c) {
              const scope = await ctx.loaders.scopeBySub.load(sub.id);

              // Allow list, not deny list. We only claim a substitution works
              // where we have positively recorded that it works. Asking for a
              // technique we have not verified returns nothing, which is the
              // honest answer. A deny list would happily suggest coconut oil
              // for lamination just because nobody wrote down that it fails.
              const verifiedFor = (dimension: string, value: string) =>
                scope.some(
                  (r) => r.dimension === dimension && r.value === value && r.included === 1,
                );

              if (c.technique && !verifiedFor('TECHNIQUE', c.technique)) continue;
              if (c.dishType && !verifiedFor('DISH_TYPE', c.dishType)) continue;

              const dietary = await ctx.loaders.dietaryBySub.load(sub.id);
              if (c.requires?.length) {
                const satisfied = new Set(
                  dietary.filter((d) => d.kind === 'SATISFIES').map((d) => d.value),
                );
                if (!c.requires.every((r) => satisfied.has(r))) continue;
              }
              if (c.avoidAllergens?.length) {
                const introduced = new Set(
                  dietary.filter((d) => d.kind === 'INTRODUCES').map((d) => d.value),
                );
                if (c.avoidAllergens.some((a) => introduced.has(a))) continue;
              }
            }
            kept.push(sub);
          }

          const nodes = await ctx.loaders.ingredientById.loadMany(kept.map((k) => k.toId));
          const edges: SubEdgeData[] = [];
          kept.forEach((sub, i) => {
            const node = nodes[i];
            if (node && !(node instanceof Error)) {
              edges.push({ cursor: btoa(sub.id), node, sub });
            }
          });

          return {
            edges,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: edges[0]?.cursor ?? null,
              endCursor: edges[edges.length - 1]?.cursor ?? null,
            },
          };
        },
      },
      { name: 'SubstitutionConnection' },
      {
        name: 'SubstitutionEdge',
        description:
          'The edge carries the data. This is the whole point: a substitution is a fact about a context, not a link between two nodes.',
        fields: (t) => ({
          // Free tier
          ratio: t.field({ type: Ratio, resolve: (e) => (e as SubEdgeData).sub }),

          preservesRoles: t.field({
            type: [CulinaryRole],
            resolve: async (e, _a, ctx) =>
              (await ctx.loaders.rolesBySub.load((e as SubEdgeData).sub.id))
                .filter((r) => r.kind === 'PRESERVES')
                .map((r) => r.role) as never,
          }),

          losesRoles: t.field({
            type: [CulinaryRole],
            description: 'What the swap fails to do. More useful than what it preserves.',
            resolve: async (e, _a, ctx) =>
              (await ctx.loaders.rolesBySub.load((e as SubEdgeData).sub.id))
                .filter((r) => r.kind === 'LOSES')
                .map((r) => r.role) as never,
          }),

          dietary: t.field({
            type: DietaryImpact,
            resolve: async (e, _a, ctx) => {
              const rows = await ctx.loaders.dietaryBySub.load((e as SubEdgeData).sub.id);
              return {
                satisfies: rows.filter((r) => r.kind === 'SATISFIES').map((r) => r.value),
                introduces: rows.filter((r) => r.kind === 'INTRODUCES').map((r) => r.value),
              };
            },
          }),

          // Paid tier. The pricing model lives in the schema.
          validFor: t.field({
            type: SubstitutionScope,
            authScopes: { minPlan: 'DEVELOPER' },
            resolve: async (e, _a, ctx) => {
              const rows = await ctx.loaders.scopeBySub.load((e as SubEdgeData).sub.id);
              const pick = (dim: string, inc: number) =>
                rows.filter((r) => r.dimension === dim && r.included === inc).map((r) => r.value);
              return {
                techniques: pick('TECHNIQUE', 1),
                excludedTechniques: pick('TECHNIQUE', 0),
                dishTypes: pick('DISH_TYPE', 1),
                excludedDishTypes: pick('DISH_TYPE', 0),
              };
            },
          }),

          effects: t.field({
            type: [Effect],
            authScopes: { minPlan: 'DEVELOPER' },
            resolve: async (e, _a, ctx) => ctx.loaders.effectsBySub.load((e as SubEdgeData).sub.id),
          }),

          adjustments: t.field({
            type: [Adjustment],
            authScopes: { minPlan: 'DEVELOPER' },
            resolve: async (e, _a, ctx) => ctx.loaders.adjustmentsBySub.load((e as SubEdgeData).sub.id),
          }),

          reliability: t.field({
            type: Reliability,
            authScopes: { minPlan: 'DEVELOPER' },
            resolve: (e) => (e as SubEdgeData).sub.reliability as never,
          }),

          sources: t.field({
            type: [Source],
            authScopes: { minPlan: 'PRO' },
            resolve: async (e, _a, ctx) => ctx.loaders.sourcesBySub.load((e as SubEdgeData).sub.id),
          }),
        }),
      },
    ),
  }),
});

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

builder.queryFields((t) => ({
  ingredient: t.field({
    type: Ingredient,
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: (_root, args, ctx) => ctx.loaders.ingredientById.load(String(args.id)),
  }),

  ingredients: t.field({
    type: [Ingredient],
    description:
      'The pantry: every ingredient that has at least one recorded substitution. Categories and replacement-only ingredients are excluded, because you cannot ask "what replaces a category".',
    resolve: async (_root, _args, ctx) => {
      const rows = await ctx.db
        .selectDistinct({ id: s.substitutions.fromId })
        .from(s.substitutions);
      const loaded = await ctx.loaders.ingredientById.loadMany(rows.map((r) => r.id));
      return loaded
        .filter((i): i is s.IngredientRow => !!i && !(i instanceof Error))
        .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName));
    },
  }),

  ingredientByName: t.field({
    type: Ingredient,
    nullable: true,
    description: 'Resolves regional names to one canonical entity. cornflour and cornstarch are the same thing.',
    args: { name: t.arg.string({ required: true }) },
    resolve: async (_root, args, ctx) => {
      const hit = await ctx.db
        .select()
        .from(s.ingredientNames)
        .where(eq(s.ingredientNames.value, args.name.toLowerCase()))
        .limit(1);
      if (hit.length > 0) return ctx.loaders.ingredientById.load(hit[0].ingredientId);
      return ctx.loaders.ingredientById.load(args.name.toLowerCase());
    },
  }),

  plan: t.string({
    description: 'Which plan the current API key resolves to. Useful for debugging entitlements.',
    resolve: (_root, _args, ctx) => ctx.plan,
  }),
}));

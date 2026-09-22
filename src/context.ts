import DataLoader from 'dataloader';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { inArray } from 'drizzle-orm';
import * as s from './db/schema';

export type Plan = 'FREE' | 'DEVELOPER' | 'PRO';

const PLAN_RANK: Record<Plan, number> = { FREE: 0, DEVELOPER: 1, PRO: 2 };

export function planAtLeast(actual: Plan, required: Plan): boolean {
  return PLAN_RANK[actual] >= PLAN_RANK[required];
}

/**
 * Placeholder key store. Real keys move to D1 (hashed) before any deploy.
 * See docs/adr/0005-api-keys.md.
 */
const DEV_KEYS: Record<string, Plan> = {
  'free-key': 'FREE',
  'dev-key': 'DEVELOPER',
  'pro-key': 'PRO',
};

export function planFromRequest(request: Request): Plan {
  const key = request.headers.get('x-api-key');
  if (!key) return 'FREE';
  return DEV_KEYS[key] ?? 'FREE';
}

/**
 * Batches rows of a child table by their parent key. This is the N+1 fix:
 * one query per child table per request, not one per parent row.
 */
function groupLoader<T extends Record<string, unknown>>(
  run: (keys: readonly string[]) => Promise<T[]>,
  keyOf: (row: T) => string,
) {
  return new DataLoader<string, T[]>(async (keys) => {
    const rows = await run(keys);
    const grouped = new Map<string, T[]>();
    for (const row of rows) {
      const k = keyOf(row);
      const bucket = grouped.get(k);
      if (bucket) bucket.push(row);
      else grouped.set(k, [row]);
    }
    return keys.map((k) => grouped.get(k) ?? []);
  });
}

export function createLoaders(db: DrizzleD1Database<typeof s>) {
  return {
    ingredientById: new DataLoader<string, s.IngredientRow | null>(async (ids) => {
      const rows = await db
        .select()
        .from(s.ingredients)
        .where(inArray(s.ingredients.id, ids as string[]));
      const byId = new Map(rows.map((r) => [r.id, r]));
      return ids.map((id) => byId.get(id) ?? null);
    }),

    childrenByParent: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.ingredients)
          .where(inArray(s.ingredients.parentId, keys as string[])),
      (r) => r.parentId as string,
    ),

    namesByIngredient: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.ingredientNames)
          .where(inArray(s.ingredientNames.ingredientId, keys as string[])),
      (r) => r.ingredientId,
    ),

    rolesByIngredient: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.ingredientRoles)
          .where(inArray(s.ingredientRoles.ingredientId, keys as string[])),
      (r) => r.ingredientId,
    ),

    allergensByIngredient: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.ingredientAllergens)
          .where(inArray(s.ingredientAllergens.ingredientId, keys as string[])),
      (r) => r.ingredientId,
    ),

    rolesBySub: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.substitutionRoles)
          .where(inArray(s.substitutionRoles.substitutionId, keys as string[])),
      (r) => r.substitutionId,
    ),

    scopeBySub: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.substitutionScope)
          .where(inArray(s.substitutionScope.substitutionId, keys as string[])),
      (r) => r.substitutionId,
    ),

    dietaryBySub: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.substitutionDietary)
          .where(inArray(s.substitutionDietary.substitutionId, keys as string[])),
      (r) => r.substitutionId,
    ),

    effectsBySub: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.substitutionEffects)
          .where(inArray(s.substitutionEffects.substitutionId, keys as string[])),
      (r) => r.substitutionId,
    ),

    adjustmentsBySub: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.substitutionAdjustments)
          .where(inArray(s.substitutionAdjustments.substitutionId, keys as string[])),
      (r) => r.substitutionId,
    ),

    sourcesBySub: groupLoader(
      (keys) =>
        db
          .select()
          .from(s.substitutionSources)
          .where(inArray(s.substitutionSources.substitutionId, keys as string[])),
      (r) => r.substitutionId,
    ),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;

export interface Context {
  db: DrizzleD1Database<typeof s>;
  loaders: Loaders;
  plan: Plan;
}

export function createContext(env: { DB: D1Database }, request: Request): Context {
  const db = drizzle(env.DB, { schema: s });
  return {
    db,
    loaders: createLoaders(db),
    plan: planFromRequest(request),
  };
}

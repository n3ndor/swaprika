import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const ingredients = sqliteTable('ingredients', {
  id: text('id').primaryKey(),
  canonicalName: text('canonical_name').notNull(),
  parentId: text('parent_id'),
});

export const ingredientNames = sqliteTable('ingredient_names', {
  ingredientId: text('ingredient_id').notNull(),
  locale: text('locale').notNull(),
  value: text('value').notNull(),
});

export const ingredientRoles = sqliteTable('ingredient_roles', {
  ingredientId: text('ingredient_id').notNull(),
  role: text('role').notNull(),
});

export const ingredientAllergens = sqliteTable('ingredient_allergens', {
  ingredientId: text('ingredient_id').notNull(),
  allergen: text('allergen').notNull(),
});

export const substitutions = sqliteTable('substitutions', {
  id: text('id').primaryKey(),
  fromId: text('from_id').notNull(),
  toId: text('to_id').notNull(),
  ratioAmount: real('ratio_amount').notNull(),
  ratioBasis: text('ratio_basis').notNull(),
  ratioNote: text('ratio_note'),
  reliability: text('reliability').notNull(),
});

export const substitutionRoles = sqliteTable('substitution_roles', {
  substitutionId: text('substitution_id').notNull(),
  kind: text('kind').notNull(),
  role: text('role').notNull(),
});

export const substitutionScope = sqliteTable('substitution_scope', {
  substitutionId: text('substitution_id').notNull(),
  dimension: text('dimension').notNull(),
  value: text('value').notNull(),
  included: integer('included').notNull(),
});

export const substitutionDietary = sqliteTable('substitution_dietary', {
  substitutionId: text('substitution_id').notNull(),
  kind: text('kind').notNull(),
  value: text('value').notNull(),
});

export const substitutionEffects = sqliteTable('substitution_effects', {
  substitutionId: text('substitution_id').notNull(),
  dimension: text('dimension').notNull(),
  direction: text('direction').notNull(),
  note: text('note'),
});

export const substitutionAdjustments = sqliteTable('substitution_adjustments', {
  substitutionId: text('substitution_id').notNull(),
  action: text('action').notNull(),
  amount: text('amount'),
  reason: text('reason'),
});

export const substitutionSources = sqliteTable('substitution_sources', {
  substitutionId: text('substitution_id').notNull(),
  kind: text('kind').notNull(),
  citation: text('citation').notNull(),
});

export type IngredientRow = typeof ingredients.$inferSelect;
export type SubstitutionRow = typeof substitutions.$inferSelect;

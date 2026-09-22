-- Swaprika initial schema (SQLite / Cloudflare D1)
--
-- Design note: the RELATIONSHIPS are relational (self referencing taxonomy,
-- scope rows, effect rows) rather than JSON blobs, so that context filtering
-- can be pushed into SQL as the dataset grows, and because the joins are the
-- point of the project. See docs/adr/0002-database.md.

DROP TABLE IF EXISTS substitution_sources;
DROP TABLE IF EXISTS substitution_adjustments;
DROP TABLE IF EXISTS substitution_effects;
DROP TABLE IF EXISTS substitution_dietary;
DROP TABLE IF EXISTS substitution_scope;
DROP TABLE IF EXISTS substitution_roles;
DROP TABLE IF EXISTS substitutions;
DROP TABLE IF EXISTS ingredient_allergens;
DROP TABLE IF EXISTS ingredient_roles;
DROP TABLE IF EXISTS ingredient_names;
DROP TABLE IF EXISTS ingredients;

-- Self referencing taxonomy. This is where recursion is legitimate.
CREATE TABLE ingredients (
  id             TEXT PRIMARY KEY,
  canonical_name TEXT NOT NULL,
  parent_id      TEXT REFERENCES ingredients(id)
);
CREATE INDEX idx_ingredients_parent ON ingredients(parent_id);

-- The ajvar / lecso / sofrito problem: one entity, many regional names.
CREATE TABLE ingredient_names (
  ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
  locale        TEXT NOT NULL,
  value         TEXT NOT NULL,
  PRIMARY KEY (ingredient_id, locale, value)
);
CREATE INDEX idx_names_value ON ingredient_names(value);

CREATE TABLE ingredient_roles (
  ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
  role          TEXT NOT NULL,
  PRIMARY KEY (ingredient_id, role)
);

CREATE TABLE ingredient_allergens (
  ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
  allergen      TEXT NOT NULL,
  PRIMARY KEY (ingredient_id, allergen)
);

-- A substitution is a FACT with its own identity, not a property of a pair.
-- The same (from, to) pair has many rows, one per context.
CREATE TABLE substitutions (
  id           TEXT PRIMARY KEY,
  from_id      TEXT NOT NULL REFERENCES ingredients(id),
  to_id        TEXT NOT NULL REFERENCES ingredients(id),
  ratio_amount REAL NOT NULL,
  ratio_basis  TEXT NOT NULL CHECK (ratio_basis IN ('WEIGHT','VOLUME')),
  ratio_note   TEXT,
  reliability  TEXT NOT NULL CHECK (reliability IN ('ESTABLISHED','SITUATIONAL','CONTESTED'))
);
CREATE INDEX idx_subs_from ON substitutions(from_id);

CREATE TABLE substitution_roles (
  substitution_id TEXT NOT NULL REFERENCES substitutions(id),
  kind            TEXT NOT NULL CHECK (kind IN ('PRESERVES','LOSES')),
  role            TEXT NOT NULL,
  PRIMARY KEY (substitution_id, kind, role)
);

-- included = 1 means "valid for", included = 0 means "explicitly excluded".
-- The exclusions are the differentiator.
CREATE TABLE substitution_scope (
  substitution_id TEXT NOT NULL REFERENCES substitutions(id),
  dimension       TEXT NOT NULL CHECK (dimension IN ('TECHNIQUE','DISH_TYPE')),
  value           TEXT NOT NULL,
  included        INTEGER NOT NULL CHECK (included IN (0,1)),
  PRIMARY KEY (substitution_id, dimension, value)
);
CREATE INDEX idx_scope_lookup ON substitution_scope(dimension, value, included);

CREATE TABLE substitution_dietary (
  substitution_id TEXT NOT NULL REFERENCES substitutions(id),
  kind            TEXT NOT NULL CHECK (kind IN ('SATISFIES','INTRODUCES')),
  value           TEXT NOT NULL,
  PRIMARY KEY (substitution_id, kind, value)
);

CREATE TABLE substitution_effects (
  substitution_id TEXT NOT NULL REFERENCES substitutions(id),
  dimension       TEXT NOT NULL,
  direction       TEXT NOT NULL CHECK (direction IN ('MUCH_LESS','LESS','SAME','MORE','MUCH_MORE')),
  note            TEXT,
  PRIMARY KEY (substitution_id, dimension)
);

CREATE TABLE substitution_adjustments (
  substitution_id TEXT NOT NULL REFERENCES substitutions(id),
  action          TEXT NOT NULL,
  amount          TEXT,
  reason          TEXT,
  PRIMARY KEY (substitution_id, action)
);

CREATE TABLE substitution_sources (
  substitution_id TEXT NOT NULL REFERENCES substitutions(id),
  kind            TEXT NOT NULL,
  citation        TEXT NOT NULL,
  PRIMARY KEY (substitution_id, kind, citation)
);

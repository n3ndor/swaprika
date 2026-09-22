import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import RelayPlugin from '@pothos/plugin-relay';
import { planAtLeast, type Context, type Plan } from '../context';

/**
 * ScopeAuthPlugin must be listed first so its wrapper runs outermost.
 *
 * `minPlan` is the entire monetisation model expressed as one auth scope.
 * A paid field is declared with `authScopes: { minPlan: 'DEVELOPER' }` and the
 * pricing tier becomes part of the schema rather than a check in a handler.
 */
export const builder = new SchemaBuilder<{
  Context: Context;
  AuthScopes: {
    minPlan: Plan;
  };
}>({
  plugins: [ScopeAuthPlugin, RelayPlugin],
  scopeAuth: {
    authScopes: async (ctx) => ({
      minPlan: (required: Plan) => planAtLeast(ctx.plan, required),
    }),
  },
  relay: {},
});

builder.queryType({});

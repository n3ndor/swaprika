import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { createContext } from './context';

export interface Env {
  DB: D1Database;
}

const DEFAULT_QUERY = `# Swaprika. The query no other food API can answer.
#
# Butter in a cake is not the same problem as butter in a croissant.
# Send the header   x-api-key: dev-key   to unlock the paid fields.

query VeganButterInACake {
  ingredient(id: "butter") {
    canonicalName
    substitutions(context: { dishType: CAKE, requires: [VEGAN] }) {
      edges {
        node { canonicalName }
        ratio { amount basis note }
        preservesRoles
        losesRoles           # what it fails to do, which is the useful half
        validFor { excludedTechniques excludedDishTypes }
        effects { dimension direction note }
        adjustments { action amount reason }
        reliability
      }
    }
  }
}

# Now change dishType: CAKE to technique: LAMINATION and run it again.
#
# You get an empty list, because we have not verified any vegan fat that
# survives lamination. Every other food API would cheerfully hand you
# coconut oil and ruin your croissants.
`;

type ServerContext = Env & ExecutionContext & { request: Request };

const yoga = createYoga<ServerContext>({
  schema,
  graphqlEndpoint: '/graphql',
  landingPage: false,
  graphiql: {
    title: 'Swaprika',
    defaultQuery: DEFAULT_QUERY,
  },
  context: (serverContext) => createContext({ DB: serverContext.DB }, serverContext.request),
});

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/') {
      return Promise.resolve(Response.redirect(`${url.origin}/graphql`, 302));
    }
    return yoga.fetch(request, env, ctx) as Promise<Response>;
  },
};

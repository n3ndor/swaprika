# 0003. Substitution is not transitive, so there are no substitution chains

Status: accepted

## Context

A recursive substitution query looks impressive:

    butter -> coconut oil -> avocado oil -> olive oil

and a `substitutionPath(from: "egg", to: "flaxseed")` field looks even better in
a portfolio.

## Decision

Neither will be built. Recursion is exposed on the taxonomy, not on
substitutions.

## Reasoning

Substitutability does not compose. If A works for B in some context, and B works
for C in some other context, it does not follow that A works for C in either.
Two hops from butter lands somewhere no cook would go, and the first person who
tries it learns the data is decorative.

The taxonomy (`ingredient -> parent category -> parent`) is genuinely
hierarchical and genuinely recursive. It demonstrates exactly the same
engineering, depth limiting, cycle handling and DataLoader batching, without
shipping wrong answers.

A beautiful query that returns nonsense is worse than no query.

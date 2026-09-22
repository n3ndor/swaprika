# 0002. D1 and Drizzle, with relational child tables

Status: accepted

## Context

Zero fixed cost was a hard requirement. The project must cost nothing at zero
users.

## Decision

Cloudflare D1 (SQLite) with Drizzle. Child collections are real tables, not JSON
columns.

## Reasoning

D1 is free up to 5 GB, needs no operations work, and is co located with Workers.
An earlier draft assumed Postgres on a VPS, which was reversed once the cost
constraint became explicit. Scoping the data to the interesting core rather than
to every branded product keeps it far inside the free tier.

Drizzle speaks both D1 and Postgres, so moving later is a config change rather
than a rewrite.

Child rows (`substitution_scope`, `substitution_effects`, `substitution_roles`
and so on) are separate tables rather than JSON blobs. JSON would have been less
code, but the joins are the substance of this project and context filtering
should be pushable into SQL as the dataset grows.

## Known limitation

Context filtering currently happens in the resolver, against rows already
batched by DataLoader. That is one query per child table per request, not one
per parent row, so there is no N+1. Pushing the predicate into SQL is a later
optimisation, not a correctness fix.

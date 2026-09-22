# 0001. GraphQL Yoga and Pothos, not Apollo Server

Status: accepted

## Context

The API has to run on Cloudflare Workers, expose field level entitlements per
pricing plan, and survive four years without a rewrite.

## Decision

GraphQL Yoga for the server, Pothos for the schema.

## Reasoning

Yoga is built on the W3C Fetch Request/Response model, which is what Workers,
Deno and Bun all converged on. It runs on Workers unchanged. Apollo Server
assumes a Node shaped world and needs adapters. Yoga also carries roughly 1.06M
weekly npm downloads against Apollo Server's 222k as of late 2026.

The durable bet is not the library, it is the Fetch runtime model. Yoga is
aligned with it, Apollo Server is not.

Pothos was chosen over SDL first and over TypeGraphQL because its `scope-auth`
plugin expresses per plan field access as a declarative field option. That turns
the pricing tier into a schema concern instead of scattered handler checks.

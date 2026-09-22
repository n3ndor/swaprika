# 0005. API keys are a placeholder map until there is something to protect

Status: accepted, temporary

## Current state

`src/context.ts` maps three hardcoded development keys to plans:

    free-key -> FREE
    dev-key  -> DEVELOPER
    pro-key  -> PRO

## Reasoning

Real key issuance, hashing, rotation and per key rate limiting is a meaningful
amount of work, and none of it is needed to demonstrate that field level
entitlements work. Building it now would be cost without a user.

## Before any public deploy

Keys move to D1, stored hashed, with a `plan`, a `created_at` and a revocation
flag. Rate limiting moves to the Cloudflare edge. Neither blocks local
development and neither changes the schema, because the plan resolution is
already isolated behind `planFromRequest`.

## Billing

Deliberately not integrated. See the project notes: the entitlement engine is
the interesting half and it is free to build. The payment provider gets wired in
when somebody asks how to pay, not before.

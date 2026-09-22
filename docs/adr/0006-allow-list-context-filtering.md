# 0006. Context filtering is an allow list, not a deny list

Status: accepted

## Context

When a caller supplies `context: { technique: LAMINATION }`, which substitutions
should come back?

The first implementation used a deny list: return everything except rows
explicitly marked as excluded for that technique.

## Problem found during verification

Under a deny list, asking for `LAMINATION` returned coconut oil, purely because
nobody had written down that coconut oil fails at lamination. The absence of a
recorded failure was being treated as evidence of success. That is the exact
failure mode this project exists to avoid.

## Decision

A substitution is returned for a context only if there is a row positively
recording that it works there.

## Consequence

Asking for a technique that has not been verified returns an empty list. That
looks worse in a demo and is correct. "We do not know of one" beats a confident
wrong answer, and the explicit exclusions remain visible on the paid `validFor`
field so callers can see what is known to fail and why.

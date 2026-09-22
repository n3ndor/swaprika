# Contributing to Swaprika

Thanks for wanting to help. Please read the copyright section before opening a
pull request, because this project is dual licensed and that constrains what we
can accept.

## Copyright assignment (required)

Swaprika offers its substitution dataset under CC BY-NC-SA 4.0 for non
commercial use, and under a separate commercial licence. That dual licensing
only works if a single party holds the rights to the whole dataset.

**By submitting a pull request you agree that:**

1. You are the original author of the contribution, or you have the right to
   submit it.
2. You assign copyright in your contribution to the project maintainer, who may
   license it under both the terms in `LICENSE` / `LICENSE-DATA` and under
   separate commercial terms.
3. Your contribution does not include data copied from a source with
   incompatible terms. In particular, do NOT copy from Open Food Facts (ODbL),
   Recipe1M or Recipe1MSubs (research use only), or any commercial API.

If you cannot agree to point 2, please open an issue instead of a pull request
and we will discuss it.

## Contributing substitution data

A substitution is a claim about cooking. It needs to be falsifiable.

Every new edge must include:

* a ratio with an explicit basis (`WEIGHT` or `VOLUME`), never a bare number
* what culinary roles it preserves AND what it loses
* at least one excluded technique or dish type, or an explicit statement that
  there are none
* a reliability value (`ESTABLISHED`, `SITUATIONAL` or `CONTESTED`)

If you cannot fill in `losesRoles` you probably do not understand the
substitution well enough yet. That field is the product.

Do not add substitution chains. Substitutability is not transitive. See
`docs/adr/0003-substitution-is-not-transitive.md`.

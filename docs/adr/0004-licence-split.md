# 0004. MIT for the code, CC BY-NC-SA for the data, and no Open Food Facts in the core

Status: accepted

## Decision

Code is MIT. The curated substitution dataset is CC BY-NC-SA 4.0, with
commercial use available under a separate licence from the copyright holder.
Open Food Facts is deliberately excluded from the core dataset.

## Reasoning

The server is not the valuable asset. Anyone can write this server. The
substitution data is the only part that is hard to copy, so the two are licensed
differently.

Because the maintainer holds copyright on the dataset, it can be dual licensed:
non commercial users take it free under CC BY-NC-SA, commercial users buy a
licence. That makes the paid tier enforceable by copyright rather than only by
an API key.

Open Food Facts is ODbL, which carries share alike obligations on derived
databases. Mixing it into the core would create ambiguity about whether the
proprietary substitution data had become part of an ODbL derivative. It can be
added later behind an isolated adapter with its own licensing boundary.

USDA FoodData Central is public domain and safe to mix in freely.

## Consequence that must not be forgotten

The dual licence only works while a single party holds the rights to the whole
dataset. A contributor who submits data under CC BY-NC-SA retains copyright on
it, which silently destroys the ability to sell commercial licences.
`CONTRIBUTING.md` therefore requires copyright assignment from the first commit.
Retrofitting this means contacting every past contributor, and one refusal
poisons the dataset.

# AHDP Quoting App Handoff Package

This package contains only the completed pricing, quote output, and schema/migration files from the Codex workspace.

Copy each file into the matching path in your GitHub Desktop repo folder, replacing the existing file.

## Files to Copy

- `server/quoteCalculation.ts` -> `server/quoteCalculation.ts`
- `client/src/components/DimensionsForm.tsx` -> `client/src/components/DimensionsForm.tsx`
- `client/src/components/QuoteBuilder.tsx` -> `client/src/components/QuoteBuilder.tsx`
- `client/src/components/QuoteSummary.tsx` -> `client/src/components/QuoteSummary.tsx`
- `client/src/components/QuotePreview.tsx` -> `client/src/components/QuotePreview.tsx`
- `client/src/lib/dropdownOptions.ts` -> `client/src/lib/dropdownOptions.ts`
- `client/src/lib/quoteOutput.ts` -> `client/src/lib/quoteOutput.ts`
- `client/src/lib/scopeSummary.ts` -> `client/src/lib/scopeSummary.ts`
- `shared/schema.ts` -> `shared/schema.ts`
- `migrations/0002_add_deck_extras_quote_fields.sql` -> `migrations/0002_add_deck_extras_quote_fields.sql`

## Migration Instructions

Apply the migration in `migrations/0002_add_deck_extras_quote_fields.sql` to any real database that already has the `quotes` table.

It adds quote fields needed for:

- `stair_type`
- `fascia_length`
- `handrail_lineal_metres`
- `handrail_height`
- `balustrade_lineal_metres`
- `balustrade_finish_painted`

If you are only running with the local in-memory fallback, no manual database migration is required.

## Commands to Run After Copying

From the repo root:

```bash
npm install
npm run build
npm run dev
```

## Expected Verification Quote

Final full quote smoke test:

- Merbau 90x19 deck
- Standard Build Type
- 50m2 deck area
- Klevaklip fixings
- 140x45 joist upgrade
- Concrete post install modifier
- 10m2 fascia
- Boxed stairs, 0.9m2
- Merbau handrail, 5lm
- Stainless steel wire balustrade, 5lm
- Balustrade install labour, 5lm
- Balustrade painting/oiling, 5lm

Expected line items excluding GST:

- Deck base: `50m2 x $540 = $27,000`
- Fascia: `10m2 x $540 = $5,400`
- Klevaklip: `50m2 x $60 = $3,000`
- Joist upgrade 140x45: `50m2 x $15 = $750`
- Concrete post install adjustment: `50m2 x -$30 = -$1,500`
- Boxed stairs: `0.9m2 x $250 = $225`
- Merbau handrail: `5lm x $170 = $850`
- Stainless wire balustrade: `5lm x $230 = $1,150`
- Balustrade install: `5lm x $80 = $400`
- Balustrade finish: `5lm x $75 = $375`

Expected total ex GST: `$37,650`

Expected total inc GST: `$41,415`

## Suggested Commit Message

```text
Complete decking pricing and client quote output
```

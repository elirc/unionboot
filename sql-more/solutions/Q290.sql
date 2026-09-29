-- Why this works:
-- Appending a version is two writes, and between them the timeline is
-- briefly wrong: either no version is open or two are.
-- Wrapping both in BEGIN and COMMIT makes the pair atomic, so no reader can
-- observe that intermediate state.
-- The UPDATE targets the current row by its open end rather than by sku
-- alone, which would stamp the close date onto all three A versions.
-- Closing at 10 and opening the new version at 10 keeps the history
-- contiguous under the half-open rule, with no gap and no overlap.
-- The final SELECT is what the runtime grades; the transaction statements
-- run only for their effect.
BEGIN;
UPDATE prices
SET valid_to = 10
WHERE sku = 'A'
  AND valid_to IS NULL;
INSERT INTO prices
VALUES ('A', 10, NULL, 18);
COMMIT;
SELECT valid_from,
       valid_to,
       price
FROM prices
WHERE sku = 'A'
ORDER BY valid_from;

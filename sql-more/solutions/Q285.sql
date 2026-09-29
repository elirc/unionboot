-- Why this works:
-- This schema marks the version in force now by leaving its valid_to open,
-- so the current rows are exactly those with a NULL end.
-- IS NULL is the only test that works: valid_to = NULL would be unknown for
-- every row and return nothing.
-- On this seed a MAX(valid_from) per SKU would pick the same two rows, but
-- it would also pick a version scheduled to start in the future, which is a
-- different question.
-- valid_from is selected as well so the reader can see when each current
-- version took effect.
SELECT sku,
       valid_from,
       price
FROM prices
WHERE valid_to IS NULL
ORDER BY sku;

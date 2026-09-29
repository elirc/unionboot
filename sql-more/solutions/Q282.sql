-- Why this works:
-- Day 4 is the changeover: A's first version ends there and its replacement
-- begins there.
-- Half-open validity makes that handover unambiguous, because valid_to is
-- exclusive: 4 > 4 is false for the old row and valid_from <= 4 is true for
-- the new one, so exactly one A version matches.
-- B's first version runs from 2 to 6 and covers day 4 as well, so both SKUs
-- report a price.
-- Under a closed reading both A rows would match and the answer would have
-- three rows instead of two.
SELECT sku,
       price
FROM prices
WHERE valid_from <= 4
  AND (valid_to > 4 OR valid_to IS NULL)
ORDER BY sku;

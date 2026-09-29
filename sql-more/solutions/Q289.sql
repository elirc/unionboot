-- Why this works:
-- A scheduled version is one that has not started yet, which is simply
-- valid_from strictly greater than the as-of day.
-- valid_to plays no part: a future version may be open-ended or already have
-- a planned successor.
-- This is why an open valid_to does not by itself mean current; B's day 7
-- version is open and still in the future at day 6.
-- The ordering is by effective date first, so B's day 7 row precedes A's
-- day 8 row; sku only breaks ties.
SELECT sku,
       valid_from,
       price
FROM prices
WHERE valid_from > 6
ORDER BY valid_from,
         sku;

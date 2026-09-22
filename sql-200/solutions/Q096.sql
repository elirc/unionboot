-- Why this works:
-- julianday converts a timestamp to a real number of days, so subtracting
-- two of them gives an elapsed interval; multiplying by 24 turns days into
-- hours, and 1440 would give minutes.
-- The two events have to be on the same row before they can be subtracted,
-- which is what the self CROSS JOIN does: a is pinned to id 1 and b to id 2,
-- so exactly one combined row survives.
-- The result is real, and ROUND(...,2) trims it; the exact one-hour gap
-- arrives as the number 1.
SELECT ROUND((julianday(b.happened_at) - julianday(a.happened_at)) * 24, 2) AS hours
FROM events a
CROSS JOIN events b
WHERE a.id = 1
  AND b.id = 2;

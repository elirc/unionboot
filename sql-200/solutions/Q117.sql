-- Why this works:
-- CASE branches are ordered, so the NULL test must come first. hours=0 and
-- hours<=3 both evaluate to NULL for ticket 3, so without the leading
-- WHEN hours IS NULL the row would fall through to ELSE and be labelled
-- 'large'.
-- IS NULL is the only comparison that returns true for a NULL value.
-- After the NULL branch the boundaries are exclusive of each other by
-- order: 0 is caught before the <=3 branch can see it.
SELECT id,
       CASE
         WHEN hours IS NULL THEN 'unestimated'
         WHEN hours = 0 THEN 'none'
         WHEN hours <= 3 THEN 'small'
         ELSE 'large'
       END AS size
FROM tickets
ORDER BY id;

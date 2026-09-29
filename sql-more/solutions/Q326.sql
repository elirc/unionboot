-- Why this works:
-- Never activated means no matching activity row at all, with no condition
-- on when. NOT EXISTS expresses exactly that and needs no aggregation.
-- The correlated subquery is evaluated once per user and stops at the first
-- match, so the SELECT 1 payload is never used; only whether a row was found
-- matters.
-- Only user 4 qualifies. Q327 is this query with a day window added to the
-- subquery.
SELECT u.id
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM activity a WHERE a.user_id = u.id)
ORDER BY u.id;

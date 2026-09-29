-- Why this works:
-- The first statement blanks remote B so there is a real NULL to propagate;
-- before it, no shared key had a one-sided NULL.
-- The second statement mirrors shared values into local with a correlated
-- scalar subquery. The EXISTS guard is what restricts it to shared keys: a
-- scalar subquery that matches nothing returns NULL, so without the guard
-- local-only key D would be overwritten with NULL instead of keeping 4.
-- Because the assignment copies the remote value verbatim, B moves from 20
-- to NULL. COALESCE of remote then local value would keep 20, and that is
-- the policy this scenario deliberately rejects.
-- This is an UPDATE, not an upsert, so remote-only key E is never inserted
-- and the final table has four rows.
UPDATE remote
SET value = NULL
WHERE key = 'B';
UPDATE local
SET value = (SELECT r.value FROM remote r WHERE r.key = local.key)
WHERE EXISTS (SELECT 1 FROM remote r WHERE r.key = local.key);
SELECT key,
       value
FROM local
ORDER BY key;

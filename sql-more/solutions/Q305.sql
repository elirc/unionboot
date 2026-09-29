-- Why this works:
-- Classification needs every key from both sides, so the CTE builds the key
-- universe with UNION, which deduplicates; UNION ALL would list A, B and C
-- twice.
-- Both tables are then LEFT JOINed back onto that universe, so a missing
-- side shows up as NULL in every one of its columns.
-- The CASE branches are ordered by specificity: absence is decided on the
-- key column (l.key IS NULL, r.key IS NULL), never on the value column,
-- because key C has a NULL value on both sides while being present.
-- Once both sides are known, IS compares them null-safely, so C is 'same'.
-- Anything left over is an update. Remote is authoritative, so a key only
-- remote has is an insert and a key only local has is a delete.
WITH keys AS (
  SELECT key FROM local
  UNION
  SELECT key FROM remote
)
SELECT k.key,
       CASE
         WHEN l.key IS NULL THEN 'insert'
         WHEN r.key IS NULL THEN 'delete'
         WHEN l.value IS r.value THEN 'same'
         ELSE 'update'
       END AS action
FROM keys k
LEFT JOIN local l USING(key)
LEFT JOIN remote r USING(key)
ORDER BY k.key;

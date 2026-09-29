-- Why this works:
-- The same key universe and double LEFT JOIN as Q305, but the projection is
-- a value rather than a label.
-- Remote is authoritative: when the key exists remotely its value wins, even
-- when that value is NULL. Testing r.key IS NOT NULL asks whether remote had
-- this row at all, which is the question the policy is about.
-- COALESCE(r.value, l.value) asks a different question, whether the remote
-- value is non-NULL, and falls back to the local value for a deliberately
-- blanked remote row. Q310 is where that difference becomes visible.
-- Local-only keys keep their local value through the ELSE branch, so D
-- stays at 4 and nothing is lost.
WITH keys AS (
  SELECT key FROM local
  UNION
  SELECT key FROM remote
)
SELECT k.key,
       CASE
         WHEN r.key IS NOT NULL THEN r.value
         ELSE l.value
       END AS value
FROM keys k
LEFT JOIN local l USING(key)
LEFT JOIN remote r USING(key)
ORDER BY k.key;

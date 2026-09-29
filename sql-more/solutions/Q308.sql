-- Why this works:
-- A full mirror is two writes, and the prompt requires them to be one unit,
-- so BEGIN and COMMIT wrap them.
-- The upsert covers insert and update at once: INSERT ... SELECT brings in
-- every remote row, and ON CONFLICT(key) DO UPDATE rewrites the value of any
-- key already present. WHERE true is required before ON CONFLICT: without it
-- SQLite's parser reads ON as the start of a join and reports a syntax error
-- near DO. It filters nothing.
-- excluded is the pseudo-table holding the row the INSERT tried to write, so
-- excluded.value is the remote value, and it is copied even when NULL.
-- The DELETE then removes rows remote does not have, which is what turns a
-- merge into a mirror and is why local-only key D disappears.
BEGIN;
INSERT INTO local
SELECT *
FROM remote
WHERE true
ON CONFLICT(key) DO UPDATE SET value = excluded.value;
DELETE FROM local
WHERE NOT EXISTS (SELECT 1 FROM remote r WHERE r.key = local.key);
COMMIT;
SELECT key,
       value
FROM local
ORDER BY key;

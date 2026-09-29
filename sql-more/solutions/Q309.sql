-- Why this works:
-- Append-only is Q308's upsert with the action changed and the delete
-- removed, and nothing else.
-- DO NOTHING discards the incoming row whenever the key already exists, so
-- local B keeps 20 rather than taking remote's 25, and local C keeps its
-- NULL. Only remote-only key E is actually inserted.
-- There is no DELETE, so local-only key D survives; the result is the union
-- of both key sets with local values winning every collision.
-- WHERE true is the parser disambiguator an INSERT ... SELECT with an
-- ON CONFLICT clause needs; it selects every remote row.
-- INSERT OR REPLACE would not do this: it deletes the conflicting row first,
-- so B would end up at 25.
INSERT INTO local
SELECT *
FROM remote
WHERE true
ON CONFLICT(key) DO NOTHING;
SELECT key,
       value
FROM local
ORDER BY key;

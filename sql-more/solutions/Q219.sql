-- Why this works:
-- json_tree walks the whole document, emitting one row per node at every
-- depth, so no path has to be written for where qty might live.
-- t.key is the member name for an object member, so t.key='qty' selects the
-- quantity nodes wherever they occur.
-- t.type='integer' keeps only primitive leaves, excluding a qty that held a
-- container; t.atom is the leaf value, NULL for containers.
-- t.fullkey is SQLite's own rendering of the node path and is asserted
-- literally, so it cannot be reconstructed by hand.
SELECT b.id,
       t.fullkey,
       t.atom AS qty
FROM baskets b,
     json_tree(b.body) t
WHERE t.key = 'qty'
  AND t.type = 'integer'
ORDER BY b.id,
         t.fullkey;

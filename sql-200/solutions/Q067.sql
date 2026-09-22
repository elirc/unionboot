-- Why this works:
-- edges contains the cycle 1 -> 2 -> 3 -> 1, so a UNION ALL recursion would
-- keep rediscovering the same nodes and never terminate.
-- UNION eliminates rows already produced. The CTE has a single column, so the
-- comparison is on node alone and each node can only be added once; the node
-- set is finite, so the loop ends.
-- VALUES(1) is the anchor: a literal starting row with no table behind it.
-- Node 4 is reachable through 2, so the closure is 1, 2, 3 and 4.
WITH RECURSIVE reach(node) AS (
  VALUES(1)
  UNION
  SELECT e.dst
  FROM edges e
  JOIN reach r ON e.src = r.node
)
SELECT node
FROM reach
ORDER BY node;

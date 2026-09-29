-- Why this works:
-- Empty arrays must survive, so the expansion is an outer join rather than
-- the comma lateral join that silently drops them.
-- There is no column to match on, because json_each is already parameterised
-- by b.body, so the join condition is the constant true.
-- Basket 2 therefore keeps one row with every json_each column NULL, which
-- is the expected {"id":2,"tag":null}.
-- Ordering by b.id first keeps that NULL row in position even though NULL
-- sorts before every number in j.key.
SELECT b.id,
       j.value AS tag
FROM baskets b
LEFT JOIN json_each(b.body, '$.tags') j ON true
ORDER BY b.id,
         j.key;

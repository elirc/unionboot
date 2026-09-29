-- Why this works:
-- (tenant, id) in parentheses is a row value: SQLite compares the whole
-- tuple against each tuple in the list, so exactly the pairs (1,2) and
-- (2,1) match.
-- The alternative the prompt rules out, tenant IN (1,2) AND id IN (2,1),
-- asks for every combination of the two lists -- four pairs -- and returns
-- three rows on this seed instead of two.
-- Row values keep the two columns bound together, which is the same idea the
-- composite key and the composite foreign key express in the schema.
SELECT tenant,
       id,
       title
FROM projects
WHERE (tenant, id) IN ((1, 2), (2, 1))
ORDER BY tenant, id;

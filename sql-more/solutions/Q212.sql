-- Why this works:
-- json_each is a table-valued function: put in the FROM clause it turns the
-- array at '$.tags' into one row per element.
-- The comma join is a lateral inner join, so json_each sees b.body for each
-- basket, and basket 2 with its empty array contributes no rows at all.
-- j.key is the zero-based array index and j.value the element, so nothing
-- has to be computed to produce position and tag.
-- Duplicates are preserved: basket 1 emits red at positions 0 and 2.
SELECT b.id,
       j.key AS position,
       j.value AS tag
FROM baskets b,
     json_each(b.body, '$.tags') j
ORDER BY b.id,
         j.key;

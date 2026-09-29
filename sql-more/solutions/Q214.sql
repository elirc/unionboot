-- Why this works:
-- The question is about the vocabulary of tags, not about occurrences, so
-- the exploded rows are collapsed with DISTINCT.
-- Basket 1 emits red twice and blue once, basket 3 emits blue; after
-- DISTINCT only blue and red remain.
-- Basket 2 contributes nothing, and since the id is not selected its absence
-- changes no output row.
-- ORDER BY tag sorts the surviving values alphabetically, using the alias
-- rather than repeating the expression.
SELECT DISTINCT j.value AS tag
FROM baskets b,
     json_each(b.body, '$.tags') j
ORDER BY tag;

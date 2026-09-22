-- Why this works:
-- UNION concatenates the two branches and then removes duplicate rows, so
-- Bo's three occurrences collapse to one.
-- Set operators compare rows with not-distinct semantics, under which two
-- NULLs count as the same value. That is why the three NULLs become one row,
-- even though NULL = NULL is unknown everywhere else in SQL.
-- The ORDER BY belongs to the whole compound and is written once, after the
-- final branch. SQLite sorts NULL before every non-NULL value ascending,
-- which gives the NULL-first order the prompt asks for.
SELECT name FROM spring
UNION
SELECT name FROM autumn
ORDER BY name;

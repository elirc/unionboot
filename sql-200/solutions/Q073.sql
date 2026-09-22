-- Why this works:
-- INTERSECT keeps the distinct rows present on both sides. Bo is in both, so
-- it appears once however many copies each table holds.
-- NULL is in both as well, and set operators treat two NULLs as the same
-- value, so the shared NULL is a member of the intersection. A join on
-- s.name = a.name would have dropped it, because = is unknown for NULL.
-- Ada and Cy are spring-only and Dee is autumn-only, so none of them qualify.
SELECT name FROM spring
INTERSECT
SELECT name FROM autumn
ORDER BY name;

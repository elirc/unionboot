-- Why this works:
-- The predicate is moved into the select list instead of into WHERE, so its
-- raw three-valued result is reported for every row rather than used to
-- filter.
-- SQLite has no boolean storage type: true is the integer 1, false is 0, and
-- unknown is NULL.
-- OR follows three-valued rules. Row 2 is 1 because unknown OR true is true
-- whatever the unknown turns out to be; row 6 is NULL because false OR
-- unknown cannot be decided; row 4 is NULL because neither side is known.
-- No COALESCE, because the NULLs are the answer.
SELECT id,
       (a = 5 OR b = 2) AS truth
FROM measures
ORDER BY id;

-- Why this works:
-- LEAD(day) is a window function: it reads the value of day from the next
-- row in the window's order without collapsing any rows.
-- Subtracting the current day gives the distance to the next visit, so
-- 1,2,4 produce gaps 1 and 2.
-- The last row has no successor, so LEAD returns NULL and NULL minus day is
-- NULL; that is the expected final gap, not an error.
-- The window's ORDER BY day decides what "next" means; the statement's own
-- ORDER BY day decides the order of the output.
SELECT day,
       LEAD(day) OVER (ORDER BY day) - day AS gap
FROM visits
ORDER BY day;

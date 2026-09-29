-- Why this works:
-- An inner join on key restricts the rows to the shared keys A, B and C.
-- The prompt asks for keys whose values are both known, so the two
-- IS NOT NULL tests drop key C before the subtraction happens.
-- Without them the row for C would still appear, with delta NULL, because
-- any arithmetic involving NULL yields NULL rather than an error.
-- Zero differences are kept on purpose: key A gives delta 0, which is a real
-- answer -- checked and identical -- not an absence.
-- delta is remote minus local, the direction the prompt states.
SELECT l.key,
       r.value - l.value AS delta
FROM local l
JOIN remote r USING(key)
WHERE l.value IS NOT NULL
  AND r.value IS NOT NULL
ORDER BY l.key;

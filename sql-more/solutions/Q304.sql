-- Why this works:
-- Same join as Q303, opposite operator. IS is null-safe equality, so
-- NULL IS NULL is true and key C counts as unchanged.
-- That is the whole exercise: with = instead of IS, key C's comparison is
-- NULL, the WHERE clause treats it as false, and the result loses a row.
-- A and C are the two keys whose values agree under this reading; B (20 vs
-- 25) is excluded.
-- Only key is projected, so no alias disambiguation is needed here.
SELECT l.key
FROM local l
JOIN remote r USING(key)
WHERE l.value IS r.value
ORDER BY l.key;

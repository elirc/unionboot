-- Why this works:
-- IS NULL is the only test that matches a missing value; email=NULL would
-- be unknown for every row and delete nothing at all.
-- One row, id 4, is removed, and the duplicates are deliberately left in
-- place: this variant is about NULL hygiene, not about deduplication.
-- The graded SELECT then reports the six remaining rows in id order.
DELETE FROM raw
 WHERE email IS NULL;
SELECT id, email
FROM raw
ORDER BY id;

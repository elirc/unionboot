-- Why this works:
-- The as-of date is a literal, not date('now'): the result has to be
-- reproducible, so nothing reads the wall clock.
-- Both sides of the subtraction are reduced to whole days first. julianday
-- of date(happened_at) drops the time, so id 1 at 23:30 on 28 February is
-- five calendar days before 4 March; using the raw timestamp would give
-- 4.02 days and CAST would floor that to 4.
-- CAST to INTEGER is safe here because every difference is already whole.
-- The WHERE cutoff removes id 5, which is in December and would otherwise
-- report a negative age.
SELECT id,
       CAST(julianday('2024-03-04') - julianday(date(happened_at)) AS INTEGER) AS age_days
FROM events
WHERE date(happened_at) <= '2024-03-04'
ORDER BY id;

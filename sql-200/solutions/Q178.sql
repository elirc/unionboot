-- Why this works:
-- DISTINCT deduplicates the projected rows, so the unit of uniqueness is
-- the (name,email) pair that is actually selected - the id is not in the
-- output and therefore cannot keep two rows apart.
-- The two identical Bo rows collapse into one; 'Ada' and 'ada' do not,
-- because DISTINCT compares with BINARY collation.
-- For DISTINCT, two NULLs count as the same value, which is the opposite of
-- what = does; only one Cy row exists here, so nothing depends on it.
-- BINARY ordering puts every upper-case letter before every lower-case one,
-- which is why 'ada' sorts after 'Dee'.
SELECT DISTINCT name, email
FROM raw
ORDER BY name, email;

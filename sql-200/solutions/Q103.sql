-- Why this works:
-- The same instr/substr/lower expression turns each email into its domain.
-- GROUP BY domain reuses the SELECT alias, which SQLite permits; the three
-- example.com rows collapse into one group.
-- COUNT(*) counts rows inside each group, not distinct values.
-- The WHERE clause runs before grouping, so the NULL email never forms a
-- group of its own.
-- ORDER BY domain sorts the group keys with the default BINARY collation.
SELECT lower(substr(email, instr(email, '@') + 1)) AS domain,
       COUNT(*) AS contacts
FROM contacts
WHERE email IS NOT NULL
GROUP BY domain
ORDER BY domain;

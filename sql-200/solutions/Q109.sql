-- Why this works:
-- || is SQLite's string concatenation operator, and it propagates NULL:
-- if any operand is NULL the whole expression is NULL.
-- Row 4 has a NULL email, so COALESCE(lower(email),'no-email') supplies a
-- string before the concatenation can be poisoned.
-- COALESCE returns its first non-NULL argument, so rows with an email are
-- unaffected by it.
-- trim() and lower() do the same normalisation as Q101.
SELECT id,
       trim(name) || ' <' || COALESCE(lower(email), 'no-email') || '>' AS display
FROM contacts
ORDER BY id;

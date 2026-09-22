-- Why this works:
-- In LIKE, _ means "any single character", so '%_%' would match every
-- non-empty label.
-- ESCAPE '!' names ! as the escape character for this comparison, so !_
-- means a literal underscore.
-- '%!_%' is therefore "anything, a real underscore, anything": a_b and _
-- match, axb and ab do not.
-- The escape character is arbitrary; it only has to appear in the pattern
-- and in the ESCAPE clause.
SELECT id,
       label
FROM labels
WHERE label LIKE '%!_%' ESCAPE '!'
ORDER BY id;

-- Why this works:
-- The uniqueness rule is about a normalized form of the email, not the raw
-- text, so the normalization is declared as a generated column and UNIQUE
-- is placed on that column.
-- lower(trim(email)) strips the surrounding spaces of the first address and
-- folds its case, giving ada@x.
-- The integrity probe inserts ADA@X, which normalizes to the same value and
-- raises UNIQUE constraint failed on the generated column.
-- SQLite lower is ASCII-only, so this policy catches ADA@X but would not
-- catch an accented duplicate; the prompt calls that out.
CREATE TABLE emails(
  id INTEGER PRIMARY KEY,
  email TEXT,
  normalized TEXT AS (lower(trim(email))) UNIQUE
);
INSERT INTO emails(id, email)
VALUES (1, ' Ada@x '),
       (2, 'Bo@x');
SELECT id,
       normalized
FROM emails
ORDER BY id;

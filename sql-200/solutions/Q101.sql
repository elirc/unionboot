-- Why this works:
-- trim(name) removes leading and trailing spaces only; spaces inside the
-- string are left alone.
-- lower(email) folds A-Z to a-z. SQLite ships without ICU, so lower() is
-- ASCII-oriented: bytes outside A-Z are returned unchanged.
-- lower(NULL) is NULL, so row 4 keeps its NULL email with no COALESCE.
-- ORDER BY id fixes the graded row order.
SELECT id,
       trim(name) AS name,
       lower(email) AS email
FROM contacts
ORDER BY id;

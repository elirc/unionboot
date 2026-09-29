-- Why this works:
-- This scenario asks about the schema rather than the data, so no rows are
-- inserted at all.
-- pragma_table_xinfo is the table-valued form of PRAGMA table_xinfo, and it
-- is the extended variant: plain table_info omits VIRTUAL generated columns.
-- Its hidden column is 0 for an ordinary column, 2 for VIRTUAL and 3 for
-- STORED, so WHERE hidden>0 keeps exactly the generated ones.
-- ORDER BY cid returns them in declaration order, v before s, which is what
-- the expected rows require even though cid is not selected.
CREATE TABLE calc(
  qty INTEGER,
  price INTEGER,
  v INTEGER AS (qty*price) VIRTUAL,
  s INTEGER AS (qty*price) STORED
);
SELECT name,
       hidden
FROM pragma_table_xinfo('calc')
WHERE hidden > 0
ORDER BY cid;

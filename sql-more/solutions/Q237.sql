-- Why this works:
-- A generated column can promote a JSON member to a real typed column, so
-- the rest of the schema can index and constrain it like any other.
-- The expression json_extract(body,'$.qty') is row-local, which is the only
-- kind of expression a generated column may use.
-- Document 2 has no qty member, so json_extract returns SQL NULL and the
-- column is null; the declared INTEGER type does not turn that into 0.
-- Nothing is written for qty, and the values track body if it is updated.
CREATE TABLE records(
  id INTEGER PRIMARY KEY,
  body TEXT,
  qty INTEGER AS (json_extract(body, '$.qty'))
);
INSERT INTO records(id, body)
VALUES (1, '{"qty":2}'),
       (2, '{}');
SELECT id,
       qty
FROM records
ORDER BY id;

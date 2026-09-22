-- Why this works:
-- The CREATE INDEX is a real statement that changes the schema, and the
-- EXPLAIN that follows sees the new index; only the last statement's rows
-- are graded, so the plan is the answer.
-- With an index on status, the same query from Q192 becomes
-- SEARCH ... USING INDEX orders2_status (status=?): SQLite seeks into the
-- index instead of reading the table.
-- The index name appears in the plan text, so the name you choose is part
-- of the expected output.
-- Rows still have to be fetched from the table afterwards, because the
-- query selects * and the index holds only status; contrast Q194.
CREATE INDEX orders2_status ON orders2(status);
EXPLAIN QUERY PLAN
SELECT * FROM orders2 WHERE status = 'paid';

-- Why this works:
-- Two grouping keys produce one row per observed region/status combination;
-- combinations that never occur in the data are simply never formed, which is
-- why six rows come back rather than four regions times three statuses.
-- COUNT(*) is the row count of each combination.
-- South/pending has only a NULL amount, so SUM returns NULL there; the prompt
-- asks for a zero-filled total, so COALESCE supplies the 0 that Q021
-- deliberately left as null.
SELECT region,
       status,
       COUNT(*) AS entries,
       COALESCE(SUM(amount), 0) AS total
FROM sales
GROUP BY region, status
ORDER BY region, status;

-- Why this works:
-- No WHERE clause: the prompt sums every status, so the pending 100 and the
-- refund of -10 are both included and North nets to 30.
-- SUM skips NULL inputs rather than propagating them, so West sums to 5 from
-- its single known amount.
-- South has only a NULL amount, and SUM over no surviving values is NULL, not
-- 0, which is the "retaining SQL NULL" the prompt asks for. Wrapping this in
-- COALESCE would break the expected row.
-- ORDER BY region gives the alphabetical order the comparison requires.
SELECT region,
       SUM(amount) AS total
FROM sales
GROUP BY region
ORDER BY region;

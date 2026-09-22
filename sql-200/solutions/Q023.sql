-- Why this works:
-- Two filters at two different stages. WHERE status='paid' removes rows
-- before grouping; HAVING inspects each finished bucket and keeps the ones
-- whose total reaches 30.
-- HAVING is the only place an aggregate may be tested: WHERE runs before any
-- group exists, so SUM is not yet defined there.
-- West's paid total is 5 and is discarded as a group, while South was already
-- gone because it has no paid row at all.
SELECT region,
       SUM(amount) AS total
FROM sales
WHERE status = 'paid'
GROUP BY region
HAVING SUM(amount) >= 30
ORDER BY region;

-- Why this works:
-- This is a semi-join: the basket is the answer, the tag is only a test, so
-- the expansion belongs inside EXISTS rather than in the outer FROM.
-- Joining to json_each instead would return basket 1 twice, once per red
-- tag, and the prompt forbids duplicating baskets.
-- EXISTS stops as soon as one matching element is found and contributes no
-- columns of its own.
-- The correlated reference b.body is what makes the subquery run per basket.
SELECT id
FROM baskets b
WHERE EXISTS (SELECT 1
              FROM json_each(b.body, '$.tags')
              WHERE value = 'red')
ORDER BY id;

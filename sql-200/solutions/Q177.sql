-- Why this works:
-- The partition key is lower(name), not the email, so the competing rows
-- are 'Cy' (no email) and 'cy' (an email) - a different pairing from Q172.
-- The window keeps the most recent row per name, so 'cy' at 2024-01-05
-- beats 'Cy' at 2024-01-04 and the surviving row does have an email.
-- Because a whole row is selected rather than an aggregate, the stored
-- spelling of the winner is reported: 'ada', 'cy', 'dee'.
WITH r AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY lower(name) ORDER BY seen_at DESC, id DESC) AS n
  FROM raw
)
SELECT id, name, email
FROM r
WHERE n = 1
ORDER BY id;

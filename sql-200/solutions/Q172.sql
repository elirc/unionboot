-- Why this works:
-- Same shape as Q171 with the keep policy inverted: the window is ordered
-- newest first, so n=1 is now the most recent row per email.
-- seen_at is an ISO-8601 date string, and ISO dates sort correctly as text,
-- so ORDER BY seen_at DESC needs no date parsing.
-- id DESC is the tiebreak; the dates happen to be distinct here, but
-- without a second key a tie would make which row survives unspecified.
-- The surviving ids are 2,3,4,5,7 - ordered by id in the output, not by
-- recency.
WITH r AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY lower(email) ORDER BY seen_at DESC, id DESC) AS n
  FROM raw
)
SELECT id, email
FROM r
WHERE n = 1
ORDER BY id;

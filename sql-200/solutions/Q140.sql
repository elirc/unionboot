-- Why this works:
-- The conflict target must match a unique index, and here that index is the
-- composite primary key, so both columns are named: ON CONFLICT(bucket,name).
-- Naming only one column would be an error, because neither bucket nor name
-- is unique on its own: 'hits' appears in both buckets.
-- The incoming ('day','hits',3) matches the existing ('day','hits',2) pair
-- and the DO UPDATE adds the two values to give 5; ('week','hits',8) is a
-- different pair and is untouched.
CREATE TABLE counters(
  bucket TEXT,
  name TEXT,
  value INTEGER,
  PRIMARY KEY(bucket, name)
);
INSERT INTO counters VALUES('day', 'hits', 2), ('week', 'hits', 8);
INSERT INTO counters VALUES('day', 'hits', 3)
  ON CONFLICT(bucket, name) DO UPDATE
    SET value = counters.value + excluded.value;
SELECT bucket, name, value
FROM counters
ORDER BY bucket, name;

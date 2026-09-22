-- Why this works:
-- group_concat(value,separator) is an aggregate: with no GROUP BY it folds
-- every row into a single text value, so the result is one row.
-- group_concat has no ORDER BY argument in this SQLite build, so the input
-- is ordered first inside a subquery and the aggregate consumes the rows in
-- that order. This is SQLite 3.49.1 behaviour, not a portable guarantee.
-- The subquery also does the trimming, so the aggregate sees 'Ada', not
-- ' Ada '.
SELECT group_concat(name, ',') AS roster
FROM (SELECT trim(name) AS name
      FROM contacts
      ORDER BY id DESC);

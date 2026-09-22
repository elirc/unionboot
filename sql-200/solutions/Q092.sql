-- Why this works:
-- Timestamps are stored as ISO text, and ISO text sorts chronologically, so
-- the filter is a plain string comparison and needs no date function at all.
-- The range is half-open: inclusive at the February start, exclusive at the
-- March start. That covers every moment of 29 February whatever its time.
-- A closed BETWEEN ending at '2024-02-29' would drop id 2, because the
-- string '2024-02-29 00:30:00' is greater than '2024-02-29'.
-- Leaving happened_at unwrapped also keeps the column usable by an index.
SELECT id
FROM events
WHERE happened_at >= '2024-02-01'
  AND happened_at < '2024-03-01'
ORDER BY id;

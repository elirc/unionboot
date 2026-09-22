-- Why this works:
-- The 'unixepoch' modifier tells SQLite to read the number as seconds since
-- 1970-01-01 UTC. It has to be stated: without it a bare number is taken as
-- a Julian day count, which for these values is outside the supported range,
-- so datetime() returns NULL rather than raising an error.
-- datetime() then formats the full timestamp, so 0 renders as the epoch
-- itself and 86400 as one day later.
-- No time zone is involved; the output is UTC because the epoch is defined
-- in UTC and SQLite applies no local conversion.
SELECT seconds,
       datetime(seconds, 'unixepoch') AS utc
FROM epochs
ORDER BY seconds;

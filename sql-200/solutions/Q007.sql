-- Why this works:
-- Joining people to itself under two aliases lets one row of the result hold
-- two different people.
-- a.team_id = b.team_id groups teammates; because NULL never equals NULL,
-- Dee is excluded automatically and no extra IS NOT NULL test is needed.
-- a.id < b.id does two jobs at once: it forbids pairing someone with
-- themselves, and it keeps only one of the two orderings of each pair.
-- Only Ada and Bo share a team, so exactly one row survives.
SELECT a.name AS first,
       b.name AS second
FROM people a
JOIN people b ON a.team_id = b.team_id AND a.id < b.id
ORDER BY a.id, b.id;

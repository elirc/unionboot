-- Why this works:
-- Omitting PARTITION BY makes the window the whole table, so the ranking is
-- global rather than per team.
-- RANK shares a number across ties and then skips, producing 1,2,2,4,4,6,7:
-- two players on 90 take places 2 and 2, so place 3 is never used, and the
-- two on 80 take 4 and 4.
-- The result order repeats score DESC with an id tiebreak so that the tied
-- pairs come back in a fixed sequence.
SELECT name,
       RANK() OVER (ORDER BY score DESC) AS place
FROM scores
ORDER BY score DESC, id;

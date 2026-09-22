-- Why this works:
-- ROW_NUMBER assigns 1,2,3,... inside each partition and never repeats a
-- number, so equal scores still get different places.
-- PARTITION BY team restarts the numbering for team B.
-- The window's ORDER BY score DESC,id is the walking order: score decides the
-- place and id breaks the Bo/Cy and Eli/Flo ties deterministically. Without
-- the id key the assignment within a tie would be arbitrary.
-- The statement's own ORDER BY team,place is a separate clause that fixes the
-- order of the returned rows.
SELECT team,
       name,
       ROW_NUMBER() OVER (PARTITION BY team ORDER BY score DESC, id) AS place
FROM scores
ORDER BY team, place;

-- Why this works:
-- DENSE_RANK numbers distinct score levels rather than rows, so it never
-- leaves a gap: team A reads 1,2,2,3 where RANK read 1,2,2,4.
-- Bo and Cy share level 2 because their scores are equal; Dee is the third
-- distinct score and so gets 3.
-- Like Q042 the window orders by score only, since a unique tiebreak would
-- destroy the ties this function exists to show.
SELECT team,
       name,
       DENSE_RANK() OVER (PARTITION BY team ORDER BY score DESC) AS place
FROM scores
ORDER BY team, id;

-- Why this works:
-- RANK gives every row with the same ordering key the same number, then
-- resumes at the row's position, leaving a gap. Team A reads 1,2,2,4: Dee is
-- the fourth row, so her rank is 4 and no row is ranked 3.
-- The window deliberately orders by score alone. Adding id as a second key
-- would make every key unique, no rows would tie, and RANK would behave
-- exactly like ROW_NUMBER.
-- The result is returned in id order, which is not the ranking order; the two
-- ORDER BY clauses are independent.
SELECT team,
       name,
       RANK() OVER (PARTITION BY team ORDER BY score DESC) AS place
FROM scores
ORDER BY team, id;

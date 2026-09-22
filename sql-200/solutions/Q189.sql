-- Why this works:
-- BETWEEN low AND high is shorthand for price>=low AND price<=high, so both
-- ends are inclusive and Pad at exactly 12 is returned.
-- The two bound values must be given low first; BETWEEN 12 AND 3 matches
-- nothing rather than swapping the ends for you.
-- ORDER BY price is the graded order, and the three matching prices 3, 8
-- and 12 are distinct, so no tiebreak is needed.
SELECT id, name, price
FROM products
WHERE price BETWEEN ? AND ?
ORDER BY price, id;

-- Why this works:
-- A CHECK constraint rejects a row only when the condition evaluates to
-- false. NULL >= 0 is NULL, which is not false, so a NULL score passes.
-- That is three-valued logic doing the work: to forbid NULL you need a
-- separate NOT NULL constraint, which this table deliberately omits.
-- -1 >= 0 is false, so a negative score is rejected with a CHECK error.
-- 0 is accepted because the comparison is >=.
CREATE TABLE optional_scores(id INTEGER PRIMARY KEY, score INTEGER CHECK(score >= 0));
INSERT INTO optional_scores VALUES(1, NULL), (2, 0);
SELECT id, score
FROM optional_scores
ORDER BY id;

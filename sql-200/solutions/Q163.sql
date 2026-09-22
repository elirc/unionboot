-- Why this works:
-- LEAD(day,1) and LEAD(day,2) look one and two rows ahead in day order, so
-- each row can see the two visits that follow it.
-- A run of three consecutive days starts here exactly when those two values
-- are day+1 and day+2.
-- Window functions cannot appear in WHERE, because WHERE runs before the
-- window is computed, so the offsets are produced in a subquery and filtered
-- outside it.
-- Days 5 and 6 also belong to the run but do not start one: for day 5 the
-- second lead is 9. Only day 4 qualifies.
SELECT day
FROM (SELECT day,
             LEAD(day, 1) OVER (ORDER BY day) AS d1,
             LEAD(day, 2) OVER (ORDER BY day) AS d2
      FROM visits)
WHERE d1 = day + 1
  AND d2 = day + 2
ORDER BY day;

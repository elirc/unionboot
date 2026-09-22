-- Why this works:
-- LEFT JOIN preserves every row of the left table, people, whether or not a
-- team matches. Unmatched people keep their own columns and receive NULL for
-- every column of teams, so Dee (team_id NULL) and Eli (dangling team_id 99)
-- both survive with label NULL.
-- The ON condition is unchanged from the inner-join variant; only the join
-- keyword differs, which is why the answer grows from three rows to five.
SELECT p.name,
       t.label
FROM people p
LEFT JOIN teams t ON t.id = p.team_id
ORDER BY p.id;

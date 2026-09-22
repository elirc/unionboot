-- Why this works:
-- Inner JOIN keeps a person only when a team row satisfies the ON condition.
-- Dee has team_id NULL, and NULL = t.id is unknown, never true, so Dee drops.
-- Eli has team_id 99 and no team carries that id, so Eli drops too.
-- Team Red (id 30) is unmatched, and an inner join preserves neither side.
-- ORDER BY p.id makes the row order deterministic, which the exact-order
-- comparison requires.
SELECT p.name,
       t.label
FROM people p
JOIN teams t ON t.id = p.team_id
ORDER BY p.id;

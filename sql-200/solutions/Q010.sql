-- Why this works:
-- teams drives the LEFT JOIN so that empty teams reach the GROUP BY.
-- Red matches nobody, so the join leaves it with one row whose p columns are
-- all NULL. COUNT(p.id) ignores NULL arguments and reports 0 for that group,
-- whereas COUNT(*) would count the padded row and report 1.
-- Grouping by t.id as well as t.label keeps the grouping keyed on the primary
-- key, so two teams sharing a label would still be counted separately.
SELECT t.label,
       COUNT(p.id) AS members
FROM teams t
LEFT JOIN people p ON t.id = p.team_id
GROUP BY t.id, t.label
ORDER BY t.id;

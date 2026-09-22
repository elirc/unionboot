# Join preservation and matching — sql-200 Q001–Q010

**What you practise:** choosing a join shape that keeps exactly the rows a requirement says must survive, and knowing which side of the query decides that.
**Prerequisites:** `SELECT ... FROM ... WHERE`; table aliases (`people p`); the idea that a foreign key column may be NULL or may point at a row that does not exist.
**Exercises:** Q001: inner-match-only, Q002: left-preserve-every-person, Q003: left-preserve-every-team, Q004: full-outer-emulation, Q005: on-filter-preserves-left, Q006: where-filter-rejects-unmatched, Q007: self-join-unique-teammate-pairs, Q008: cross-join-small-assignment-grid, Q009: unmatched-including-dangling-fk, Q010: empty-team-count-zero.

## The problem in plain words

Two tables describe the same small world. `people` holds five rows, each with an optional `team_id`. `teams` holds three rows. The link between them is `people.team_id = teams.id`, and that link is deliberately imperfect: Dee has `team_id` NULL, Eli has `team_id` 99, and no team with id 99 exists. Team Red (id 30) has nobody pointing at it.

Every exercise in this family asks for the same two facts — a person's name and a team's label — but with a different rule about which rows are allowed to disappear. That rule is "preservation": which side of the join is guaranteed to contribute every one of its rows to the answer, even when it has no partner.

There is a second decision hidden in the family, and it catches more juniors than the first: a filter written in `ON` and the same filter written in `WHERE` mean different things once the join is outer. `ON` decides what counts as a match. `WHERE` decides which of the already-joined rows survive — including the ones the outer join invented with NULLs.

Note that the seed says `foreign_keys=ON`, yet Eli's team id 99 is stored happily. That is because `people.team_id` is declared as a plain `INTEGER`, with no `REFERENCES teams(id)` clause. Foreign-key enforcement only applies to declared foreign keys, so a "dangling" id is legal here and the queries must cope with it.

## The contract you must honour

Taken from `prompts/Q001.txt`–`Q010.txt` and `tests/Q001.cjs`–`Q010.cjs`. Every exercise in the family shares one seed:

```sql
CREATE TABLE people(id INTEGER PRIMARY KEY, name TEXT NOT NULL, team_id INTEGER);
CREATE TABLE teams(id INTEGER PRIMARY KEY, label TEXT NOT NULL);
INSERT INTO people VALUES(1,'Ada',10),(2,'Bo',10),(3,'Cy',20),(4,'Dee',NULL),(5,'Eli',99);
INSERT INTO teams VALUES(10,'Blue'),(20,'Gold'),(30,'Red');
```

- Each run opens a **fresh `:memory:` database**, runs `PRAGMA foreign_keys=ON`, executes the seed, then your SQL. Nothing persists between exercises.
- Only the **final statement** returns graded rows. `runtime.cjs` splits your text on semicolons (skipping semicolons inside quotes and comments) and keeps the rows of the last non-empty statement.
- The comparison is `assert.deepEqual(actual, expected, 'Exact rows/order do not match expected result')`. Exact rows, exact order, exact column names — an extra column or a differently named one fails.
- Column aliases per exercise: Q001/Q002/Q004/Q005/Q006/Q008 return `name, label`; Q003 returns `label, name`; Q007 returns `first, second`; Q009 returns `name`; Q010 returns `label, members`.
- Row counts are pinned: Q001 3 rows, Q002 5, Q003 4, Q004 6, Q005 5, Q006 2, Q007 1, Q008 4, Q009 2, Q010 3.
- `ORDER BY` is not optional. Without it SQLite may return rows in any order the planner finds convenient, and `deepEqual` compares position by position. Every reference query ends in an `ORDER BY`.
- NULL is compared as JSON `null` (Q002 expects `{"name":"Dee","label":null}`), and SQLite numbers arrive as JavaScript numbers (Q010 expects `"members": 2`, not `"2"`).
- Q004 states the ordering rule explicitly: "Order by label then name, with NULL labels first (SQLite default)". In SQLite, `ORDER BY` ascending puts NULL before every non-NULL value.
- Q004 also forbids `FULL JOIN` by name ("Do not use native FULL JOIN"). Nothing in the test inspects your SQL text, so this is a requirement the reviewer checks by reading the file.
- Q010 says "count `p.id`, not `COUNT(*)`". Both are checkable from the expected rows: Red must be `0`, and `COUNT(*)` would report `1`.

## Approach

1. **Decide which table must keep all its rows.** That table goes first in the `FROM`, and the join becomes `LEFT JOIN`. "Every person" (Q002, Q005) drives from `people`; "every team" (Q003, Q010) drives from `teams`.
2. **If nothing must be preserved, use an inner `JOIN`.** Q001's wording is "people with an existing team", which by definition drops Dee (no id) and Eli (dangling id).
3. **Write the link in `ON`.** `ON t.id = p.team_id` is the match condition. A NULL `team_id` matches nothing, because `NULL = 10` is unknown, not true.
4. **Put extra conditions where their effect is wanted.** A condition in `ON` (Q005) narrows what counts as a match while still preserving the left rows. The same condition in `WHERE` (Q006) runs after the join and discards any row whose right side is NULL — including the invented ones — which turns the outer join back into an inner join.
5. **Express "no match" as a NULL test on the right-hand side.** Q009 uses `LEFT JOIN ... WHERE t.id IS NULL`, the anti-join pattern. The left row survived the join, the right columns are NULL, therefore no partner existed.
6. **Emulate `FULL JOIN` as two halves.** SQLite 3.49.1 does support `FULL OUTER JOIN`, but the prompt forbids it, and the portable emulation is worth knowing: all left rows via `LEFT JOIN`, plus the right rows that matched nothing, via the mirrored `LEFT JOIN` filtered on `WHERE p.id IS NULL`. `UNION ALL` glues them without de-duplicating.
7. **Self-join for pairs, with a strict inequality to make them unordered and distinct.** `a.id < b.id` keeps `(Ada, Bo)` and rejects both `(Bo, Ada)` and `(Ada, Ada)` in one condition.
8. **Count the join partner, not the row.** `COUNT(p.id)` skips NULLs, so a team with no members counts `0`. `COUNT(*)` counts the single NULL-padded row and returns `1`.

## Worked example — Q001 inner-match-only

The task: "Return people with an existing team; order by person id."

**The seed rows.**

| people.id | name | team_id |
| --- | --- | --- |
| 1 | Ada | 10 |
| 2 | Bo | 10 |
| 3 | Cy | 20 |
| 4 | Dee | NULL |
| 5 | Eli | 99 |

| teams.id | label |
| --- | --- |
| 10 | Blue |
| 20 | Gold |
| 30 | Red |

**Step 1 — FROM people p JOIN teams t ON t.id = p.team_id.** SQLite conceptually pairs every person with every team and keeps the pairs where the `ON` condition is true.

| p.id | p.name | p.team_id | t.id | t.label | `t.id = p.team_id` |
| --- | --- | --- | --- | --- | --- |
| 1 | Ada | 10 | 10 | Blue | true — kept |
| 2 | Bo | 10 | 10 | Blue | true — kept |
| 3 | Cy | 20 | 20 | Gold | true — kept |
| 4 | Dee | NULL | — | — | `t.id = NULL` is unknown for all three teams — dropped |
| 5 | Eli | 99 | — | — | no team has id 99 — dropped |

Dee and Eli are gone for different reasons but with the same effect. Team Red never appears at all: an inner join preserves neither side.

**Step 2 — WHERE.** There is none; all three rows carry through.

**Step 3 — SELECT p.name, t.label.** The result columns are named after the trailing part of each expression, so they are `name` and `label` — exactly the aliases the prompt demands.

| name | label |
| --- | --- |
| Ada | Blue |
| Bo | Blue |
| Cy | Gold |

**Step 4 — ORDER BY p.id.** The rows already happen to be in that order here, but the clause is what makes it guaranteed. `p.id` may be used in `ORDER BY` even though it is not selected.

**The asserted result**, from `tests/Q001.cjs`:

```sql
-- [{"name":"Ada","label":"Blue"},{"name":"Bo","label":"Blue"},{"name":"Cy","label":"Gold"}]
```

The reference solution as it now reads in `solutions/Q001.sql`:

```sql
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
```

**Contrast with Q002**, which is the same query with one word changed. `LEFT JOIN` keeps Dee and Eli, padding `t.label` with NULL, so the expected result grows from 3 rows to 5 and `{"name":"Dee","label":null}` appears.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q001 | inner-match-only | "people with an existing team" | `JOIN teams t ON t.id=p.team_id` |
| Q002 | left-preserve-every-person | "every person … retaining NULL for absent teams" | the same query with `LEFT JOIN` |
| Q003 | left-preserve-every-team | "every team … including empty teams" | drive from `teams`: `FROM teams t LEFT JOIN people p ON p.team_id=t.id`, select `label, name`, `ORDER BY t.id,p.id` |
| Q004 | full-outer-emulation | "all people and unmatched teams", no native FULL JOIN | two `LEFT JOIN` halves joined by `UNION ALL`, second half filtered `WHERE p.id IS NULL`, `ORDER BY label,name` |
| Q005 | on-filter-preserves-left | "attach a label only for Blue teams … filter in ON" | the extra predicate joins the match condition: `ON t.id=p.team_id AND t.label='Blue'` |
| Q006 | where-filter-rejects-unmatched | "only people whose joined label is Blue" | the same predicate moves to `WHERE t.label='Blue'`, which drops the NULL-padded rows |
| Q007 | self-join-unique-teammate-pairs | "unique unordered teammate pairs" | join `people` to itself: `ON a.team_id=b.team_id AND a.id<b.id`, aliases `first, second` |
| Q008 | cross-join-small-assignment-grid | "cross join people id <=2 with teams id >=20" | `CROSS JOIN` with no `ON`; the two range limits sit in `WHERE` |
| Q009 | unmatched-including-dangling-fk | "people with no matching team" | anti-join: `LEFT JOIN ... WHERE t.id IS NULL`, select `name` only |
| Q010 | empty-team-count-zero | "count matched people per team … count p.id" | add `COUNT(p.id) AS members` and `GROUP BY t.id,t.label` on top of the Q003 join |

## Pitfalls the tests are designed to catch

- **Using `JOIN` where the prompt says "every".** Q002 expects 5 rows; an inner join returns 3 and fails on row count before order is even considered.
- **Moving an `ON` filter to `WHERE`.** This is the whole point of the Q005/Q006 pair. Q005 expects 5 rows with three NULL labels; writing `WHERE t.label='Blue'` gives Q006's 2-row answer. The reverse mistake in Q006 gives 5 rows.
- **Testing a NULL with `=`.** `WHERE p.team_id = NULL` returns nothing, ever. SQLite's three-valued logic makes any comparison with NULL "unknown", and `WHERE` keeps only rows that are true. Q009 must use `IS NULL`.
- **Assuming `foreign_keys=ON` prevents dangling ids.** It does not here: `team_id` is a bare `INTEGER` with no `REFERENCES` clause, so Eli's 99 is stored and Q009 expects both `Dee` and `Eli`.
- **`COUNT(*)` in Q010.** For team Red the left join produces one row with every `p.*` column NULL. `COUNT(*)` counts that row and reports `1`; `COUNT(p.id)` ignores NULL arguments and reports the expected `0`.
- **Omitting `ORDER BY`.** SQLite gives no order guarantee without it. A query that "works" today can reorder when the planner picks another index, and the graded comparison is positional.
- **Getting NULL ordering backwards in Q004.** SQLite sorts NULL **first** in an ascending `ORDER BY`, which is why Dee and Eli head the expected rows. Other engines differ; the prompt calls this out as "SQLite default".
- **Using `UNION` instead of `UNION ALL` in Q004.** `UNION` removes duplicate rows. Ada and Bo both map to Blue but differ by name, so this particular seed would survive — with a repeated name the answer would silently lose a row. The prompt asks for `UNION ALL`.
- **Self-joining with `<>` instead of `<` in Q007.** `a.id <> b.id` returns both `(Ada, Bo)` and `(Bo, Ada)`; the expected result has exactly one row. Note also that Dee (team NULL) pairs with nobody, because `NULL = NULL` is unknown.
- **Selecting the wrong side's column in Q003.** The alias order `label, name` is graded, and `deepEqual` compares object keys, so returning `name, label` fails even with identical values.
- **Adding a helper column "for clarity".** Any extra key in the result object fails `deepEqual`. Put explanations in `--` comments, not in the select list.

## Try it yourself

1. Rewrite Q004 using `FULL OUTER JOIN` (SQLite 3.49.1 supports it) and confirm you get the same six rows. Then say in words why the pack still asks for the emulation.
2. Change Q010 to count only people whose `team_id` is not dangling. Does that change any of the three expected numbers, and why not?
3. Write a query that lists teams nobody points at — the mirror image of Q009. Which table drives, and which column do you test with `IS NULL`?
4. In words: Q005 and Q006 differ by moving four characters. Describe the intermediate table after the join in each case, and say which rows the `WHERE` version deletes that the `ON` version keeps.

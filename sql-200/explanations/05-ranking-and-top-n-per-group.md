# Ranking and top N per group — sql-200 Q041–Q050

**What you practise:** the three ranking window functions, how each one treats a tie, and the CTE-plus-filter pattern that turns a rank into a "top N per group" answer.
**Prerequisites:** [03 GROUP BY HAVING and aggregate policy](03-group-by-having-and-aggregate-policy.md); `ORDER BY` with two keys; the idea that a result's order and a computation's order can differ.
**Exercises:** Q041: row-number-with-id-tiebreak, Q042: rank-with-gaps-on-ties, Q043: dense-rank-without-gaps, Q044: top-one-deterministic, Q045: top-one-all-tied-winners, Q046: top-two-rows-per-team, Q047: top-two-distinct-score-levels, Q048: global-rank-not-partitioned, Q049: second-distinct-score-only, Q050: bottom-one-per-team.

## The problem in plain words

Seven players, two teams, some equal scores. Every exercise asks a version of "who is near the top", and the differences are all about ties.

A **window function** computes a value for a row by looking at a set of related rows — the *window* — without collapsing them the way `GROUP BY` does. The syntax is `FUNC() OVER (PARTITION BY … ORDER BY …)`. `PARTITION BY` splits the rows into independent groups, and the `ORDER BY` inside `OVER` says in what order the function walks each group. That inner `ORDER BY` is **not** the result's order; the statement's own `ORDER BY` decides that. Half of this family's exercises deliberately use a different order for each.

Three functions number rows, and they differ only in tie handling:

| Scores 100, 90, 90, 70 | `ROW_NUMBER()` | `RANK()` | `DENSE_RANK()` |
| --- | --- | --- | --- |
| 100 | 1 | 1 | 1 |
| 90 | 2 | 2 | 2 |
| 90 | 3 | 2 | 2 |
| 70 | 4 | 4 | 3 |

`ROW_NUMBER` always produces distinct consecutive integers, so it must be given a deterministic tiebreak or it is arbitrary. `RANK` gives tied rows the same number and then skips, so the next value is the row's position. `DENSE_RANK` gives tied rows the same number and never skips, so it counts *levels*, not rows.

Once you have a rank column, "top N" is a filter on it. A window function may not appear in `WHERE` — the window is computed after `WHERE` runs — so the rank goes in a **CTE** (a `WITH name AS (…)` block, a named subquery that the main query selects from) and the filter goes in the outer query.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q041.txt`:

```sql
CREATE TABLE scores(id INTEGER PRIMARY KEY,team TEXT,name TEXT,score INTEGER);
INSERT INTO scores VALUES(1,'A','Ada',100),(2,'A','Bo',90),(3,'A','Cy',90),
  (4,'A','Dee',70),(5,'B','Eli',80),(6,'B','Flo',80),(7,'B','Gus',60);
```

- Team A has four players with three distinct scores (100, 90, 90, 70). Team B has three with two distinct scores (80, 80, 60). Both teams contain exactly one tie, which is what makes the ranking functions diverge.
- No score is NULL in this family, so the three-valued-logic issues of family 04 do not arise here.
- The result `ORDER BY` differs per exercise and is graded: Q041 `team,place`; Q042, Q043, Q045, Q049 `team,id`; Q044, Q050 `team`; Q046 `team,n` (the row number); Q047 `team,score DESC,id`; Q048 `score DESC,id`.
- Aliases: `team, name, place` (Q041–Q043); `team, name, score` (Q044, Q045, Q049, Q050); `team, name` (Q046, Q047); `name, place` (Q048).
- Row counts pin the tie policy: Q044 returns 2 rows (one winner per team) while Q045 returns 3 (team B's tie produces two winners). Q046 returns 4 (two rows per team) while Q047 returns 6 (top two *levels*, and team B's second level includes Gus).
- Q048's expected places are `1, 2, 2, 4, 4, 6, 7` — the gaps prove `RANK`, not `DENSE_RANK`, and the absence of `PARTITION BY` makes it global.
- Q049 expects `{"team":"B","name":"Gus","score":60}`: team B's second *distinct* score is 60, even though Gus is the third row by position.
- Q044 and Q050 both say "lower id wins a tie", so their windows order by `id` as a second key. Team B's top is a tie between Eli (5) and Flo (6); Q044 returns Eli alone.

## Approach

1. **Decide whether ties should share a number.** They should not for "exactly one per group" (Q044, Q050) — use `ROW_NUMBER`. They should for "all tied winners" (Q045) — use `RANK`. They should, and without gaps, when counting distinct levels (Q043, Q047, Q049) — use `DENSE_RANK`.
2. **Partition by the grouping column** whenever the question says "per team". Omit `PARTITION BY` for a global ranking (Q048).
3. **Order the window by the ranking key, then by the tiebreak** — `ORDER BY score DESC, id` for "highest first, lower id wins". Reverse only the ranking key for a bottom-N: `ORDER BY score, id` (Q050).
4. **Wrap the ranked query in a CTE when you need to filter on the rank.** `WITH r AS (SELECT *, ROW_NUMBER() OVER (…) AS n FROM scores) SELECT … FROM r WHERE n <= 2`.
5. **Choose the filter to match the function.** `WHERE n=1` on a `ROW_NUMBER` gives exactly one row per partition. `WHERE r=1` on a `RANK` gives every row tied for first. `WHERE n<=2` on a `DENSE_RANK` gives every row in the top two levels.
6. **Set the result's `ORDER BY` independently of the window's.** Q042 ranks by score but returns rows in `id` order; both clauses are needed and they do different jobs.
7. **Select only the required columns from the CTE.** `SELECT *` inside the CTE is convenient, but the outer `SELECT` must list exactly the graded aliases — the helper rank column must not leak into the result.

## Worked example — Q041 row-number-with-id-tiebreak

The task: "Number players within team by score descending then id ascending; order by team and row number."

**Step 1 — FROM scores.** All seven rows; no `WHERE`.

| id | team | name | score |
| --- | --- | --- | --- |
| 1 | A | Ada | 100 |
| 2 | A | Bo | 90 |
| 3 | A | Cy | 90 |
| 4 | A | Dee | 70 |
| 5 | B | Eli | 80 |
| 6 | B | Flo | 80 |
| 7 | B | Gus | 60 |

**Step 2 — PARTITION BY team.** Two independent windows. Nothing is removed; the rows are merely assigned to a partition.

| partition | rows |
| --- | --- |
| A | Ada, Bo, Cy, Dee |
| B | Eli, Flo, Gus |

**Step 3 — ORDER BY score DESC, id inside each partition.** This is the walking order the function uses, not the output order.

| partition | walk order |
| --- | --- |
| A | Ada (100, id 1), Bo (90, id 2), Cy (90, id 3), Dee (70, id 4) |
| B | Eli (80, id 5), Flo (80, id 6), Gus (60, id 7) |

The `id` key is what decides Bo before Cy and Eli before Flo. Without it, `ROW_NUMBER` would still assign 2 and 3 to Bo and Cy, but which one got which would be up to the planner, and `deepEqual` would fail intermittently.

**Step 4 — ROW_NUMBER() assigns 1, 2, 3, … per partition**, ignoring equal scores entirely.

| team | name | score | place |
| --- | --- | --- | --- |
| A | Ada | 100 | 1 |
| A | Bo | 90 | 2 |
| A | Cy | 90 | 3 |
| A | Dee | 70 | 4 |
| B | Eli | 80 | 1 |
| B | Flo | 80 | 2 |
| B | Gus | 60 | 3 |

Note Bo and Cy: equal scores, different places. That is exactly what `RANK` (Q042) changes to `2, 2` and what `DENSE_RANK` (Q043) keeps as `2, 2` while renumbering Dee to 3.

**Step 5 — SELECT team, name, place.** The score is computed on but not reported.

**Step 6 — ORDER BY team, place.** Here the output order happens to match the window order. Q042 is the same query with `ORDER BY team, id` instead, which separates the two ideas.

The asserted rows in `tests/Q041.cjs` are the seven above, in that order.

The reference solution, as it now reads in `solutions/Q041.sql`:

```sql
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
```

**The Q044/Q045 contrast, on team B.** Q044 ranks with `ROW_NUMBER() … ORDER BY score DESC, id` and keeps `rn=1`: Eli (id 5) wins, Flo loses on id. Q045 ranks with `RANK() … ORDER BY score DESC` and keeps `r=1`: both Eli and Flo are rank 1, so both are returned. Same data, one function swapped, and the row count changes from 2 to 3.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q041 | row-number-with-id-tiebreak | "number players … by score descending then id" | `ROW_NUMBER() OVER (PARTITION BY team ORDER BY score DESC,id)` |
| Q042 | rank-with-gaps-on-ties | "sharing tied ranks and leaving gaps" | `RANK()`, and the tiebreak drops out of the window |
| Q043 | dense-rank-without-gaps | "no gaps after ties" | `DENSE_RANK()` in place of `RANK()` |
| Q044 | top-one-deterministic | "exactly one winner per team, lower id on ties" | CTE with `ROW_NUMBER`, outer `WHERE rn=1` |
| Q045 | top-one-all-tied-winners | "all players tied for the highest score" | CTE with `RANK`, outer `WHERE r=1` |
| Q046 | top-two-rows-per-team | "at most two rows per team" | CTE with `ROW_NUMBER`, outer `WHERE n<=2`, order by `team,n` |
| Q047 | top-two-distinct-score-levels | "top two distinct score levels" | CTE with `DENSE_RANK`, outer `WHERE n<=2`, order by `team,score DESC,id` |
| Q048 | global-rank-not-partitioned | "rank all players globally" | `RANK() OVER (ORDER BY score DESC)` with no `PARTITION BY` |
| Q049 | second-distinct-score-only | "second distinct score level" | CTE with `DENSE_RANK`, outer `WHERE n=2` |
| Q050 | bottom-one-per-team | "lowest scorer per team, lower id wins" | the window orders `score, id` ascending; `WHERE n=1` |

## Pitfalls the tests are designed to catch

- **Putting a window function in `WHERE`.** `WHERE ROW_NUMBER() OVER (…) = 1` is an error: windows are evaluated after `WHERE`. The rank must be produced in a CTE or subquery and filtered outside it.
- **`ROW_NUMBER` where the prompt wants all tied winners.** Q045 expects three rows; `ROW_NUMBER` with `rn=1` returns two and silently drops Flo.
- **`RANK` where the prompt wants exactly one.** Q044 expects two rows; `RANK` with `r=1` returns three because team B's tie shares rank 1.
- **`RANK` where the prompt counts levels.** Q047 wants the top two *distinct scores*. With `RANK`, team A's levels are 1, 2, 2, 4, so `n<=2` returns Ada, Bo, Cy — the same three by luck. Team B's are 1, 1, 3, so `n<=2` drops Gus and the answer has five rows instead of six. `DENSE_RANK` is the one that counts levels.
- **`DENSE_RANK` in Q048.** The expected places `1,2,2,4,4,6,7` contain gaps. `DENSE_RANK` would give `1,2,2,3,3,4,5`.
- **Forgetting the tiebreak in a `ROW_NUMBER` window.** Q044 and Q050 both state a tie rule. Without `, id` in the window's `ORDER BY`, which of Eli and Flo gets `rn=1` is unspecified and the test becomes a coin flip.
- **Adding a tiebreak to a `RANK` window.** `RANK() OVER (PARTITION BY team ORDER BY score DESC, id)` makes every row's key unique, so no rows tie and `RANK` degenerates into `ROW_NUMBER`. Q042 and Q045 deliberately order by score alone.
- **Confusing the window's `ORDER BY` with the statement's.** Q042 computes places by score but returns rows by `id`, so Cy (place 2) precedes Dee (place 4) in both — but Q048 returns rows by `score DESC, id`, which puts Dee (place 6) before Gus (place 7) and after the two 80s. Only the outer clause affects the row order.
- **Leaking the rank column.** `SELECT * FROM r WHERE n<=2` in Q046 returns `id, team, name, score, n` and fails the two-column expectation. List the graded columns explicitly.
- **Reading Q049 as "the second row".** Team B's second distinct score is 60, held by Gus, who is the third row. `DENSE_RANK … = 2` says level, not position; `ROW_NUMBER … = 2` would return Flo.
- **Assuming `ORDER BY score` sorts descending.** SQLite sorts ascending by default. Q050's bottom-one window relies on that; the top-N variants all need an explicit `DESC`.

## Try it yourself

1. Add a player to team B with score 60 and id 8, then predict the new results of Q049 and Q050 before running them.
2. Write "the top two players per team, with all ties at the second level included" — a hybrid of Q046 and Q047. Which function do you need, and what does `n<=2` mean for it?
3. Q048 ranks globally. Add `PARTITION BY team` and say, without running it, which of the seven places change.
4. In words: `RANK` and `DENSE_RANK` return the same numbers for team A's first three rows and differ on the fourth. Explain what the fourth row's number means in each function.

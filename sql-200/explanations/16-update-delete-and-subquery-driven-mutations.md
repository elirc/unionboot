# UPDATE DELETE and subquery driven mutations — sql-200 Q151–Q160

**What you practise:** choosing which rows a mutation touches with `IN`, `EXISTS` and `NOT EXISTS`, computing the new value with a correlated subquery, and returning the changed row with `RETURNING`.
**Prerequisites:** [04 Subqueries correlated lookups and existence](04-subqueries-correlated-lookups-and-existence.md); [09 NULL semantics and three valued logic](09-null-semantics-and-three-valued-logic.md); `GROUP BY … HAVING`.
**Exercises:** Q151: update-owner-in-subquery, Q152: delete-blocked-exists, Q153: correlated-adjustment-guard, Q154: coalesce-fill-unknown-points, Q155: delete-completed-only, Q156: delete-owner-with-low-total, Q157: update-unblocked-open-semijoin, Q158: update-highest-open-task, Q159: delete-no-adjustment-owners, Q160: update-returning-single-row.

## The problem in plain words

A task list, a short list of blocked owners, and a table of point adjustments. Each exercise changes the task list, and the interesting question is always *which rows* and *to what value*.

Two of the three tables are deliberately awkward. `blocked` contains a NULL row, which is what makes the `IN` versus `NOT IN` versus `NOT EXISTS` distinction bite. `tasks` contains a row whose `points` are NULL, which is what makes `+` and `SUM` behave in ways that look like bugs until you know the rules.

The vocabulary is worth stating once. A **subquery** is a `SELECT` inside another statement. It is **uncorrelated** if it can be evaluated on its own — `SELECT owner FROM blocked` — and **correlated** if it refers to the row the outer statement is currently looking at — `SELECT 1 FROM blocked b WHERE b.owner = tasks.owner`. A correlated subquery is conceptually re-run per row. `EXISTS(subquery)` is true when that subquery returns at least one row, and it never looks at the values, which is why the reference solutions select the constant `1`.

`RETURNING`, in Q160, is SQLite's way of making a mutation report what it did. The changed row comes back from the `UPDATE` itself, with the new values, and no second `SELECT` is needed.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q151.txt`:

```sql
CREATE TABLE tasks(id INTEGER PRIMARY KEY,owner TEXT,status TEXT,points INTEGER);
CREATE TABLE blocked(owner TEXT); CREATE TABLE adjustments(owner TEXT,delta INTEGER);
INSERT INTO tasks VALUES(1,'Ada','open',3),(2,'Ada','done',5),(3,'Bo','open',2),
  (4,'Cy','open',4),(5,'Cy','done',1),(6,'Dee','open',NULL);
INSERT INTO blocked VALUES('Bo'),(NULL); INSERT INTO adjustments VALUES('Ada',2),('Cy',-1);
```

- `blocked` holds two rows: `'Bo'` and a NULL. The NULL is not a blocked owner; it is an unknown one, and it is there to break the careless query.
- `adjustments` covers Ada (+2) and Cy (−1). Bo and Dee have no adjustment.
- Task 6 (Dee) has NULL points. Task 5 has 1 point, so `1 + (−1)` is 0 — a value that is easy to confuse with "no value".
- Aliases: `id, status` (Q151, Q155, Q158); `id, owner` (Q152, Q156, Q159); `id, points` (Q153, Q154, Q157, Q160).
- Row counts pin the filters: Q151, Q153, Q154, Q157 and Q158 return all 6 rows because they update rather than delete. Q152 and Q156 return 5, Q159 returns 4, Q155 returns 4, Q160 returns 1.
- Q151 expects only task 3 to become `'cancelled'`; Ada, Cy and Dee keep their statuses even though `blocked` contains a NULL.
- Q153 expects `{"id":6,"points":null}`: Dee has no adjustment, so her task must be left alone rather than set to NULL.
- Q156 expects Dee's task 6 to survive. `SUM(points)` over Dee's single NULL row is NULL, and `NULL < 3` is unknown, so her group is not selected.
- Q157 expects `{"id":6,"points":10}` — the NULL was zero-filled before the addition — and `{"id":3,"points":2}`, Bo being blocked.
- Q158 expects exactly one row to change, task 4, and `tests/Q158.cjs` asserts all six statuses, so an update that hit every open task at the maximum would be caught.
- Q160 is the only exercise whose final statement is not a `SELECT`: the `UPDATE … RETURNING id,points` is the graded statement, asserted as `[{"id":3,"points":9}]`, and a probe then checks the stored value with `SELECT points FROM tasks WHERE id=3` expecting `[{"points":9}]`.

## Approach

1. **Write the row-selection rule first, as a sentence,** then translate: "owner appears in blocked" is `IN` or `EXISTS`; "owner does not appear in blocked" is `NOT EXISTS`; "this row's own column is missing" is `IS NULL`.
2. **Prefer `NOT EXISTS` to `NOT IN` whenever the probed table can contain NULL.** `x NOT IN (…NULL…)` is unknown for every `x`, so the mutation touches nothing. `NOT EXISTS` asks about the presence of a row and is unaffected.
3. **`IN` with a NULL in the list is safe for the positive case** — a true match still wins — but it can never be true for a non-match, so use it only when "not matched" should mean "left alone".
4. **Guard a correlated `SET` subquery with a matching `EXISTS`.** A scalar subquery that finds no row returns NULL, and assigning NULL silently erases data. The `WHERE EXISTS` restricts the update to rows where the lookup will succeed.
5. **Zero-fill before arithmetic when the column is nullable.** `NULL + 10` is NULL; `COALESCE(points,0) + 10` is 10.
6. **Aggregate in a subquery when the rule is about a group but the deletion is about rows.** `owner IN (SELECT owner FROM tasks GROUP BY owner HAVING SUM(points)<3)` deletes every task of a qualifying owner, not only the rows that were small.
7. **Select a single target with an ordered subquery and `LIMIT 1`.** `WHERE id = (SELECT id FROM … ORDER BY … LIMIT 1)` changes one row; `WHERE points = (SELECT MAX(points) …)` changes all the tied ones.
8. **Give every "pick one" subquery a tiebreak.** `ORDER BY points DESC, id` is deterministic; `ORDER BY points DESC` alone is not.
9. **Use `RETURNING` when the caller needs the new values,** and keep it to one row: SQLite does not specify the order of multi-row `RETURNING` output and the clause takes no `ORDER BY`.

## Worked example — Q151 update-owner-in-subquery

The task, quoted from the prompt: "Mark tasks of blocked owners cancelled using IN; NULL in blocked does not match Dee. Return all id,status."

**Step 1 — evaluate the uncorrelated subquery.** `SELECT owner FROM blocked` does not mention `tasks`, so it is computed once:

| owner |
| --- |
| `'Bo'` |
| NULL |

**Step 2 — test `owner IN (…)` for each task row.** `x IN (a,b)` is `x=a OR x=b`, evaluated in three-valued logic: a comparison with NULL is *unknown*, and `false OR unknown` is `unknown`.

| id | owner | `= 'Bo'` | `= NULL` | `IN` result | updated? |
| --- | --- | --- | --- | --- | --- |
| 1 | Ada | false | unknown | unknown | no |
| 2 | Ada | false | unknown | unknown | no |
| 3 | Bo | **true** | unknown | **true** | yes |
| 4 | Cy | false | unknown | unknown | no |
| 5 | Cy | false | unknown | unknown | no |
| 6 | Dee | false | unknown | unknown | no |

A `WHERE` clause keeps a row only when the condition is *true*, so unknown behaves like false and the NULL does no damage. Task 3 alone is updated.

**Step 3 — apply `SET status='cancelled'`.**

| id | status |
| --- | --- |
| 1 | open |
| 2 | done |
| 3 | **cancelled** |
| 4 | open |
| 5 | done |
| 6 | open |

**Step 4 — the graded `SELECT id,status FROM tasks ORDER BY id;`** returns those six rows, exactly as asserted in `tests/Q151.cjs`.

The reference solution, as it now reads in `solutions/Q151.sql`:

```sql
-- Why this works:
-- IN compares the owner against the set of values the subquery returns.
-- blocked holds 'Bo' and a NULL. 'Bo' IN (...) is true, so Bo's tasks are
-- cancelled.
-- For every other owner the comparison against 'Bo' is false and the
-- comparison against NULL is unknown, so the whole IN is unknown, not true,
-- and the row is not updated. Unknown behaves like false in a WHERE clause,
-- which is why the NULL does no damage here - unlike NOT IN, where it would
-- match nothing at all.
UPDATE tasks
   SET status = 'cancelled'
 WHERE owner IN (SELECT owner FROM blocked);
SELECT id, status
FROM tasks
ORDER BY id;
```

**The Q157 contrast, which is where `NOT IN` would fail.** Q157 wants the *unblocked* open tasks. Written as `WHERE status='open' AND owner NOT IN (SELECT owner FROM blocked)`, the `NOT IN` is `NOT(unknown)` — still unknown — for every owner including Ada, because the list contains a NULL. No row would be updated and the expected `13/14/10` would come back as `3/4/null`. `NOT EXISTS (SELECT 1 FROM blocked b WHERE b.owner=tasks.owner)` asks whether a matching row exists, the NULL row never matches anything, and the three unblocked open tasks are updated.

## Policy matrix — what changes between the variants

| ID | Variant | Which rows it touches | What changes in the SQL |
| --- | --- | --- | --- |
| Q151 | update-owner-in-subquery | tasks of blocked owners | `UPDATE … WHERE owner IN (SELECT owner FROM blocked)` |
| Q152 | delete-blocked-exists | the same rows, deleted | `DELETE … WHERE EXISTS (correlated lookup in blocked)` |
| Q153 | correlated-adjustment-guard | tasks whose owner has an adjustment | correlated scalar subquery in `SET`, plus a matching `WHERE EXISTS` |
| Q154 | coalesce-fill-unknown-points | rows with missing points | `WHERE points IS NULL`, `SET points = 0` |
| Q155 | delete-completed-only | `done` rows | a plain `WHERE status='done'`; no subquery |
| Q156 | delete-owner-with-low-total | every task of a low-scoring owner | `IN` over a `GROUP BY … HAVING SUM(points)<3` subquery |
| Q157 | update-unblocked-open-semijoin | open tasks of unblocked owners | `NOT EXISTS`, and `COALESCE(points,0)+10` in `SET` |
| Q158 | update-highest-open-task | exactly one row | `WHERE id = (SELECT id … ORDER BY points DESC, id LIMIT 1)` |
| Q159 | delete-no-adjustment-owners | tasks with no adjustment row | `DELETE … WHERE NOT EXISTS (correlated lookup in adjustments)` |
| Q160 | update-returning-single-row | one row by id | `UPDATE … WHERE id=3 RETURNING id,points` is the final statement |

## Pitfalls the tests are designed to catch

- **`NOT IN` against a table containing NULL.** This is the family's headline trap. In Q157 and Q159 it silently changes nothing; the expected rows show every intended change, so the failure is loud even though the SQL raised no error.
- **Assigning NULL through an unguarded correlated subquery.** Without the `WHERE EXISTS` in Q153, Bo's and Dee's tasks get `points = points + NULL`, which is NULL. The expected `{"id":3,"points":2}` catches Bo.
- **Reading `{"id":5,"points":0}` as a missing value.** Cy's adjustment is −1 and task 5 had 1 point, so 0 is a computed result. Skipping it with a `points <> 0` style guard would be wrong.
- **`WHERE points = NULL` in Q154.** Unknown for every row, so nothing is updated and task 6 stays NULL. `IS NULL` is the only test that matches.
- **Zero-filling every row in Q154.** `SET points = COALESCE(points,0)` with no `WHERE` produces the same six rows here, but it rewrites five rows that did not need it; the prompt says "replace only NULL points".
- **Forgetting `COALESCE` in Q157.** Task 6's `NULL + 10` stays NULL, and the expected value is 10.
- **Deleting only the small rows in Q156.** The rule is about owners, not tasks: once Bo's total is below 3, *all* of Bo's tasks go. Here Bo has one task, so the row counts coincide — but the `IN`-over-`GROUP BY` shape is what the prompt asks for, and Ada would expose the difference.
- **Expecting `SUM` of NULLs to be 0 in Q156.** It is NULL, so `HAVING SUM(points)<3` is unknown for Dee and she is not selected. The expected result keeps task 6.
- **Updating every tied maximum in Q158.** `WHERE points = (SELECT MAX(points) FROM tasks WHERE status='open')` would mark every open task holding the top score. The expected rows have exactly one `'urgent'`.
- **Dropping the tiebreak in Q158.** `ORDER BY points DESC LIMIT 1` picks an unspecified row among equals. Task 4 is the unique maximum here, so the test passes either way — the tiebreak is a correctness requirement the data does not enforce, and the prompt states it.
- **Following Q160's `UPDATE` with a `SELECT`.** Only the final statement is graded, so an extra `SELECT id,points FROM tasks WHERE id=3` would return the same row by accident and hide the point of the exercise; a `SELECT *` would return four columns and fail.
- **Using `RETURNING` on a multi-row mutation.** The GUIDE notes that multi-row `RETURNING` order is unspecified, which is why Q160 targets a single id.

## Try it yourself

1. Delete the NULL row from `blocked` and re-run Q151 and Q157 mentally. Which one changes its answer, and which one was correct only because of how its operator treats unknown?
2. Rewrite Q152 with `IN` instead of `EXISTS` and confirm the rows are the same. Now add a NULL to `adjustments` and rewrite Q159 with `NOT IN`. What happens, and why is only one of the two rewrites safe?
3. Extend Q158 to mark the top *two* open tasks urgent, keeping the same tiebreak. Which part of the statement has to change shape?
4. In words: Q153 guards its `SET` with `WHERE EXISTS`, and Q157 guards its rows with `WHERE NOT EXISTS`. Explain what each guard protects against, and why dropping either one produces a wrong answer rather than an error.

# CTE pipelines and recursive traversal — sql-200 Q061–Q070

**What you practise:** naming an intermediate result with `WITH`, and using `WITH RECURSIVE` to walk a hierarchy, generate a series, and survive a cycle.
**Prerequisites:** [04 Subqueries correlated lookups and existence](04-subqueries-correlated-lookups-and-existence.md); `GROUP BY`; `UNION` versus `UNION ALL`.
**Exercises:** Q061: ordinary-cte-direct-report-count, Q062: org-tree-root-depth, Q063: subtree-exclude-anchor, Q064: ancestors-upward, Q065: tree-path-strings, Q066: depth-limited-subtree, Q067: cycle-safe-reachability-union, Q068: integer-series-inclusive, Q069: recursive-date-spine-left-join, Q070: all-manager-descendant-counts.

## The problem in plain words

A **CTE** (common table expression) is a named subquery written before the main statement: `WITH counts AS (SELECT …) SELECT … FROM counts`. It changes nothing about what is computed; it gives a step a name so the main query reads as a pipeline instead of a nest. Q061 is that and nothing more.

A **recursive CTE** is different in kind. It is written `WITH RECURSIVE name(cols) AS (anchor UNION [ALL] recursive-step)`, where the anchor produces a starting set and the recursive step is allowed to select from `name` itself. SQLite evaluates it as a loop: run the anchor, put its rows in a queue, then repeatedly take rows from the queue, run the recursive step against them, and add whatever comes out. It stops when a pass produces no new rows.

Eight of the ten exercises use that loop for three different purposes:

- **Walking a tree.** `staff(id, name, manager_id)` is an adjacency list: each row points at its parent. Following `manager_id` downward gives descendants (Q062, Q063, Q066, Q070); following it upward gives ancestors (Q064). Carrying an extra column through the loop gives depth (Q062) or a path string (Q065).
- **Generating rows that do not exist.** The anchor is a literal, the step increments. Q068 produces the integers 2..6; Q069 produces four calendar dates, which are then left-joined so that days with no events still appear.
- **Traversing a graph that may contain a cycle.** `edges` contains `1→2, 2→3, 3→1`, a loop. With `UNION ALL` the recursion never stops. With `UNION`, SQLite discards rows it has already produced, and the loop terminates because the node set is finite. Q067 says this in its own prompt: "Use UNION duplicate elimination on node alone so the recursion terminates."

## The contract you must honour

The base seed, quoted from `prompts/Q061.txt`:

```sql
CREATE TABLE staff(id INTEGER PRIMARY KEY,name TEXT,manager_id INTEGER);
INSERT INTO staff VALUES(1,'Ada',NULL),(2,'Bo',1),(3,'Cy',1),(4,'Dee',2),(5,'Eli',2),(6,'Flo',4);
CREATE TABLE edges(src INTEGER,dst INTEGER);
INSERT INTO edges VALUES(1,2),(2,3),(3,1),(2,4);
```

**Q069 seeds two extra objects** — `CREATE TABLE events(id INTEGER,day TEXT)` with rows on `2024-01-01` (twice) and `2024-01-03`. Read each prompt's seed block.

The hierarchy is:

```text
Ada (1)
├── Bo (2)
│   ├── Dee (4)
│   │   └── Flo (6)
│   └── Eli (5)
└── Cy (3)
```

- Ada's `manager_id` is NULL — that is how the root is identified (Q065's anchor) rather than by hard-coding id 1.
- `edges` is a separate, unrelated graph and contains the cycle `1 → 2 → 3 → 1`. Only Q067 uses it.
- Aliases: `name, reports` (Q061); `name, depth` (Q062); `name` (Q063, Q066); `name, distance` (Q064); `path` (Q065); `node` (Q067); `n, square` (Q068); `day, events` (Q069); `name, descendants` (Q070).
- Q062 expects six rows including the anchor at `depth: 0`; Q063 expects three rows and explicitly excludes its anchor, which it achieves by anchoring on Bo's *children* rather than on Bo.
- Q064 expects `Flo 0, Dee 1, Bo 2, Ada 3` — the walk goes up, so the recursive step joins `s.id = c.manager_id`, the mirror of the downward `s.manager_id = t.id`.
- Q065 expects `"Ada/Cy"`, `"Ada/Bo/Eli"`, `"Ada/Bo/Dee/Flo"` in that order — leaves only, ordered by the leaf's staff id (3, 5, 6). "Leaf" is expressed as `NOT EXISTS (SELECT 1 FROM staff s WHERE s.manager_id = t.id)`.
- Q066 expects only `Dee` and `Eli`: the recursion is capped with `WHERE t.depth < 2` inside the step, and the outer query then selects `depth = 2`.
- Q068 expects five rows, 2 through 6 inclusive. The step's guard is `WHERE n < 6`, so 6 is produced and then stops — an off-by-one here is the classic mistake.
- Q069 expects `{"day":"2024-01-02","events":0}`, which is why a generated date spine plus `LEFT JOIN` plus `COUNT(e.id)` is needed rather than grouping the events table.
- Q070 expects three rows: Ada 5, Bo 3, Dee 1. Staff with no descendants do not appear, because the `links` relation simply has no row naming them as an ancestor.
- Every exercise ends in an `ORDER BY`; the graded comparison is positional.

## Approach

1. **Use a plain `WITH` to name a step you would otherwise nest.** Q061's `counts` CTE aggregates `staff` by `manager_id`, and the main query joins it back to `staff` to turn a manager id into a name.
2. **Write a recursive CTE in three parts:** the column list `name(a, b, c)`, the anchor `SELECT`, and the recursive `SELECT` that joins the CTE to the base table. The column list is what lets the anchor and step agree on shape.
3. **Anchor where the walk starts.** `WHERE id = 1` for "from Ada", `WHERE manager_id IS NULL` for "from the root", `WHERE manager_id = 2` for "Bo's children, excluding Bo", `WHERE id = 6` for an upward walk, `VALUES(2)` for a generated series.
4. **Point the recursive join in the direction of travel.** Downward: `JOIN tree t ON s.manager_id = t.id` (find rows whose manager is already in the tree). Upward: `JOIN chain c ON s.id = c.manager_id` (find the row that is the current one's manager).
5. **Carry accumulators through the loop.** `t.depth + 1` counts levels; `t.path || '/' || s.name` builds a string (`||` is SQL's concatenation operator).
6. **Cap the recursion with a `WHERE` inside the step** when the prompt limits depth (Q066). The guard applies to the row already in the CTE, so `WHERE t.depth < 2` allows a child at depth 3 to *not* be generated.
7. **Use `UNION` rather than `UNION ALL` on a cyclic graph.** `UNION` deduplicates against everything produced so far, which is what makes `1 → 2 → 3 → 1` terminate. On a tree, `UNION ALL` is correct and cheaper because no node can be reached twice.
8. **Build a transitive-closure table when you need counts for every ancestor.** Q070's `links(ancestor, descendant)` starts from every direct edge and extends the descendant end, so `GROUP BY ancestor` counts the whole subtree in one pass.

## Worked example — Q061 ordinary-cte-direct-report-count

The task: "Use a nonrecursive CTE to count direct reports per manager, returning only managers with two or more."

**Step 1 — the CTE body, `FROM staff WHERE manager_id IS NOT NULL`.** The root has no manager, so Ada's row is not a report of anybody.

| id | name | manager_id | kept |
| --- | --- | --- | --- |
| 1 | Ada | NULL | no |
| 2 | Bo | 1 | yes |
| 3 | Cy | 1 | yes |
| 4 | Dee | 2 | yes |
| 5 | Eli | 2 | yes |
| 6 | Flo | 4 | yes |

**Step 2 — GROUP BY manager_id, COUNT(*).** Three buckets:

| manager_id | reports |
| --- | --- |
| 1 | 2 |
| 2 | 2 |
| 4 | 1 |

That table is what the name `counts` now refers to.

**Step 3 — the main query joins `counts` back to `staff`** on `s.id = c.manager_id`, which turns each manager id into a name. Ada is id 1, Bo is id 2, Dee is id 4.

| c.manager_id | c.reports | s.name |
| --- | --- | --- |
| 1 | 2 | Ada |
| 2 | 2 | Bo |
| 4 | 1 | Dee |

**Step 4 — WHERE c.reports >= 2.** Dee's single report drops. Note that this is a plain `WHERE`, not a `HAVING`: by the time the main query runs, `reports` is an ordinary column of a named table, not an aggregate.

**Step 5 — SELECT s.name, c.reports; ORDER BY s.id.**

The asserted rows in `tests/Q061.cjs`:

```sql
-- [{"name":"Ada","reports":2},{"name":"Bo","reports":2}]
```

The reference solution, as it now reads in `solutions/Q061.sql`:

```sql
-- Why this works:
-- The CTE is an ordinary named subquery, not a recursive one: it aggregates
-- staff by manager_id once, and the main query then reads it as a table.
-- WHERE manager_id IS NOT NULL keeps the root out of the counts; Ada reports
-- to nobody, so she is nobody's direct report.
-- Joining counts back to staff turns a manager id into a manager name.
-- The threshold is a plain WHERE in the main query, because by then reports
-- is a column of a finished table rather than an aggregate needing HAVING.
WITH counts AS (
  SELECT manager_id,
         COUNT(*) AS reports
  FROM staff
  WHERE manager_id IS NOT NULL
  GROUP BY manager_id
)
SELECT s.name,
       c.reports
FROM counts c
JOIN staff s ON s.id = c.manager_id
WHERE c.reports >= 2
ORDER BY s.id;
```

**The recursion, traced on Q062.** The CTE is `tree(id, name, depth)`; the anchor is Ada at depth 0; the step is `SELECT s.id, s.name, t.depth+1 FROM staff s JOIN tree t ON s.manager_id = t.id`.

| pass | rows fed in | rows produced |
| --- | --- | --- |
| anchor | — | `(1, Ada, 0)` |
| 1 | `(1, Ada, 0)` | `(2, Bo, 1)`, `(3, Cy, 1)` |
| 2 | `(2, Bo, 1)`, `(3, Cy, 1)` | `(4, Dee, 2)`, `(5, Eli, 2)` — Cy has no reports |
| 3 | `(4, Dee, 2)`, `(5, Eli, 2)` | `(6, Flo, 3)` |
| 4 | `(6, Flo, 3)` | nothing — the loop stops |

Six rows, then `ORDER BY depth, id` returns them as `Ada 0, Bo 1, Cy 1, Dee 2, Eli 2, Flo 3`.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q061 | ordinary-cte-direct-report-count | "nonrecursive CTE … two or more" | `WITH counts AS (… GROUP BY manager_id)` plus `WHERE c.reports>=2` |
| Q062 | org-tree-root-depth | "from Ada id=1, include root at depth zero" | anchor `WHERE id=1` carrying `0`; step adds `t.depth+1` |
| Q063 | subtree-exclude-anchor | "descendants of Bo id=2, excluding Bo" | anchor moves down one level: `WHERE manager_id=2` |
| Q064 | ancestors-upward | "walk from Flo id=6 upward" | the step's join flips to `s.id=c.manager_id`; the counter is `distance` |
| Q065 | tree-path-strings | "slash-delimited name paths … leaves only" | anchor `WHERE manager_id IS NULL`; step concatenates `t.path||'/'||s.name`; outer `NOT EXISTS` keeps leaves |
| Q066 | depth-limited-subtree | "stop at depth two, returning only depth-two names" | `WHERE t.depth<2` inside the step, `WHERE depth=2` outside |
| Q067 | cycle-safe-reachability-union | "cyclic edges … UNION duplicate elimination" | `VALUES(1)` anchor, `UNION` not `UNION ALL`, join on `edges` |
| Q068 | integer-series-inclusive | "integers 2 through 6 and their squares" | no table at all: `VALUES(2)` anchor, `SELECT n+1 … WHERE n<6` |
| Q069 | recursive-date-spine-left-join | "generate dates … zero-fill absent days" | date anchor plus `date(day,'+1 day')` step, then `LEFT JOIN events` and `COUNT(e.id)` |
| Q070 | all-manager-descendant-counts | "ancestor/descendant pairs … count all descendants" | anchor is every direct edge; the step extends the descendant end; `GROUP BY ancestor` |

## Pitfalls the tests are designed to catch

- **`UNION ALL` on the cyclic graph.** Q067's `edges` contain `1 → 2 → 3 → 1`. With `UNION ALL` the recursion produces the same nodes forever and the query never returns. `UNION` compares whole rows, and since the CTE has one column the comparison is "on node alone", exactly as the prompt words it.
- **`UNION` on the tree by reflex.** It would be correct but it also removes genuine duplicates. In Q070 two different ancestors legitimately pair with the same descendant, so the rows differ and nothing is lost — but making `UNION` a habit hides the question of whether duplicates are meaningful.
- **Including the anchor when the prompt excludes it.** Q063 expects three names; anchoring on `WHERE id = 2` and filtering `name <> 'Bo'` afterwards happens to work, but anchoring on `WHERE manager_id = 2` states the intent and needs no filter.
- **Off-by-one in a generated series.** Q068's guard is `WHERE n < 6`, which produces 6 and then stops. `WHERE n <= 6` produces 7. The last value generated is always one past the guard.
- **Capping the recursion in the wrong place.** In Q066, `WHERE depth < 2` belongs inside the recursive step, where it prevents a deeper row from being created. Putting it only in the outer query still walks the whole tree, which on a large or cyclic graph is the difference between fast and non-terminating.
- **Selecting `depth <= 2` instead of `depth = 2` in Q066.** The prompt asks for "only depth-two names"; two rows, not five.
- **Reversing the recursive join direction.** Q064 walks up. `JOIN chain c ON s.manager_id = c.id` would walk down from Flo and return only Flo, because Flo has no reports.
- **Forgetting the CTE column list.** `WITH RECURSIVE tree(id,name,depth) AS (…)` names the columns once. Without it, the anchor's expression names — including the bare literal `0` — become the column names, and the step's references break.
- **Grouping the events table in Q069.** `SELECT day, COUNT(*) FROM events GROUP BY day` returns three rows and no `2024-01-02`. Only a generated spine can produce a day that has no data.
- **`COUNT(*)` instead of `COUNT(e.id)` in Q069.** After the left join, `2024-01-02` has one row with every `e` column NULL. `COUNT(*)` reports 1; `COUNT(e.id)` reports the expected 0. This is the same trap as Q010.
- **Assuming `||` concatenates NULLs.** In Q065 every `name` is non-NULL, so the paths build cleanly. `'x' || NULL` is NULL in SQLite, which would silently blank out a whole path.
- **Expecting staff with no reports in Q070.** Cy, Eli and Flo never appear as an `ancestor` in `links`, so the `GROUP BY` has no bucket for them. Three rows, not six. A `LEFT JOIN` from `staff` would be needed to show zeros.

## Try it yourself

1. Change Q068's anchor to `VALUES(1)` and its guard to `WHERE n < 10`. How many rows, and what is the largest `n`?
2. Extend Q070 to list every staff member, including those with zero descendants. Which join does that need, and where does the `COALESCE` go?
3. Write the depth of every staff member without naming a root id, using Q065's anchor style. What does `manager_id IS NULL` buy you over `id = 1`?
4. In words: Q067 would not terminate with `UNION ALL`, but Q062 would. Explain what property of `staff` guarantees that, and what would happen to Q062 if somebody made Ada report to Flo.

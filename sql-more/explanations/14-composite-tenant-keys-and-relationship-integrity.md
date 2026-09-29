# Composite tenant keys and relationship integrity — sql-more Q331–Q340

**What you practise:** keying every table on `(tenant, id)` instead of `id`, joining and paginating on that pair, and letting the database — not the application — refuse rows that would leak across tenants.
**Prerequisites:** [sql-200 13 SQLite schema constraints and integrity](../../sql-200/explanations/13-sqlite-schema-constraints-and-integrity.md) for primary keys, foreign keys and `WITHOUT ROWID`; [sql-200 02 Multi-table commerce joins](../../sql-200/explanations/02-multi-table-commerce-joins.md).
**Exercises:** Q331: tenant-qualified-parent-join, Q332: same-id-distinct-tenants, Q333: tenant-scoped-counts, Q334: cross-tenant-orphan-rejected, Q335: composite-duplicate-rejected, Q336: tuple-in-composite-membership, Q337: lexicographic-keyset-pagination, Q338: tenant-scoped-mutation, Q339: composite-fk-metadata, Q340: without-rowid-key-null-rejection.

## The problem in plain words

A **multi-tenant** database holds the data of several independent customers in one set of tables. Each customer is a *tenant*, and no query may ever return one tenant's rows to another.

There are two ways to arrange that. One is to give every row a globally unique id and add `WHERE tenant = ?` to every query; forget the filter once and data leaks. The other, the one this family teaches, is to make the tenant part of the key: `PRIMARY KEY(tenant, id)`. Ids then restart at 1 inside every tenant, and a reference from a child row to a parent row must carry both columns. A join that mentions only `id` no longer even type-checks as a correct question, because `id = 1` matches two different projects.

The seed is deliberately arranged so that the wrong join is visible. Tenant 1 has projects 1 and 2; tenant 2 has project 1. Join tasks to projects on `project_id` alone and tenant 1's task would match tenant 2's project as well — three rows become four, and one of them crosses a customer boundary.

Three exercises hand the work to the database rather than the query. A composite `FOREIGN KEY(tenant, project_id) REFERENCES projects(tenant, id)` rejects a child row whose *pair* has no parent, even when each column separately exists (Q334). The composite primary key rejects a duplicate pair while permitting the same `id` under another tenant (Q335). And `WITHOUT ROWID` makes the key columns genuinely `NOT NULL` (Q340), which an ordinary table does not.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q331.txt`:

```sql
CREATE TABLE projects(tenant INTEGER,id INTEGER,title TEXT,PRIMARY KEY(tenant,id)) WITHOUT ROWID;
CREATE TABLE tasks(tenant INTEGER,id INTEGER,project_id INTEGER,title TEXT,
                   PRIMARY KEY(tenant,id),
                   FOREIGN KEY(tenant,project_id) REFERENCES projects(tenant,id)) WITHOUT ROWID;
INSERT INTO projects VALUES(1,1,'Alpha'),(1,2,'Beta'),(2,1,'Gamma');
INSERT INTO tasks VALUES(1,1,1,'A'),(1,2,2,'B'),(2,1,1,'C');
```

- **`WITHOUT ROWID`** means the table is stored as a B-tree keyed by the declared primary key, with no hidden `rowid` column. One consequence is load-bearing here: in a `WITHOUT ROWID` table the primary-key columns are `NOT NULL`, whereas in an ordinary rowid table SQLite accepts NULL in a non-`INTEGER PRIMARY KEY` column for historical compatibility. Q340 asserts the strict behaviour.
- **The foreign key is composite and shares a column with the child's own key.** `tasks.tenant` is both half of the task's identity and half of its reference to a project, which is what makes a cross-tenant reference structurally impossible.
- `PRAGMA foreign_keys=ON` is set by the runner before the seed, so foreign keys are actually enforced. SQLite's default is off.
- Every graded query must order by `tenant` first, then `id`. Q337 additionally depends on that order being the pagination order.
- Aliases are graded: Q331 returns `tenant, id, project`; Q332, Q336, Q337 and Q338 return `tenant, id, title`; Q333 returns `tenant, id, tasks`; Q334 returns `tasks`; Q335 returns `tenant, id`; Q339 returns `seq, child_column, parent_column`; Q340 returns `projects`.
- Q331 expects **three** rows. Four would mean the join lost the tenant predicate.
- Q334 and Q340 are graded on a single count row and then on a **probe**: a statement the runner executes afterwards which must raise an error matching a pattern. Q334's probe is `INSERT INTO tasks VALUES(2,2,2,'bad')` and must fail matching `FOREIGN KEY`; Q340's is `INSERT INTO projects VALUES(NULL,9,'invalid')` and must fail matching `NOT NULL`. The probes are part of the test file, not something you write — your job is to leave the schema able to reject them.
- Q335 inserts `(2,2,1,'D')`, expects four `(tenant,id)` pairs, and its probe requires `INSERT INTO tasks VALUES(2,2,1,'again')` to fail matching `UNIQUE`.
- Q339's expected rows come from `pragma_foreign_key_list` and are ordered by `seq`, which is 0 then 1.

## Approach

1. **Join on every column of the key.** `ON p.tenant = t.tenant AND p.id = t.project_id`. Both conditions are needed; dropping either turns the join into a cross-tenant fan-out.
2. **Do not use `USING(tenant, id)` for this shape.** `USING` requires the columns to have the same name on both sides, and the child column is `project_id`, not `id`. The explicit `ON` is the only spelling that works.
3. **Group by the whole key.** `GROUP BY p.tenant, p.id` keeps tenant 1's project 1 and tenant 2's project 1 as separate groups. `GROUP BY p.id` merges them.
4. **Use `LEFT JOIN` when a parent with no children must still be reported.** Q333 counts tasks per project; `COUNT(t.id)` counts a column, so a project with no tasks counts 0 rather than 1. (On this seed every project has a task, but the shape is what the exercise teaches.)
5. **Compare tuples with row values.** SQLite supports **row values**: a parenthesised list of expressions that compares as a unit. `(tenant,id) IN ((1,2),(2,1))` asks for exactly those two pairs. `tenant IN (1,2) AND id IN (2,1)` asks for the four combinations and is the mistake the prompt warns against.
6. **Paginate with a row-value comparison, not with `OFFSET`.** `WHERE (tenant,id) > (1,1) ORDER BY tenant, id LIMIT 2` continues after a cursor. Row-value `>` is lexicographic: compare `tenant`; only if equal, compare `id`. (Checked against SQLite 3.49.1: `SELECT (1,2) > (1,1)` returns 1.) This is **keyset pagination**; unlike `OFFSET`, its cost does not grow with the page number, and it does not skip or repeat rows when data is inserted between pages.
7. **Scope every mutation by the whole key.** `UPDATE projects SET title='Delta' WHERE tenant=2 AND id=1`. `WHERE id=1` alone would rename two tenants' projects.
8. **Read the schema with a table-valued pragma.** `pragma_foreign_key_list('tasks')` is a function you can select from like a table. Its `from` and `to` columns name the child and parent columns; both are SQL keywords, so they must be written as `"from"` and `"to"` in double quotes.

## Worked example — Q331 tenant-qualified-parent-join

The task, quoted from the prompt: "Join tasks to projects using both tenant and project_id to avoid cross-tenant fan-out."

**Step 1 — the two tables.**

| projects.tenant | projects.id | title | | tasks.tenant | tasks.id | project_id | title |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | Alpha | | 1 | 1 | 1 | A |
| 1 | 2 | Beta | | 1 | 2 | 2 | B |
| 2 | 1 | Gamma | | 2 | 1 | 1 | C |

**Step 2 — what the *wrong* join would produce.** With `ON p.id = t.project_id` alone:

| task | matches project | crosses tenants? |
| --- | --- | --- |
| (1,1) project_id 1 | (1,1) Alpha | no |
| (1,1) project_id 1 | (2,1) Gamma | **yes** |
| (1,2) project_id 2 | (1,2) Beta | no |
| (2,1) project_id 1 | (1,1) Alpha | **yes** |
| (2,1) project_id 1 | (2,1) Gamma | no |

Five rows, two of them leaking. That growth is the "fan-out" the prompt names.

**Step 3 — the correct join.** Adding `p.tenant = t.tenant` removes the two leaking rows:

| t.tenant | t.id | p.title |
| --- | --- | --- |
| 1 | 1 | Alpha |
| 1 | 2 | Beta |
| 2 | 1 | Gamma |

**Step 4 — order by the key.** `ORDER BY t.tenant, t.id` — tenant first, because that is the outer level of the key and the order every expectation in this family uses.

**Step 5 — the expected result**, asserted in `tests/Q331.cjs`:

```json
[{"tenant":1,"id":1,"project":"Alpha"},
 {"tenant":1,"id":2,"project":"Beta"},
 {"tenant":2,"id":1,"project":"Gamma"}]
```

The reference solution, as it now reads in `solutions/Q331.sql`:

```sql
-- Why this works:
-- The parent key is the pair (tenant, id), so the join condition has to
-- mention both halves. Matching on project_id alone would also pair
-- tenant 1's task with tenant 2's project 1, turning three rows into five
-- and crossing a customer boundary.
-- USING is not available here: the child column is called project_id, not
-- id, so the columns cannot be matched by name.
-- p.title is aliased to project because that is the graded column name.
-- ORDER BY tenant then id is the key order every scenario in this family
-- uses.
SELECT t.tenant,
       t.id,
       p.title AS project
FROM tasks t
JOIN projects p
  ON p.tenant = t.tenant
 AND p.id = t.project_id
ORDER BY t.tenant, t.id;
```

**Why Q334's probe fails, step by step.** The probe tries `INSERT INTO tasks VALUES(2,2,2,'bad')` — tenant 2, task id 2, referring to project 2. Tenant 2 has no project 2; tenant 1 does. SQLite checks the *pair* `(2,2)` against `projects(tenant,id)`, finds nothing, and raises `FOREIGN KEY constraint failed`. Had the foreign key been declared on `project_id` alone, the pair check would never happen and the cross-tenant row would be accepted. Nothing in the submitted SQL causes this; the submission's job is to return the count and leave the constraint intact.

## Policy matrix — what changes between the variants

| ID | Variant | What it demonstrates | What changes in the SQL |
| --- | --- | --- | --- |
| Q331 | tenant-qualified-parent-join | a composite join has two equalities | `ON p.tenant=t.tenant AND p.id=t.project_id` |
| Q332 | same-id-distinct-tenants | ids repeat across tenants | `WHERE id=1` with no tenant filter, both rows kept |
| Q333 | tenant-scoped-counts | grouping by the whole key | `LEFT JOIN` on both columns, `GROUP BY p.tenant,p.id` |
| Q334 | cross-tenant-orphan-rejected | the composite FK blocks a leak | a bare `COUNT(*)`; the probe does the work |
| Q335 | composite-duplicate-rejected | the composite PK allows a repeated id | an `INSERT` of `(2,2,1,'D')`; the probe repeats it |
| Q336 | tuple-in-composite-membership | row-value `IN` picks exact pairs | `WHERE (tenant,id) IN ((1,2),(2,1))` |
| Q337 | lexicographic-keyset-pagination | row-value `>` is a cursor | `WHERE (tenant,id) > (1,1) … LIMIT 2` |
| Q338 | tenant-scoped-mutation | a write must carry the tenant too | `UPDATE … WHERE tenant=2 AND id=1` |
| Q339 | composite-fk-metadata | the FK is two ordered column pairs | `SELECT seq,"from","to" FROM pragma_foreign_key_list('tasks')` |
| Q340 | without-rowid-key-null-rejection | `WITHOUT ROWID` makes key columns `NOT NULL` | a bare `COUNT(*)`; the probe inserts a NULL tenant |

## Pitfalls the tests are designed to catch

- **Joining on the id alone.** Q331 expects three rows; the one-column join returns five. The extra rows are exactly the cross-tenant pairs.
- **Adding a tenant filter to Q332.** The exercise is to show that `id = 1` is ambiguous across tenants, so both `Alpha` and `Gamma` are expected. A `WHERE tenant = 1` narrows it to one row.
- **Grouping by `id` in Q333.** Tenant 1's project 1 and tenant 2's project 1 would merge into one group with `tasks` 2, and the expected three rows become two.
- **Using `COUNT(*)` with a `LEFT JOIN` in Q333.** `COUNT(*)` counts the padding row, so a childless project would report 1. `COUNT(t.id)` counts non-NULL values and reports 0. Every project here has a task, so the two agree on this seed — but the habit is what the family is teaching.
- **Splitting a tuple `IN` into two column lists.** `WHERE tenant IN (1,2) AND id IN (2,1)` matches `(1,2)`, `(1,1)`, `(2,2)` and `(2,1)` — the Cartesian product of the two lists, not the two pairs. On this seed it returns three rows instead of two. The prompt says "do not combine separate IN lists".
- **Paginating with `OFFSET`.** `ORDER BY tenant,id LIMIT 2 OFFSET 1` returns the same two rows here, but it re-reads and discards the skipped rows, and a row inserted before the cursor shifts the page. The exercise asks for a tuple comparison.
- **Getting the row-value comparison backwards.** `(tenant,id) > (1,1)` compares lexicographically: `tenant` first, `id` only when `tenant` ties. Writing `tenant > 1 OR id > 1` instead admits `(1,2)` and `(2,1)` here by coincidence, and is wrong in general — it would also admit a row with a lower tenant and a higher id.
- **Updating without the tenant in Q338.** `WHERE id = 1` renames both tenant 1's `Alpha` and tenant 2's `Gamma`; the expected first row is still `Alpha`.
- **Writing `from` and `to` unquoted in Q339.** Both are SQL keywords. `SELECT seq, from FROM pragma_foreign_key_list('tasks')` is a syntax error; `"from"` and `"to"` in double quotes are identifiers.
- **Ordering Q339 by something other than `seq`.** `seq` is the position of the column inside the composite foreign key — 0 for `tenant`, 1 for `project_id` — and it is what makes the two-column mapping readable as an ordered pair.
- **Assuming any composite primary key rejects NULL.** It does not. In an ordinary rowid table, `PRIMARY KEY(a,b)` still accepts a NULL in `a`; SQLite documents this as a long-standing compatibility quirk. Adding `WITHOUT ROWID` is what makes Q340's probe fail with `NOT NULL constraint failed: projects.tenant`.
- **Trying to make Q334 or Q340 fail on purpose.** The graded statement must succeed and return the count; the probe runs afterwards, on the database your statements left behind. Dropping or recreating the tables to "demonstrate" the constraint removes the constraint the probe needs.
- **Forgetting that `PRAGMA foreign_keys` defaults to off.** The runner turns it on. In your own database a composite foreign key declared but not enforced is silent, which is the worst of both worlds.

## Try it yourself

1. Run Q331's join without the tenant condition and count the rows. Which two are the leak, and which tenant sees whose data?
2. Rewrite Q337 to fetch the *previous* page, ending at cursor `(2,1)`. Which two things change?
3. Add a third tenant with a project id 1 to the seed in your head and say which of Q332, Q333 and Q336 change their output.
4. In words: Q335's probe fails with `UNIQUE` and Q334's with `FOREIGN KEY`, but both are about the pair `(2,2)`. Explain what each constraint is actually checking, and in which table.

# Subqueries correlated lookups and existence — sql-200 Q031–Q040

**What you practise:** the four shapes a subquery can take — scalar, correlated scalar, `IN`, and `EXISTS`/`NOT EXISTS` — and which one a requirement actually needs.
**Prerequisites:** [03 GROUP BY HAVING and aggregate policy](03-group-by-having-and-aggregate-policy.md); `AVG`/`SUM` over a filtered set; `IS NULL` versus `= NULL`.
**Exercises:** Q031: scalar-global-average, Q032: correlated-department-average, Q033: exists-any-bonus-including-zero, Q034: not-exists-null-safe-antijoin, Q035: in-subquery-positive-bonus, Q036: join-preaggregated-bonus, Q037: correlated-bonus-total, Q038: correlated-no-higher-salary, Q039: correlated-count-higher-colleagues, Q040: relational-division-all-known-paid.

## The problem in plain words

A subquery is a `SELECT` written inside another statement. There are two kinds, and telling them apart is the first thing to learn here.

An **uncorrelated** subquery mentions nothing from the outer query. It can be computed once, on its own, and its value reused for every outer row. `(SELECT AVG(salary) FROM employees)` is one number, 82, and Q031 compares every employee against that same 82.

A **correlated** subquery references a column of the outer row, so conceptually it is re-evaluated per outer row. `(SELECT AVG(x.salary) FROM employees x WHERE x.dept = e.dept)` is a different number depending on which `e` is being tested. Q032 is Q031 with that one clause added, and the answer happens to be the same two people for a different reason.

The second half of the family is about existence rather than values. "Has a bonus row" (Q033), "has no bonus row" (Q034), "is in the set of ids with a positive bonus" (Q035), "every known-salary colleague has a bonus" (Q040). These are membership questions, and the safest tool for them in SQLite is `EXISTS`, because `IN` and especially `NOT IN` change meaning when NULL is in the list.

The seed is built to expose that. `bonuses` contains a row with `employee_id` NULL, and one employee (Flo) has a NULL `salary`. Two exercises mention the trap in their own prompt text: Q034 says "A NULL employee_id in bonuses must not poison the answer (avoid unfiltered NOT IN)", and Q039 says "Unknown salary compares to nothing, producing zero".

## The contract you must honour

The seed for Q031–Q039, quoted from `prompts/Q031.txt`:

```sql
CREATE TABLE employees(id INTEGER PRIMARY KEY,name TEXT,dept TEXT,salary INTEGER);
CREATE TABLE bonuses(employee_id INTEGER,amount INTEGER);
INSERT INTO employees VALUES(1,'Ada','A',100),(2,'Bo','A',80),(3,'Cy','A',80),
  (4,'Dee','B',90),(5,'Eli','B',60),(6,'Flo','C',NULL);
INSERT INTO bonuses VALUES(1,10),(1,5),(3,0),(4,20),(NULL,99);
```

**Q040 seeds one extra row** — `INSERT INTO bonuses VALUES(5,2);` — which gives Eli a bonus and is what makes department B qualify. Read each prompt's seed block; do not assume the family shares one.

- `bonuses` has no key and no `REFERENCES`, so the `(NULL,99)` row is legal and belongs to nobody.
- Ada has two bonus rows (10 and 5); Cy has one worth `0`; Dee has one worth `20`; Bo, Eli and Flo have none in the shared seed.
- Flo's `salary` is NULL. Any comparison involving it — `>`, `<`, `=` — is unknown, so Flo never satisfies a `WHERE`, and Q039 asserts `{"name":"Flo","higher":0}` because no colleague can be *proved* to earn more.
- Q033's wording "even a zero bonus" pins Cy into the answer: a bonus of `0` is a bonus *row*, so existence, not the amount, is the test. Q035's "positive-bonus" excludes Cy.
- Q033 also says "do not duplicate employees". Ada has two bonus rows; a plain inner join would list her twice. The expected result is three rows.
- Q036 expects all six employees with `bonus` 0 where absent, so `COALESCE(...,0)` is required; `SUM` over no rows is NULL.
- Q037 expects only two rows, each carrying its own sum, and explicitly asks for "a correlated scalar aggregate".
- Q038 says "known-salary employees", which excludes Flo: without an explicit `salary IS NOT NULL` guard Flo would pass, because no colleague can be shown to earn more than an unknown.
- Q040 says "require at least one known-salary employee (no vacuous C)". Department C contains only Flo, whose salary is unknown; under plain "for all" logic an empty set satisfies any condition, so an extra `EXISTS` guard is needed.
- Aliases: `name, salary` (Q031, Q032); `name` (Q033, Q034, Q035, Q038); `name, bonus` (Q036, Q037); `name, higher` (Q039); `dept` (Q040).
- `ORDER BY e.id` in all but Q040, which orders by `e.dept`.

## Approach

1. **Ask whether the comparison value depends on the row being tested.** If not, use an uncorrelated scalar subquery: it reads once and stays constant.
2. **Correlate by referencing the outer alias inside the subquery.** Give the outer table an alias (`employees e`) and the inner one a different alias (`employees x`), then write `WHERE x.dept = e.dept`. Reusing the same alias inside would hide the outer row.
3. **For "has at least one matching row", use `EXISTS (SELECT 1 …)`.** `EXISTS` stops at the first row and never looks at what was selected, so `SELECT 1` is conventional. It also cannot duplicate the outer row, unlike a join.
4. **For "has no matching row", use `NOT EXISTS`.** It is NULL-safe: a subquery row whose `employee_id` is NULL simply fails the correlation `b.employee_id = e.id` and is ignored.
5. **`IN` tolerates a NULL in its list; `NOT IN` does not.** Q035's subquery returns `1, 4, NULL` — the orphan `(NULL,99)` row has a positive amount, so its NULL id is in the list. A match still evaluates to true, so `IN` gives the right answer; the same list under `NOT IN` would return nothing.
6. **Prefer a pre-aggregated derived table when the answer needs one value per outer row for every row.** Q036 groups `bonuses` once and left-joins it; that is usually cheaper than re-running a correlated aggregate six times, and it keeps employees with no bonus.
7. **Express "every X satisfies P" as "there is no X that fails P".** That double negative is relational division. Q040 nests two `NOT EXISTS` and adds a third `EXISTS` to reject the vacuous case.
8. **Express "is the maximum" as "no row is strictly greater".** Q038 uses `NOT EXISTS (… WHERE x.salary > e.salary)`, which handles ties naturally: Ada and Dee are unique maxima here, but two equal top salaries would both be returned.

## Worked example — Q031 scalar-global-average

The task: "Return employees above the global average known salary, ordered by id."

**The seed rows.**

| id | name | dept | salary |
| --- | --- | --- | --- |
| 1 | Ada | A | 100 |
| 2 | Bo | A | 80 |
| 3 | Cy | A | 80 |
| 4 | Dee | B | 90 |
| 5 | Eli | B | 60 |
| 6 | Flo | C | NULL |

**Step 1 — the subquery.** `(SELECT AVG(salary) FROM employees)` is uncorrelated, so it is one value computed once. `AVG` skips NULL inputs in both the sum and the count, which is why the prompt says "average *known* salary":

```text
(100 + 80 + 80 + 90 + 60) / 5 = 410 / 5 = 82.0
```

Flo contributes nothing. Had `AVG` counted Flo's row, the divisor would be 6 and the average 68.33.

**Step 2 — WHERE salary > 82.0, row by row.**

| id | name | salary | `salary > 82.0` | kept |
| --- | --- | --- | --- | --- |
| 1 | Ada | 100 | true | yes |
| 2 | Bo | 80 | false | no |
| 3 | Cy | 80 | false | no |
| 4 | Dee | 90 | true | yes |
| 5 | Eli | 60 | false | no |
| 6 | Flo | NULL | unknown | no |

Flo is dropped not because the comparison is false but because it is *unknown*, and `WHERE` keeps only rows that are true. That is three-valued logic, the subject of family 09.

**Step 3 — SELECT name, salary.** No aliases needed: the columns already carry the required names.

**Step 4 — ORDER BY id.** Ada (1) then Dee (4).

The asserted rows in `tests/Q031.cjs`:

```sql
-- [{"name":"Ada","salary":100},{"name":"Dee","salary":90}]
```

The reference solution, as it now reads in `solutions/Q031.sql`:

```sql
-- Why this works:
-- The subquery mentions no column of the outer query, so it is uncorrelated:
-- one value, 82, computed once and compared against every row.
-- AVG ignores NULL inputs, so the divisor is 5 known salaries, not 6 rows.
-- Flo's salary is NULL, and NULL > 82 is unknown rather than false, so the
-- WHERE clause drops Flo without any explicit IS NOT NULL test.
-- ORDER BY id gives the graded order.
SELECT name,
       salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY id;
```

**The Q032 contrast.** Adding `WHERE x.dept = e.dept` to the subquery makes it correlated, so the threshold changes per row: A averages `86.67`, B averages `75`, C averages NULL. Ada (100 > 86.67) and Dee (90 > 75) still qualify; Bo and Cy now fail against a *higher* bar than the global 82, and Flo fails against NULL. Same two names, entirely different arithmetic.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q031 | scalar-global-average | "global average known salary" | uncorrelated `(SELECT AVG(salary) FROM employees)` |
| Q032 | correlated-department-average | "their own department average" | the same subquery gains `WHERE x.dept=e.dept` and an alias |
| Q033 | exists-any-bonus-including-zero | "any bonus row, even a zero bonus" | `EXISTS(SELECT 1 FROM bonuses b WHERE b.employee_id=e.id)` |
| Q034 | not-exists-null-safe-antijoin | "without bonus rows … avoid unfiltered NOT IN" | the same predicate negated: `NOT EXISTS(...)` |
| Q035 | in-subquery-positive-bonus | "set of positive-bonus employee ids" | `id IN(SELECT employee_id FROM bonuses WHERE amount>0)` |
| Q036 | join-preaggregated-bonus | "preaggregate … then left join … missing total zero" | derived table `(SELECT employee_id,SUM(amount) … GROUP BY employee_id)` plus `COALESCE(b.total,0)` |
| Q037 | correlated-bonus-total | "correlated scalar aggregate … at least 15" | the same correlated `SUM` in both `SELECT` and `WHERE` |
| Q038 | correlated-no-higher-salary | "no colleague … earns more", known salary only | `e.salary IS NOT NULL AND NOT EXISTS(… x.salary>e.salary)` |
| Q039 | correlated-count-higher-colleagues | "count … strictly higher", unknown gives zero | correlated `COUNT(*)` in the select list, no `WHERE` at all |
| Q040 | relational-division-all-known-paid | "every known-salary employee has a bonus … no vacuous C" | `EXISTS` guard plus `NOT EXISTS(… NOT EXISTS(…))` |

## Pitfalls the tests are designed to catch

- **`NOT IN` with a NULL in the list.** `SELECT id … WHERE id NOT IN (SELECT employee_id FROM bonuses)` returns **zero rows**, because the list contains NULL and `id <> NULL` is unknown for every candidate. Q034 expects three names and its prompt names the trap. `NOT EXISTS` has no such behaviour.
- **Joining instead of using `EXISTS` in Q033.** `JOIN bonuses b ON b.employee_id=e.id` lists Ada twice, because she has two bonus rows. The expected result is three rows; `SELECT DISTINCT` would also work but `EXISTS` states the intent.
- **Filtering on the amount in Q033.** `b.amount > 0` inside the `EXISTS` drops Cy, whose bonus is `0`. The prompt says "even a zero bonus".
- **Forgetting the amount filter in Q035.** Without `WHERE amount>0`, Cy's zero bonus puts Cy in the list and the answer grows to three rows. Note that the list still contains a NULL either way — the orphan `(NULL,99)` row has a positive amount — and `IN` copes with that, which is precisely the asymmetry Q034 exploits.
- **`SUM` returning NULL in Q036.** Bo, Eli and Flo have no bonus row, so the left join leaves `b.total` NULL. `COALESCE(b.total,0)` is what produces the expected `0`s.
- **Correlating with the wrong alias.** Writing `SELECT AVG(salary) FROM employees WHERE dept = dept` in Q032 compares a column to itself — always true where not NULL — and silently degenerates into the global average. Two distinct aliases (`e` outside, `x` inside) prevent it.
- **Dropping the `IS NOT NULL` guard in Q038.** No colleague can be shown to earn more than Flo's unknown salary, so `NOT EXISTS` is satisfied and Flo appears. The prompt restricts the answer to "known-salary employees", and the expected rows have two entries, not three.
- **Adding a `WHERE` to Q039.** All six employees must appear. The correlated count sits in the select list; filtering anywhere would shrink the result.
- **Expecting Flo's count to be NULL in Q039.** `COUNT(*)` over zero matching rows is `0`, not NULL — the comparison `x.salary > e.salary` is unknown for every colleague, so no row matches, and `COUNT` of nothing is zero. The expected row is `{"name":"Flo","higher":0}`.
- **Vacuous truth in Q040.** Department C has no known-salary employee, so "every known-salary employee has a bonus" is trivially true for it. The prompt rejects that, which is why the query also requires `EXISTS(… k.salary IS NOT NULL)`.
- **Using `DISTINCT` versus `GROUP BY` in Q040.** Employees are one row per person, so the department repeats; `SELECT DISTINCT e.dept` collapses them. `GROUP BY e.dept` would do the same here.
- **Assuming a correlated subquery runs once.** It is evaluated per outer row. On six rows that is invisible; on six million it is the difference between Q037 and Q036, which compute the same totals with very different work.

## Try it yourself

1. Rewrite Q037 with the pre-aggregated derived table of Q036 plus a `WHERE total>=15`. Do you get the same two rows, and what happens to employees with no bonus?
2. Run `SELECT name FROM employees WHERE id NOT IN (SELECT employee_id FROM bonuses)` against the seed. Explain the result you get in terms of three-valued logic.
3. Change Q038 to return every department's top earner, including ties. Which part of the predicate already handles ties?
4. In words: Q031 and Q032 return the same two names. Construct one extra seed row that would make them differ, and say which query changes.

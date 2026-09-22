# GROUP BY HAVING and aggregate policy — sql-200 Q021–Q030

**What you practise:** deciding whether a restriction belongs before grouping (`WHERE`), after grouping (`HAVING`), or inside the aggregate itself — and what each aggregate does with NULL.
**Prerequisites:** [02 Multi-table commerce joins](02-multi-table-commerce-joins.md); `SUM`, `COUNT`, `AVG`; the idea that NULL means "unknown", not "zero".
**Exercises:** Q021: sum-all-statuses, Q022: where-paid-before-group, Q023: having-paid-total-at-least-thirty, Q024: count-rows-versus-values, Q025: average-unknown-excluded, Q026: average-unknown-as-zero, Q027: having-multiple-statuses, Q028: having-no-unknowns, Q029: where-positive-versus-net, Q030: group-by-two-dimensions.

## The problem in plain words

One table, eight rows. `sales(id, region, amount, status)` records money per region, where `amount` may be NULL and `status` is one of `paid`, `pending`, `refund`. Every exercise reports something per region.

A grouped query runs its clauses in a fixed order, and that order is the whole subject of this family. `FROM` produces rows. `WHERE` throws rows away — it runs before any grouping exists, so it cannot see a total. `GROUP BY` collects the survivors into buckets. Aggregates (`SUM`, `COUNT`, `AVG`) reduce each bucket to one value. `HAVING` throws whole buckets away, and it *can* see a total because it runs after the aggregates. `SELECT` names the columns, and `ORDER BY` sorts the final rows.

The second theme is NULL. `amount` is NULL twice in the seed, once in a region that has another value (West) and once in a region that has nothing else (South). Different aggregates react differently: `SUM` and `AVG` skip NULL inputs, `COUNT(*)` counts rows regardless, `COUNT(amount)` counts only non-NULL values, and an aggregate over an all-NULL bucket returns NULL rather than zero. Four of the ten exercises exist to make that visible.

The third theme is that the same intent — "ignore refunds", "ignore unknowns" — can be expressed in three places, and they are not equivalent. Filtering before grouping changes which rows exist. Filtering after grouping changes which regions are reported. Filtering inside the aggregate changes only the number, leaving the group present.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q021.txt`:

```sql
CREATE TABLE sales(id INTEGER PRIMARY KEY,region TEXT,amount INTEGER,status TEXT);
INSERT INTO sales VALUES(1,'East',10,'paid'),(2,'East',20,'paid'),(3,'East',100,'pending'),
  (4,'West',5,'paid'),(5,'West',NULL,'paid'),(6,'North',40,'paid'),(7,'North',-10,'refund'),
  (8,'South',NULL,'pending');
```

- Four regions: East (3 rows), North (2), South (1), West (2). `ORDER BY region` is alphabetical: East, North, South, West.
- South's only `amount` is NULL. Q021 expects `{"region":"South","total":null}` and Q025 expects `{"region":"South","average":null}`. An aggregate over an all-NULL bucket is NULL, and the tests pin that — do not "helpfully" `COALESCE` it to 0 in those two.
- Q026 does the opposite and expects `{"region":"South","average":0}`, because the unknown is replaced *before* averaging.
- North's `amount` values are `40` and `-10`, so its net sum is `30` (Q021) but its paid-only sum is `40` (Q022).
- Q024 pins the `COUNT(*)` versus `COUNT(amount)` difference: South is `{"rows_count":1,"known_count":0}` and West is `{"rows_count":2,"known_count":1}`.
- Rounding is to two decimals in Q025 and Q026. East is `43.33`, from `130/3 = 43.333…`. North is `15` and West (Q026) is `2.5` — `ROUND` returns a real, and `15.0` arrives in JavaScript as the number `15`, which `deepEqual` accepts.
- Q030 returns six `(region, status)` pairs and expects `{"region":"South","status":"pending","entries":1,"total":0}` — here the NULL sum *is* zero-filled, because the prompt says "zero-filled total".
- Aliases are graded: `region, total` (Q021–Q023, Q029), `region, rows_count, known_count` (Q024), `region, average` (Q025, Q026), `region, statuses` (Q027), `region, entries` (Q028), `region, status, entries, total` (Q030).
- Every exercise needs `ORDER BY`; group emission order is not guaranteed.

## Approach

1. **Write the clauses in evaluation order in your head:** `FROM` → `WHERE` → `GROUP BY` → aggregates → `HAVING` → `SELECT` → `ORDER BY`. Then ask which stage the requirement is describing.
2. **"Only rows that …" is `WHERE`.** Q022 ("filter to paid rows before grouping") and Q029 ("discard nonpositive and unknown values before summing") remove rows, so their totals change.
3. **"Only regions that …" is `HAVING`.** Q023, Q027, Q028 and Q029 all keep or drop whole buckets. A `HAVING` may repeat an aggregate expression; SQLite also lets you reference a `SELECT` alias there, but repeating the expression is the portable form and is what the references do.
4. **"Treat unknown as X" is a function inside the aggregate.** `AVG(COALESCE(amount,0))` (Q026) replaces the value before the mean is taken, which changes the denominator's effect: West averages `5` and `0` to `2.5`, not `5`.
5. **Pick the counting function that matches the question.** `COUNT(*)` counts rows. `COUNT(expr)` counts rows where `expr` is not NULL. `COUNT(DISTINCT expr)` counts distinct non-NULL values.
6. **Express "this group has no unknowns" as an equality between two counts.** `HAVING COUNT(*) = COUNT(amount)` is true exactly when no `amount` in the bucket is NULL (Q028). It needs no subquery.
7. **Add a second grouping key for a two-dimensional report.** Q030 groups by `region, status`; every observed combination becomes one row, and combinations that never occur simply do not appear.
8. **`COALESCE(SUM(x),0)` only where the prompt asks for a zero.** Q030 wants it; Q021 forbids it by expecting `null`.

## Worked example — Q021 sum-all-statuses

The task: "Sum amounts by region, retaining SQL NULL when every amount is NULL; order alphabetically."

**Step 1 — FROM sales.** All eight rows.

| id | region | amount | status |
| --- | --- | --- | --- |
| 1 | East | 10 | paid |
| 2 | East | 20 | paid |
| 3 | East | 100 | pending |
| 4 | West | 5 | paid |
| 5 | West | NULL | paid |
| 6 | North | 40 | paid |
| 7 | North | -10 | refund |
| 8 | South | NULL | pending |

**Step 2 — WHERE.** There is none. The prompt says "sum amounts", with no status restriction, so the refund of `-10` and the pending `100` both stay in. This is the row that distinguishes Q021 from Q022.

**Step 3 — GROUP BY region.** Four buckets:

| region | amounts collected |
| --- | --- |
| East | 10, 20, 100 |
| North | 40, -10 |
| South | NULL |
| West | 5, NULL |

**Step 4 — SUM(amount) per bucket.** `SUM` skips NULL inputs. West therefore sums the single known value. South has nothing left to sum after skipping, and `SUM` over an empty set of values is NULL, not 0.

| region | total |
| --- | --- |
| East | 130 |
| North | 30 |
| South | NULL |
| West | 5 |

**Step 5 — SELECT region, SUM(amount) AS total.** The alias is required; without it the column would be named after the expression text.

**Step 6 — ORDER BY region.** SQLite compares TEXT with the default `BINARY` collation, which is byte order. All four names start with a distinct uppercase letter, so byte order and alphabetical order agree: East, North, South, West.

The asserted rows in `tests/Q021.cjs`:

```sql
-- [{"region":"East","total":130},{"region":"North","total":30},
--  {"region":"South","total":null},{"region":"West","total":5}]
```

The reference solution, as it now reads in `solutions/Q021.sql`:

```sql
-- Why this works:
-- No WHERE clause: the prompt sums every status, so the pending 100 and the
-- refund of -10 are both included and North nets to 30.
-- SUM skips NULL inputs rather than propagating them, so West sums to 5 from
-- its single known amount.
-- South has only a NULL amount, and SUM over no surviving values is NULL, not
-- 0, which is the "retaining SQL NULL" the prompt asks for. Wrapping this in
-- COALESCE would break the expected row.
-- ORDER BY region gives the alphabetical order the comparison requires.
SELECT region,
       SUM(amount) AS total
FROM sales
GROUP BY region
ORDER BY region;
```

**The three-way contrast, on the same seed.** Q022 adds `WHERE status='paid'` and East drops to 30, North to 40, and South disappears entirely because it has no paid row — a `WHERE` can remove a whole group by emptying it. Q023 adds `HAVING SUM(amount)>=30` on top and West (5) disappears too, this time as a discarded bucket rather than as missing rows.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q021 | sum-all-statuses | "retaining SQL NULL when every amount is NULL" | `SUM(amount)` with no `WHERE`, no `COALESCE` |
| Q022 | where-paid-before-group | "filter to paid rows before grouping" | adds `WHERE status='paid'` |
| Q023 | having-paid-total-at-least-thirty | "retaining groups whose total is at least 30" | adds `HAVING SUM(amount)>=30` to Q022 |
| Q024 | count-rows-versus-values | "show COUNT(*) and COUNT(amount)" | two count columns instead of a sum |
| Q025 | average-unknown-excluded | "average known amounts … keep all-unknown average NULL" | `ROUND(AVG(amount),2)` |
| Q026 | average-unknown-as-zero | "treat unknown amounts as zero before averaging" | `ROUND(AVG(COALESCE(amount,0)),2)` |
| Q027 | having-multiple-statuses | "at least two distinct statuses" | `COUNT(DISTINCT status)` in both `SELECT` and `HAVING` |
| Q028 | having-no-unknowns | "only regions with no NULL amounts" | `HAVING COUNT(*)=COUNT(amount)` |
| Q029 | where-positive-versus-net | "discard nonpositive and unknown … at least two qualifying rows" | `WHERE amount>0` plus `HAVING COUNT(*)>=2` |
| Q030 | group-by-two-dimensions | "group by region and status … zero-filled total" | `GROUP BY region,status` and `COALESCE(SUM(amount),0)` |

## Pitfalls the tests are designed to catch

- **Putting an aggregate in `WHERE`.** `WHERE SUM(amount)>=30` is a syntax error: `WHERE` runs before any group exists. Q023 needs `HAVING`.
- **Putting a row test in `HAVING` when it changes the total.** `HAVING status='paid'` is accepted by SQLite but means something else — the rows are already grouped, so the totals were computed over all statuses. Q022's East would still show 130 instead of 30.
- **`COALESCE`-ing Q021 or Q025.** South is asserted as `null` in both. `COALESCE(SUM(amount),0)` turns it into `0` and the comparison fails on that one key.
- **Assuming `SUM` of NULLs is 0.** It is NULL. `COUNT` is the aggregate that returns 0 over nothing; `SUM`, `AVG`, `MIN` and `MAX` all return NULL.
- **Confusing Q025 and Q026 on West.** `AVG(amount)` skips the NULL and divides by 1, giving `5`. `AVG(COALESCE(amount,0))` divides by 2, giving `2.5`. The denominator, not just the numerator, changes.
- **`WHERE amount IS NOT NULL` in Q029 as well as `amount>0`.** It is harmless but redundant: `NULL > 0` is unknown, and `WHERE` keeps only true, so NULLs are already gone. The prompt's "nonpositive and unknown" are removed by the single comparison.
- **Reading Q029's `HAVING COUNT(*)>=2` as counting all region rows.** It counts the rows that survived `WHERE`. North has two rows in the table but only one with a positive amount, so it is dropped and East is the only result.
- **`COUNT(DISTINCT status)` versus `COUNT(status)` in Q027.** West has two rows, both `paid`; `COUNT(status)` is 2 and would wrongly include West. `COUNT(DISTINCT status)` is 1.
- **Relying on SQLite's bare-column tolerance.** SQLite lets you `SELECT` a column that is neither grouped nor aggregated, and silently picks a value from an arbitrary row in the bucket. No exercise here needs it, and most other engines reject it.
- **Assuming `ROUND` gives a string or keeps trailing zeros.** `ROUND(15.0,2)` is the real `15.0`, which `node:sqlite` hands back as the JavaScript number `15`. The expected row is `15`, not `"15.00"`.
- **Sorting by the alias versus the column.** Both work in SQLite, but `ORDER BY region` is unambiguous. Text ordering is `BINARY` by default, so a lowercase region name would sort after every uppercase one; that does not bite on this seed but is worth knowing before the string-normalization family (Q101–Q110) introduces `NOCASE`.

## Try it yourself

1. Write the Q023 total with the threshold applied to paid rows only but the *report* still listing every region, using a conditional sum instead of `WHERE`. Which regions gain a row, and what value do they show?
2. Change Q028 to "regions where at least one amount is unknown". Is that a `HAVING` on counts, or is there a shorter expression?
3. Add `status` to Q025's grouping and predict the number of result rows before running it.
4. In words: Q022 removes South from the result and Q023 removes West. Explain which clause did each removal, and why swapping them would not work.

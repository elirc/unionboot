# JSON array expansion and nested traversal — sql-more Q211–Q220

**What you practise:** turning a JSON array stored in one column into rows with `json_each`, walking a whole document with `json_tree`, and keeping control of what happens to empty arrays and duplicate elements.
**Prerequisites:** [01 JSON document projection and type policy](01-json-document-projection-and-type-policy.md); `GROUP BY` with `COUNT` and `SUM`; the difference between an inner join and a `LEFT JOIN`.
**Exercises:** Q211: array-length, Q212: explode-preserve-duplicates, Q213: left-expand-empty-arrays, Q214: distinct-tag-vocabulary, Q215: tag-contains-semijoin, Q216: nested-items-quantity, Q217: sku-rollup-across-documents, Q218: last-array-element, Q219: recursive-json-tree-qty-leaves, Q220: frequency-versus-document-count.

## The problem in plain words

Family 1 read one scalar out of a document. Here the interesting values are *inside arrays*: a basket has a list of tags and a list of item objects. A scalar projection cannot help, because one row of `baskets` has to become several rows of output.

SQLite provides two **table-valued functions** for this. A table-valued function is a function you put in the `FROM` clause instead of a table; it returns rows. `json_each(doc, path)` returns one row per immediate child of the value at `path`. `json_tree(doc)` returns one row for every node anywhere in the document, at any depth, including the root and the containers themselves.

Both expose the same columns. The ones these exercises use are `key` (the array index, an integer, or the member name for an object), `value` (the child's value, as a SQL value for primitives and as JSON text for arrays and objects), `type` (the same labels `json_type` returns), `atom` (the value for primitives, NULL for containers), and `fullkey` (the full path from the root, such as `$.items[0].qty`).

The policy questions in this family are about the *shape* of the expansion rather than about types:

- **Does an empty array produce a row?** Joining `baskets` to `json_each` with a comma (a lateral inner join) drops basket 2 entirely, because it has nothing to pair with. `LEFT JOIN ... ON true` keeps it with a NULL tag.
- **Do repeated elements stay repeated?** Basket 1 lists `red` twice. "Explode" keeps both; "vocabulary" keeps one; "contains" wants the basket once regardless.
- **How deep do you look?** `json_each(body,'$.items')` sees the item objects. Getting `qty` out of them needs a second step — either `json_extract` on `j.value`, or `json_tree`, which descends on its own.

## The contract you must honour

Taken from `prompts/Q211.txt`–`Q220.txt` and `tests/Q211.cjs`–`Q220.cjs`. All ten share one seed:

```sql
CREATE TABLE baskets(id INTEGER PRIMARY KEY, body TEXT);
INSERT INTO baskets VALUES
  (1,'{"tags":["red","blue","red"],"items":[{"sku":"A","qty":2},{"sku":"B","qty":1}]}'),
  (2,'{"tags":[],"items":[]}'),
  (3,'{"tags":["blue"],"items":[{"sku":"A","qty":3}]}');
```

- Basket 2 is the empty-array case, present in every scenario and visible in the output of only one of them (Q211 as `0`, Q213 as a NULL row).
- Basket 1 has the duplicate `red`; basket 3 shares `blue` with basket 1. That pair of facts is what makes Q220's two counts differ.
- There is **no `CHECK(json_valid(body))`** on this table, unlike family 1. The JSON functions still parse the text and would raise on malformed input; nothing in the seed is malformed.
- Aliases per exercise: `id, tags` (Q211); `id, position, tag` (Q212); `id, tag` (Q213); `tag` (Q214); `id` (Q215); `id, sku, qty` (Q216); `sku, qty` (Q217); `id, last_tag` (Q218); `id, fullkey, qty` (Q219); `tag, occurrences, baskets` (Q220).
- Row counts: Q211 3, Q212 4, Q213 5, Q214 2, Q215 1, Q216 3, Q217 2, Q218 3, Q219 3, Q220 2.
- Ordering is stated per prompt: "order by basket id,index" (Q212, Q213, Q216), "alphabetically" (Q214), "order by basket id,fullkey" (Q219). The graded comparison is positional, so the `ORDER BY` is part of the answer, not decoration.
- Q219's `fullkey` values are asserted literally: `"$.items[0].qty"`, `"$.items[1].qty"`, `"$.items[0].qty"`. That string comes from SQLite, so it cannot be spelled by hand.

### Table-valued function behaviour the expected rows depend on

Checked against SQLite 3.49.1 through `node:sqlite` in this session:

- `json_each(body,'$.tags')` over `["red","blue","red"]` returns three rows with `key` = `0,1,2` (SQL type `integer`), `value` = `red,blue,red` (`text`), `type` = `'text'`, `fullkey` = `$.tags[0]` … and `path` = `$.tags` for all three.
- `json_each(body,'$.items')` returns `value` as **JSON text** — `{"sku":"A","qty":2}` — with `type` = `'object'`. That is why Q216 applies `json_extract` to `j.value` rather than reading a column.
- `json_each` over an **empty array returns zero rows**. Written as `FROM baskets b, json_each(...)` this is an inner lateral join and basket 2 disappears; written as `LEFT JOIN json_each(...) ON true` basket 2 survives with every `j` column NULL.
- `json_array_length(doc,path)` returns `0` for an empty array. It also returns `0` when the path points at a non-array, so it is not a membership test.
- `json_extract(body,'$.tags[#-1]')` addresses the **last** element: `#` is the array length and `#-1` the final index. On an empty array it returns SQL NULL rather than raising.
- `json_tree(body)` over basket 1 returns twelve rows: the root `$`, `$.tags` (type `array`), its three elements, `$.items`, the two item objects, and their `sku` and `qty` members. Container rows have `atom` NULL; primitive rows have `atom` set. `key` is the integer index inside arrays and the text member name inside objects.

## Approach

1. **Ask whether one input row can produce many output rows.** If yes, `json_each` goes in the `FROM`; if no, a scalar function such as `json_array_length` or a `[#-1]` path is enough (Q211, Q218).
2. **Join laterally with a comma.** `FROM baskets b, json_each(b.body,'$.tags') j` lets the function see `b.body` for each row. This is an inner join: rows with no children vanish.
3. **Switch to `LEFT JOIN ... ON true` when empty arrays must survive** (Q213). There is no natural join condition — the function is already parameterised by `b.body` — so the condition is the constant `true`.
4. **Take the index from `j.key`** when the prompt asks for a position, and order by it. Ordering by `j.value` would sort `blue` before `red` and break the stated "by index" rule.
5. **Reduce duplicates at the right level.** `DISTINCT` over the exploded values gives a vocabulary (Q214); `EXISTS` over `json_each` gives a semi-join that reports each basket once (Q215); leaving both out preserves every occurrence (Q212).
6. **Descend into object elements with a second `json_extract`** applied to `j.value` (Q216, Q217). `j.value` is the object's JSON text, which is exactly what `json_extract` expects as its first argument.
7. **Aggregate over the exploded rows as if they were a normal table** (Q217, Q220). `GROUP BY` on the extracted `sku`, `SUM` on the extracted `qty`; `COUNT(*)` for occurrences and `COUNT(DISTINCT b.id)` for documents.
8. **Reach for `json_tree` when depth is unknown** (Q219). Filtering `t.key='qty' AND t.type='integer'` says "any member named qty anywhere that holds a primitive integer", which is what "regardless of object depth" asks for.

## Worked example — Q211 array-length

The task, quoted from `prompts/Q211.txt`: "Count tags with json_array_length, preserving empty arrays as zero."

**Step 1 — `FROM baskets`.** Three rows; no expansion at all. This is the one array exercise that does *not* need `json_each`.

| id | `$.tags` |
| --- | --- |
| 1 | `["red","blue","red"]` |
| 2 | `[]` |
| 3 | `["blue"]` |

**Step 2 — `json_array_length(body,'$.tags')`.** The function counts elements at the path and returns an integer.

| id | elements | result |
| --- | --- | --- |
| 1 | red, blue, red | 3 |
| 2 | — | 0 |
| 3 | blue | 1 |

Basket 1 shows that duplicates count separately: `red` appears twice and contributes 2. Basket 2 is the point of the exercise — an empty array is a real array with zero elements, so the answer is `0`, not NULL and not a missing row.

**Step 3 — `AS tags`, `ORDER BY id`.** The alias must be `tags`; the ordering makes the positional comparison safe.

| id | tags |
| --- | --- |
| 1 | 3 |
| 2 | 0 |
| 3 | 1 |

**The asserted result**, from `tests/Q211.cjs`:

```sql
-- [{"id":1,"tags":3},{"id":2,"tags":0},{"id":3,"tags":1}]
```

The reference solution as it now reads in `solutions/Q211.sql`:

```sql
-- Why this works:
-- json_array_length counts the elements at a path without expanding them, so
-- one basket stays one row and no join is needed.
-- Duplicates count separately: basket 1 holds red twice and reports 3.
-- An empty array is still an array, so basket 2 reports 0 rather than NULL
-- or disappearing, which is what the prompt means by preserving empty
-- arrays as zero.
-- ORDER BY id fixes the row order the exact comparison depends on.
SELECT id,
       json_array_length(body, '$.tags') AS tags
FROM baskets
ORDER BY id;
```

**Contrast with Q212**, which answers a related question by expanding instead of counting. `FROM baskets b, json_each(b.body,'$.tags') j` produces four rows — three from basket 1, one from basket 3 — and basket 2 contributes none, because an inner lateral join has nothing to pair it with. Q213 is Q212 with the join turned into `LEFT JOIN ... ON true`, which adds back basket 2 as a single NULL-tag row and makes the count five.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q211 | array-length | "count tags … empty arrays as zero" | no expansion: `json_array_length(body,'$.tags')` |
| Q212 | explode-preserve-duplicates | "expand all tags with zero-based index" | comma lateral join to `json_each`, select `j.key AS position, j.value AS tag` |
| Q213 | left-expand-empty-arrays | "retaining one NULL-tag row for empty arrays" | the same join becomes `LEFT JOIN json_each(...) ON true` |
| Q214 | distinct-tag-vocabulary | "distinct tags alphabetically" | adds `DISTINCT`, drops the id, `ORDER BY tag` |
| Q215 | tag-contains-semijoin | "containing red at least once; do not duplicate baskets" | `WHERE EXISTS(SELECT 1 FROM json_each(b.body,'$.tags') WHERE value='red')` |
| Q216 | nested-items-quantity | "expand items and extract SKU and qty" | expands `'$.items'`, then `json_extract(j.value,'$.sku')` and `'$.qty'` |
| Q217 | sku-rollup-across-documents | "sum quantities … grouped by SKU" | Q216 plus `SUM(...)` and `GROUP BY sku` |
| Q218 | last-array-element | "final tag using JSON path `[#-1]`" | no expansion: `json_extract(body,'$.tags[#-1]')` |
| Q219 | recursive-json-tree-qty-leaves | "every primitive leaf whose key is qty, regardless of depth" | `json_tree(b.body)` with `WHERE t.key='qty' AND t.type='integer'`, selecting `t.fullkey` and `t.atom` |
| Q220 | frequency-versus-document-count | "total occurrences and distinct baskets" | `COUNT(*)` beside `COUNT(DISTINCT b.id)`, grouped by `j.value` |

## Pitfalls the tests are designed to catch

- **Expecting basket 2 in Q212.** The comma join is an inner join. `json_each` over `[]` returns no rows, so basket 2 has no partner and drops. The expected result has four rows, all from baskets 1 and 3.
- **Writing `LEFT JOIN json_each(...)` without a condition.** SQLite requires `ON` (or `USING`) on a `LEFT JOIN`; the idiom is `ON true`. `ON 1` works too, but `true` says what is meant.
- **Ordering Q213 by `j.value`.** Basket 2's `j.key` is NULL after the left join, and NULL sorts first in an ascending SQLite `ORDER BY` — but the outer `b.id` is compared first, so basket 2 still lands between 1 and 3. Ordering by value instead would put `blue` before `red` inside basket 1 and fail.
- **Using `DISTINCT` in Q212.** Basket 1's two `red` rows differ by `position`, so `DISTINCT` on the full row would not remove them — but on a projection without the index it would, silently losing a row the prompt calls for.
- **Joining instead of using `EXISTS` in Q215.** `FROM baskets b, json_each(...) j WHERE j.value='red'` returns basket 1 **twice**, because the tag appears twice. The expected result is one row. `EXISTS` stops at the first match, which is what a semi-join means.
- **Treating `j.value` as a column set in Q216.** For an object element, `j.value` is the object's JSON *text*. There is no `j.sku`. The second `json_extract` is mandatory.
- **Grouping by `j.value` in Q217.** That groups whole item objects, so `{"sku":"A","qty":2}` and `{"sku":"A","qty":3}` land in different buckets and SKU A never reaches 5. The `GROUP BY` must name the extracted `sku`.
- **Using `$.tags[-1]` in Q218.** SQLite's path syntax has no plain negative index; the last element is `[#-1]`, where `#` stands for the array length. On basket 2's empty array this returns NULL, which is exactly the expected third row.
- **Dropping the `t.type='integer'` filter in Q219.** `json_tree` also visits container nodes; without the type test a `qty` holding an object or array would appear with a NULL `atom`. On this seed the filter changes nothing, but the prompt says "primitive leaf", and the reviewer reads the file.
- **Selecting `t.value` instead of `t.atom` in Q219.** For these primitive integers the two agree. They differ on containers, where `value` is JSON text and `atom` is NULL — so `atom` is the column that means "leaf value".
- **Confusing the two counts in Q220.** `blue` occurs twice in two different baskets; `red` occurs twice in one basket. `COUNT(*)` gives 2 for both, and only `COUNT(DISTINCT b.id)` separates them into 2 and 1.
- **Omitting `ORDER BY` anywhere.** Expansion order is not promised by SQLite even though it happens to follow array order today.

## Try it yourself

1. Rewrite Q215 using `IN`: `WHERE 'red' IN (SELECT value FROM json_each(b.body,'$.tags'))`. Does it return the same single row, and does it still avoid duplicating baskets?
2. Change Q213 so that basket 2 shows the text `'(none)'` instead of NULL. Which function wraps which column, and does the `ORDER BY` still work?
3. Use `json_tree` to answer Q214 without naming `$.tags`. What extra `WHERE` conditions are needed to avoid picking up `sku` values?
4. In words: Q211 and Q212 read the same array. Explain when a team should store a count column alongside the JSON instead of calling `json_array_length` on every query.

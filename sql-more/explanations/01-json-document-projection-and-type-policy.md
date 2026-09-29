# JSON document projection and type policy — sql-more Q201–Q210

**What you practise:** pulling values out of a JSON text column with SQLite's JSON1 functions, and deciding — deliberately — what happens when a key is missing, is explicitly `null`, or holds the "wrong" JSON type.
**Prerequisites:** `SELECT ... FROM ... WHERE ... ORDER BY`; the difference between SQL `NULL` and a value; the idea that SQLite columns store a *type per value*, not per column.
**Exercises:** Q201: scalar-name, Q202: preserve-numeric-versus-text, Q203: json-type-missing-versus-null, Q204: require-json-integer, Q205: coerce-known-age, Q206: json-boolean-true-only, Q207: json-rendered-versus-sql-extracted, Q208: missing-path-only, Q209: explicit-null-only, Q210: multi-path-json-array.

## The problem in plain words

A table stores documents as JSON text. One column, `body`, holds a whole object per row. The rest of the application wants ordinary SQL columns: a name, an age, a flag. Turning the first into the second is *projection*, and SQLite does it with the **JSON1** functions — a built-in set of functions (`json_valid`, `json_extract`, `json_type`, and the `->` / `->>` operators) that parse the text on every call.

The awkward part is not the extraction. It is that a JSON document has more states than a SQL column does. A key can be present with a value, present with the value `null`, or absent entirely. JSON distinguishes the number `30` from the string `"20"`. SQL has one `NULL` and no boolean type at all. So every exercise in this family is really the same question asked ten ways: **when the document and the column disagree, which one wins?**

That decision is what the family calls a *type policy*. Three policies show up:

- **Preserve** — take whatever JSON had and let the SQL value inherit its type (Q201, Q202, Q210).
- **Require** — refuse rows whose JSON type is not the one you asked for (Q204, Q206, Q209).
- **Coerce** — force the value into a SQL type and accept the conversion rules (Q205).

The seed is built to make each policy visible. Ada's age is the JSON number `30`; Bo's age is the JSON *string* `"20"`, which looks like a number and is not one; Cy has no `age` key at all. Ada's `city` is explicit JSON `null`; Bo has no `city` key; Cy's city is the string `"Rome"`.

## The contract you must honour

Taken from `prompts/Q201.txt`–`Q210.txt` and `tests/Q201.cjs`–`Q210.cjs`. All ten exercises share one seed:

```sql
CREATE TABLE docs(id INTEGER PRIMARY KEY, body TEXT CHECK(json_valid(body)));
INSERT INTO docs VALUES
  (1,'{"name":"Ada","age":30,"active":true,"city":null}'),
  (2,'{"name":"Bo","age":"20","active":false}'),
  (3,'{"name":"Cy","active":true,"city":"Rome"}');
```

- Each run opens a **fresh `:memory:` database**, executes `PRAGMA foreign_keys=ON`, runs the seed, then your SQL. Nothing carries over between exercises.
- Only the **final statement** returns graded rows. `runtime.cjs` splits your text on semicolons, skipping semicolons inside string quotes and inside `--` or `/* */` comments, and keeps the rows of the last statement that contains code.
- Grading is `assert.deepEqual(actual, expected, 'Exact result rows/order mismatch')`. Exact rows, exact order, exact column names. An extra column fails; a differently spelled alias fails.
- Aliases per exercise: `id, name` (Q201); `id, age, kind` (Q202); `id, kind` (Q203); `id` (Q204, Q206, Q208, Q209); `id, age` (Q205); `json_name, sql_name` (Q207); `id, pair` (Q210).
- Row counts are pinned: Q201 3, Q202 3, Q203 3, Q204 1, Q205 3, Q206 2, Q207 1, Q208 1, Q209 1, Q210 3.
- `ORDER BY id` appears in every multi-row exercise. Without it SQLite makes no ordering promise and the positional comparison can fail on a different SQLite build. Q207 returns a single row selected by `WHERE id=1` and needs no `ORDER BY`.
- `CHECK(json_valid(body))` is part of the schema: every stored `body` is guaranteed parseable, so none of the queries has to defend against malformed text.
- NULL arrives in the expected rows as JSON `null` (Q202 row 3 is `{"id":3,"age":null,"kind":"null"}` — note that `kind` there is the *four-character string* `"null"`, not a null, because `typeof(NULL)` is the text `'null'`). Q203 row 2 is the opposite: `"kind": null`, a real SQL NULL.

### JSON1 behaviour the expected rows depend on

Each of these was checked against SQLite 3.49.1 through `node:sqlite` in this session:

- `json_extract(body,'$.k')` with **one** path returns a SQL value whose type mirrors the JSON type: JSON number → `integer`/`real`, JSON string → `text`, JSON `null` → SQL NULL, **JSON `true`/`false` → integer `1`/`0`** (SQLite has no boolean storage type).
- `json_extract` at a **missing** path also returns SQL NULL. So `json_extract` alone cannot tell "absent" from "present but null" — that is exactly why Q203, Q208 and Q209 use `json_type` instead.
- `json_extract(body,'$.a','$.b')` with **two or more** paths returns `text`: a rendered JSON array such as `["Ada",null]`. A path that is missing contributes `null` inside that array.
- `json_type(body,'$.k')` returns a text label — `'null'`, `'true'`, `'false'`, `'integer'`, `'real'`, `'text'`, `'array'`, `'object'` — or **SQL NULL when the path does not exist**.
- `body->'$.k'` yields the value *rendered as JSON text*, so a string keeps its quotes: `"Ada"` is five characters. `body->>'$.k'` yields the SQL value, `Ada`, three characters. Both operators are SQLite (and MySQL) specific; there is no `->>` in the SQL standard.
- `CAST('20' AS INTEGER)` is `20`; `CAST(NULL AS INTEGER)` is NULL; `CAST('abc' AS INTEGER)` is `0`, silently. SQLite's cast never raises.

## Approach

1. **Decide which of the three states you care about** — value, explicit null, absent — before choosing a function. That single decision picks `json_extract` (value) or `json_type` (state).
2. **Project with `json_extract(body,'$.key')`** when you want the value and are happy to inherit its JSON type (Q201, Q202).
3. **Report the SQL type with `typeof(...)`**, applied to the extracted value, not to `body` (Q202). `typeof(body)` would always be `text`.
4. **Filter on JSON type with `json_type(body,'$.key') = '<label>'`** when the policy is "require" (Q204 `'integer'`, Q206 `'true'`, Q209 `'null'`). Comparing the *label* keeps numeric-looking strings out, which a value comparison would let in.
5. **Test for an absent key with `json_type(...) IS NULL`** (Q208). `IS NULL` and not `= NULL`: any `=` comparison against NULL is unknown, and `WHERE` keeps only rows that are true.
6. **Coerce with `CAST(... AS INTEGER)`** when the policy is "make it a number whatever it looked like" (Q205). CAST passes NULL through unchanged, which is how Cy's missing age stays `null` instead of becoming `0`.
7. **Choose `->` or `->>` by whether the caller wants JSON text or a SQL value** (Q207). `->` for re-embedding into another document, `->>` for handing to application code.
8. **Ask for several paths in one `json_extract` call** when the required output is a small JSON array (Q210). One call, one text value; SQLite decides the rendering.

## Worked example — Q201 scalar-name

The task, quoted from `prompts/Q201.txt`: "Extract name as SQL text, ordered by id."

**The seed rows.**

| id | body |
| --- | --- |
| 1 | `{"name":"Ada","age":30,"active":true,"city":null}` |
| 2 | `{"name":"Bo","age":"20","active":false}` |
| 3 | `{"name":"Cy","active":true,"city":"Rome"}` |

**Step 1 — `FROM docs`.** Three rows, each with a `body` that the `CHECK(json_valid(body))` constraint has already proved parseable.

**Step 2 — `json_extract(body,'$.name')` per row.** The path `$` is the document root; `$.name` is the member called `name`. Each document has one.

| id | `$.name` in JSON | extracted SQL value | `typeof` |
| --- | --- | --- | --- |
| 1 | `"Ada"` | `Ada` | text |
| 2 | `"Bo"` | `Bo` | text |
| 3 | `"Cy"` | `Cy` | text |

The JSON quotes are gone. `json_extract` with a single path returns the *value*, not its JSON rendering — that is the difference Q207 makes explicit.

**Step 3 — `AS name`.** Without the alias the column would be named after the whole expression, `json_extract(body,'$.name')`, and `deepEqual` compares object keys, so the row would fail on the key alone.

**Step 4 — `ORDER BY id`.** `id` is `INTEGER PRIMARY KEY`, so it is the table's rowid and the scan happens to emit rows in that order already; the clause is what makes it a guarantee rather than an accident.

| id | name |
| --- | --- |
| 1 | Ada |
| 2 | Bo |
| 3 | Cy |

**The asserted result**, from `tests/Q201.cjs`:

```sql
-- [{"id":1,"name":"Ada"},{"id":2,"name":"Bo"},{"id":3,"name":"Cy"}]
```

The reference solution as it now reads in `solutions/Q201.sql`:

```sql
-- Why this works:
-- json_extract with a single path returns the JSON value as a SQL value, so
-- the JSON string "Ada" arrives as the three-character text Ada, unquoted.
-- Every seeded document has a name key, so no row extracts to NULL here.
-- AS name is required: without it the column would be named after the whole
-- json_extract expression and the graded key comparison would fail.
-- ORDER BY id turns the incidental rowid order into a guaranteed one.
SELECT id,
       json_extract(body, '$.name') AS name
FROM docs
ORDER BY id;
```

**Contrast with Q207**, which is the same extraction written twice with different operators: `body->'$.name'` gives `"Ada"` *with* the quote characters, `body->>'$.name'` gives `Ada`. `->>` is the operator form of the single-path `json_extract` used above.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q201 | scalar-name | "extract name as SQL text" | `json_extract(body,'$.name') AS name` |
| Q202 | preserve-numeric-versus-text | "and SQLite typeof of the extracted SQL value" | adds `typeof(json_extract(body,'$.age')) AS kind` |
| Q203 | json-type-missing-versus-null | "report JSON type at city" | `json_type` replaces `json_extract`, so absent returns NULL and JSON null returns `'null'` |
| Q204 | require-json-integer | "reject numeric-looking JSON strings" | `WHERE json_type(body,'$.age')='integer'` |
| Q205 | coerce-known-age | "cast extracted age to INTEGER" | wraps the extraction in `CAST(... AS INTEGER)` |
| Q206 | json-boolean-true-only | "using json_type, not string comparisons" | `WHERE json_type(body,'$.active')='true'` |
| Q207 | json-rendered-versus-sql-extracted | "show `->` and `->>` for id 1" | two operator projections, `WHERE id=1`, no `ORDER BY` |
| Q208 | missing-path-only | "no city key; explicit JSON null must not qualify" | `WHERE json_type(body,'$.city') IS NULL` |
| Q209 | explicit-null-only | "city is explicit JSON null, excluding missing keys" | the same predicate becomes `='null'` |
| Q210 | multi-path-json-array | "extract name and city together" | one call, two paths: `json_extract(body,'$.name','$.city') AS pair` |

## Pitfalls the tests are designed to catch

- **Using `json_extract` where the policy needs `json_type`.** `json_extract(body,'$.city')` is NULL for both Ada (explicit null) and Bo (no key). Q208 expects only `{"id":2}` and Q209 only `{"id":1}`, so a single `IS NULL` test on the extracted value returns two rows for each and fails both.
- **Writing `json_type(...) = NULL` in Q208.** Always unknown, never true; the result is zero rows. `IS NULL` is the only test that works.
- **Comparing the value instead of the type in Q204.** `WHERE json_extract(body,'$.age') = 30` happens to give the right single row here, but `WHERE json_extract(body,'$.age') > 10` would also admit Bo, because SQLite compares `'20'` and `10` by type class and text sorts after numbers — the prompt's phrase "rejecting numeric-looking JSON strings" is the policy being tested.
- **Comparing `json_extract(body,'$.active') = 'true'` in Q206.** The extracted boolean is the integer `1`, not the text `'true'`, so that predicate matches nothing. Only `json_type(...) = 'true'` sees the JSON-level type. The prompt says so in words: "using json_type, not string comparisons".
- **Assuming a JSON boolean stays a boolean.** SQLite has no boolean storage class; `typeof(json_extract(body,'$.active'))` is `integer`. If Q202 had asked about `active`, `kind` would read `"integer"`.
- **Expecting `kind` in Q202 to be a SQL NULL for Cy.** It is the text `'null'`: `typeof(NULL)` returns that four-character string. Q203's `kind` for Bo *is* a real NULL. Reading the two expected blocks side by side is the fastest way to see the difference.
- **Using `->` where the test wants `->>`, or the reverse, in Q207.** The expected `json_name` is `"\"Ada\""` — five characters including two quote marks. Swapping the operators produces two identical unquoted values and fails.
- **Casting where the prompt says preserve.** `CAST` in Q202 would turn Bo's `"20"` into `20` and `kind` into `integer`, destroying the very distinction the exercise demonstrates. Conversely, leaving the `CAST` out of Q205 returns `"20"` as text where `20` is expected.
- **Worrying that `CAST(NULL AS INTEGER)` becomes 0.** It does not; it stays NULL, which is what keeps Q205's third row `null`. `CAST('abc' AS INTEGER)` *is* `0` though — a silent coercion worth knowing about before you apply this policy to untrusted data.
- **Hand-building the array in Q210.** `'[' || ... || ']'` produces text that differs from SQLite's rendering in spacing and in how it writes the missing city, and `'x' || NULL` is NULL in SQLite, so the whole value would blank out. One `json_extract` call with two paths returns exactly `["Bo",null]`.
- **Omitting `ORDER BY`.** The comparison is positional. A query that passes today can reorder on another build or once an index changes the plan.
- **Adding a helper column "for clarity".** Any extra key fails `deepEqual`. Put the explanation in a `--` comment; the tokenizer ignores everything to the end of that line, including semicolons.

## Try it yourself

1. Write one query that returns `id`, and a `status` column reading `'missing'`, `'null'` or `'present'` for `city`, using a single `CASE` over `json_type`. Which of the three states needs `IS NULL` rather than `=`?
2. Add a fourth document whose `age` is the JSON real `20.5`. Which of Q202, Q204 and Q205 change their output, and to what?
3. Change Q210 to return `name` and a `city` that reads `'?'` when absent. Does `json_extract` with two paths still help, or do you need two calls plus `COALESCE`?
4. In words: `json_extract` and `->>` do the same thing for a single path. Give one reason a team might still standardise on the function form.

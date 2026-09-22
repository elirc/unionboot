# Parameterized queries with node sqlite bindings — sql-200 Q181–Q190

**What you practise:** writing SQL whose values arrive separately from its text — positional `?` and named `$name` parameters, bound `LIKE` patterns, paged `LIMIT`/`OFFSET`, and the reason string interpolation is never the answer.
**Prerequisites:** [11 String normalization parsing and matching](11-string-normalization-parsing-and-matching.md) for `LIKE`; [12 CASE pivot and conditional aggregation](12-case-pivot-and-conditional-aggregation.md) for Q190's conditional count; `ORDER BY` with `LIMIT`.
**Exercises:** Q181: positional-parameters, Q182: named-parameter-object, Q183: bound-like-pattern, Q184: limit-offset-parameterized-pagination, Q185: parameterized-in-list-dynamic-placeholders, Q186: parameterized-aggregate-minimum-price, Q187: parameterized-update-raise-price, Q188: bound-quote-containing-value, Q189: parameterized-between-range, Q190: parameterized-conditional-aggregate.

## The problem in plain words

Five products, and ten queries whose values are supplied by the caller rather than written into the SQL. A **parameter** (also called a bind variable or a placeholder) is a marker in the statement text that stands for a value the driver supplies separately when the statement runs.

Two things follow from that separation, and both are the point of this family.

The first is safety. A parameter is never parsed as SQL, so a value containing an apostrophe, a semicolon or the word `DROP` is just data. Q188 makes this concrete: the bound value is `O'Brien pen` with no escaping of any kind, and it matches a row that had to be written in the seed as `'O''Brien pen'` because *there* it was inside a SQL literal.

The second is reuse. The statement text is fixed, so the database can prepare it once and run it with different values — which is also why a placeholder can stand for a value but never for a column name, a table name or a keyword.

How this pack binds them is worth reading once, from `runtime.cjs`. Only the final statement gets parameters, and the shape of the test's `params` decides the call: an array is spread as positional arguments (`stmt.all(...bound)`), and a single object is passed as one argument (`stmt.all(bound)`), which is how named parameters arrive. `spec.params` for Q181 is `["office",5]`; for Q182 it is `[{"$category":"office"}]` — an array holding one object.

## The contract you must honour

Eight of the ten exercises share this seed, quoted from `prompts/Q181.txt`:

```sql
CREATE TABLE products(id INTEGER PRIMARY KEY,name TEXT,category TEXT,price INTEGER);
INSERT INTO products VALUES(1,'Pen','office',3),(2,'Mug','home',8),(3,'Pad','office',12),
  (4,'Lamp','home',20),(5,'Rug','home',50);
```

Q188 adds one more row, whose name contains an apostrophe:

```sql
INSERT INTO products VALUES(6,'O''Brien pen','office',9);
```

- The bound values are fixed by the tests and are not yours to choose. They are, in order: Q181 `["office",5]`; Q182 `[{"$category":"office"}]`; Q183 `["P%"]`; Q184 `["home",1,1]`; Q185 `[1,3]`; Q186 `["home"]`; Q187 `[2,2]`; Q188 `["O'Brien pen"]`; Q189 `[3,12]`; Q190 `[10,"home"]`.
- **Positional parameters bind in the order the `?` marks appear in the statement text**, not in the order the clauses read. Q190's params are `[10,"home"]` because its threshold `?` sits in the `SELECT` list, before the `?` in `WHERE`.
- The number of `?` marks must match the number of values. `SELECT … WHERE id IN (?,?)` needs exactly two.
- Aliases: `id, name` (Q181, Q183, Q184, Q185, Q188); `id, name, price` (Q182, Q189); `cheapest` (Q186); `id, price` (Q187); `total, expensive` (Q190).
- Row counts: Q181, Q184, Q186, Q187 and Q188 return 1 row; Q182, Q183 and Q185 return 2; Q189 returns 3; Q190 returns 1.
- Q184's expected row is `{"id":4,"name":"Lamp"}`: home products by ascending price are Mug 8, Lamp 20, Rug 50, and `LIMIT 1 OFFSET 1` is the second of them.
- Q186 expects `{"cheapest":8}` — one row, because an aggregate with no `GROUP BY` always produces exactly one row.
- Q187's final statement is the `UPDATE … RETURNING`, asserted as `[{"id":2,"price":10}]` — the price *after* the increase.
- Q190 expects `{"total":78,"expensive":2}`: 8 + 20 + 50 over the home category, of which two items cost more than 10.

## Approach

1. **Put a placeholder wherever a value would go,** and nowhere else. Values in `WHERE`, `SET`, `LIMIT`, `OFFSET`, `BETWEEN` and inside expressions can all be bound; identifiers and keywords cannot.
2. **Count the `?` marks in text order** and line them up with the caller's array. Reversing two same-typed parameters produces no error, just a wrong answer — Q187 would add 2 to the wrong product.
3. **Use named parameters when order is a liability.** `$category` binds by name, so the caller passes an object and the mapping is explicit. SQLite also accepts `:name` and `@name`; this pack uses the `$` form.
4. **Bind the whole `LIKE` pattern, including its wildcards.** `WHERE name LIKE ?` with `'P%'` is right; building `'LIKE ''' || ? || '%'''` in SQL text is the interpolation this family exists to avoid.
5. **Generate the *structure* of an `IN` list, never the values.** One placeholder per element — `(?,?)` for two ids — built from the length of the caller's array.
6. **Let `LIMIT ?` and `OFFSET ?` take bound values,** and always pair them with an `ORDER BY`; without one, "the second row" has no meaning.
7. **Never quote a placeholder.** `WHERE name = '?'` searches for the one-character string `?`. The `?` stands for the whole value, quotes included.
8. **Remember `RETURNING` when a mutation's result is what the caller wants,** and keep it to one row for a deterministic order.

## Worked example — Q181 positional-parameters

The task, quoted from the prompt: "Use positional ? binding for category and max price. The harness binds params after the SQL; return id,name ordered by id."

**Step 1 — the statement is prepared with its two placeholders.** The database sees the text below and nothing else; at this point it has no idea what `'office'` or `5` are.

```sql
SELECT id, name FROM products WHERE category = ? AND price <= ? ORDER BY id;
```

**Step 2 — the harness binds `["office",5]` positionally.** The first `?` in text order is the category, the second is the price.

| placeholder | bound value |
| --- | --- |
| 1st `?` | `'office'` |
| 2nd `?` | `5` |

**Step 3 — `WHERE category = 'office'` is evaluated per row.**

| id | name | category | price | category matches? |
| --- | --- | --- | --- | --- |
| 1 | Pen | office | 3 | yes |
| 2 | Mug | home | 8 | no |
| 3 | Pad | office | 12 | yes |
| 4 | Lamp | home | 20 | no |
| 5 | Rug | home | 50 | no |

**Step 4 — `AND price <= 5` narrows it further.** Pad costs 12, so only Pen survives.

| id | name | price | kept? |
| --- | --- | --- | --- |
| 1 | Pen | 3 | yes |
| 3 | Pad | 12 | no |

**Step 5 — `SELECT id, name` and `ORDER BY id`** gives the single row `{"id":1,"name":"Pen"}`, which is what `tests/Q181.cjs` asserts.

The reference solution, as it now reads in `solutions/Q181.sql`:

```sql
-- Why this works:
-- ? is a positional parameter. The harness binds the test's params array to
-- the final prepared statement in order, so the first ? is 'office' and the
-- second is 5.
-- The values never appear in the SQL text: node:sqlite sends them
-- separately, so quoting and escaping are not the query's problem.
-- Only Pen (office, 3) satisfies both predicates; Pad is office but costs
-- 12.
SELECT id, name
FROM products
WHERE category = ?
  AND price <= ?
ORDER BY id;
```

**Q182, the named form.** The same filter written as `WHERE category = $category`, with the caller passing `{"$category":"office"}`. Because the binding is by name, adding a second parameter later cannot silently shift the first one, and the same name may be used twice in the statement while being supplied once.

**Q188, the escaping contrast.** The seed writes the product name as `'O''Brien pen'`: inside a SQL string literal an apostrophe is escaped by doubling it. The query binds the JavaScript string `O'Brien pen`, untouched. Both describe the same eight characters, and only one of them had to think about quoting — because only one of them was SQL text.

## Policy matrix — what changes between the variants

| ID | Variant | Bound values | What changes in the SQL |
| --- | --- | --- | --- |
| Q181 | positional-parameters | `["office",5]` | two `?` in `WHERE`, bound in text order |
| Q182 | named-parameter-object | `[{"$category":"office"}]` | `$category` in place of `?`; the driver receives an object |
| Q183 | bound-like-pattern | `["P%"]` | `WHERE name LIKE ?` — the wildcard is inside the value |
| Q184 | limit-offset-parameterized-pagination | `["home",1,1]` | `LIMIT ? OFFSET ?` after `ORDER BY price` |
| Q185 | parameterized-in-list-dynamic-placeholders | `[1,3]` | `WHERE id IN (?,?)` — one placeholder per element |
| Q186 | parameterized-aggregate-minimum-price | `["home"]` | `MIN(price)` with the bound value in `WHERE` |
| Q187 | parameterized-update-raise-price | `[2,2]` | an `UPDATE … SET price = price + ? WHERE id = ? RETURNING id,price` |
| Q188 | bound-quote-containing-value | `["O'Brien pen"]` | nothing special — that is the lesson |
| Q189 | parameterized-between-range | `[3,12]` | `WHERE price BETWEEN ? AND ?` |
| Q190 | parameterized-conditional-aggregate | `[10,"home"]` | a `?` inside a `CASE` in the `SELECT` list, and another in `WHERE` |

## Pitfalls the tests are designed to catch

- **Quoting the placeholder.** `WHERE category = '?'` compares against the literal string `?` and returns no rows; Q181 then fails on an empty result.
- **Getting the positional order wrong.** Q190's params are `[10,"home"]`. Writing the `WHERE` first in the text and expecting `"home"` to land there binds the number 10 to `category` and the string to the price comparison, and the aggregates come back wrong rather than erroring.
- **Swapping Q187's two values.** Both are `2`, so this particular test cannot catch it — the tiebreak-style trap the prompt warns about. Read the text order and bind accordingly.
- **Interpolating the pattern in Q183.** `WHERE name LIKE ? || '%'` with a bound `'P'` happens to return the same two rows, but it moves part of the pattern into the SQL and breaks the moment a value contains `%` or `_`.
- **Escaping the apostrophe in Q188's bound value.** Passing `O''Brien pen` searches for a name with two apostrophes and returns nothing. The doubling rule belongs to SQL literals, not to parameters.
- **Wrong placeholder count in Q185.** The two directions fail differently. More values than placeholders raises `column index out of range`. *Fewer* values than placeholders raises nothing at all: the extra parameter stays unbound and reads as NULL, so `IN (?,?,?)` with `[1,3]` becomes `IN (1,3,NULL)` and quietly returns the same rows. The list length has to be generated with the list.
- **Trying to bind a whole list to one `?`.** There is no array parameter in SQL. `WHERE id IN (?)` with `[1,3]` raises `column index out of range`, and with one value it means "equal to that single value".
- **Omitting `ORDER BY` in Q184.** `LIMIT 1 OFFSET 1` without an order picks an unspecified row; the expected `Lamp` depends on the price ordering.
- **Treating `OFFSET` as a page number.** It counts rows skipped. Page 2 with page size 1 is `OFFSET 1`, not `OFFSET 2`.
- **Expecting Q186 to return no rows for an unmatched category.** An aggregate with no `GROUP BY` always returns exactly one row; if nothing matched, `MIN` would be NULL and the row would still be there.
- **Assuming `BETWEEN` is exclusive.** It is `>= low AND <= high`, which is why Pad at exactly 12 is in Q189's expected rows. It also does not reorder its bounds: `BETWEEN 12 AND 3` matches nothing.
- **Adding a `SELECT` after Q187's `UPDATE`.** Only the last statement is graded, so the `RETURNING` output would be replaced by whatever the extra `SELECT` produced.

## Try it yourself

1. Change Q181's bound price to 12 in your head and say how many rows come back, then do the same for Q189 with `[8,8]`.
2. Rewrite Q190 with named parameters so that the order of the two values stops mattering. How many characters change, and which clause is no longer order-sensitive?
3. Q185 hard-codes two placeholders. Write, in words, what the calling code must do to support a list of any length, and say what part of the statement is generated and what part never is.
4. In words: explain why a placeholder can stand for a value but not for a column name, using the idea that the statement is prepared before the values arrive.

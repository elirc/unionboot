# Multi-table commerce joins — sql-200 Q011–Q020

**What you practise:** walking a four-table schema in the right direction, and keeping an aggregate honest when a join multiplies rows.
**Prerequisites:** [01 Join preservation and matching](01-join-preservation-and-matching.md); `GROUP BY` with `SUM`/`COUNT`; the difference between `COUNT(*)` and `COUNT(x)`.
**Exercises:** Q011: paid-line-detail, Q012: paid-spend-preserve-customers, Q013: category-paid-revenue, Q014: distinct-paid-buyers-per-product, Q015: order-count-not-line-count, Q016: office-paid-customers-semijoin, Q017: pending-reserved-quantities, Q018: customer-category-paid-breakdown, Q019: customers-with-no-paid-lines, Q020: average-paid-order-not-line.

## The problem in plain words

Four tables model a tiny shop. `customers` has four people. `orders` links a customer to a status (`paid`, `pending`, `cancelled`). `lines` is the order detail: one row per product on an order, with `qty` and `price`. `products` names each item and puts it in a `category`.

Nothing here is hard individually. The difficulty is that the path from a customer to a price runs through three joins, and each join can multiply rows. One paid order with two lines becomes two rows the moment you join `lines`. If you then count orders, you get 2 instead of 1. Every exercise in this family is a variation on "which grain am I counting at?"

The second recurring theme is where the `status='paid'` restriction goes. When the answer must keep customers who have no paid order at all (Q012, Q015), the status test has to be part of the `ON` condition, because a `WHERE` would delete the NULL-padded rows those customers produce. When the answer only wants matched data (Q011, Q013, Q018), `WHERE` is fine and reads better.

"Grain" is worth naming once: the grain of a result is what one row means. `lines` has line grain, `orders` has order grain, `customers` has customer grain. Aggregating from a finer grain to a coarser one without thinking is how double counting happens.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q011.txt`:

```sql
CREATE TABLE customers(id INTEGER PRIMARY KEY,name TEXT);
CREATE TABLE orders(id INTEGER PRIMARY KEY,customer_id INTEGER,status TEXT);
CREATE TABLE products(id INTEGER PRIMARY KEY,name TEXT,category TEXT);
CREATE TABLE lines(order_id INTEGER,product_id INTEGER,qty INTEGER,price INTEGER);
INSERT INTO customers VALUES(1,'Ada'),(2,'Bo'),(3,'Cy'),(4,'Dee');
INSERT INTO orders VALUES(10,1,'paid'),(11,1,'pending'),(12,2,'paid'),(13,3,'cancelled');
INSERT INTO products VALUES(1,'Pen','office'),(2,'Mug','home'),(3,'Pad','office'),(4,'Lamp','home');
INSERT INTO lines VALUES(10,1,2,3),(10,2,1,8),(11,3,4,2),(12,1,1,3),(12,3,2,2),(13,2,2,8);
```

- `lines` has **no primary key** and no `REFERENCES` clauses. `foreign_keys=ON` therefore constrains nothing in this family; referential sanity is the query's job.
- Dee (customer 4) has no orders at all. Cy (customer 3) has one `cancelled` order. Lamp (product 4) appears on no line. These three are the edge cases the expected rows are built around.
- Money is integer arithmetic: `qty * price`. The only non-integer result in the family is Q020's `10.5`, produced by `ROUND(AVG(...),1)`.
- Column aliases are graded exactly: Q011 `customer, order_id, product, qty, amount`; Q012 `name, spend`; Q013 `category, revenue`; Q014 `name, buyers`; Q015 `name, paid_orders`; Q016 `id, name`; Q017 `name, reserved`; Q018 `name, category, total`; Q019 `name`; Q020 `average_order`.
- Zero rows must be real zeros, not NULL or missing: Q012 expects `{"name":"Cy","spend":0}` and `{"name":"Dee","spend":0}`; Q014 expects `{"name":"Lamp","buyers":0}`; Q015 expects `paid_orders` 0 twice.
- Q017 returns **one** row. Only order 11 is pending, and it carries a single line for Pad. Products with no pending demand must not appear at all, which makes it an inner join, unlike Q014.
- `ORDER BY` is required in every exercise; `assert.deepEqual` compares row positions.

## Approach

1. **Pick the driving table from the phrase that says "every" or "all".** "All customers and their paid spend" (Q012) drives from `customers` with `LEFT JOIN`. "Paid line details" (Q011) has no such phrase, so plain inner joins are correct.
2. **Chain the joins along the keys**: `customers.id = orders.customer_id`, `orders.id = lines.order_id`, `lines.product_id = products.id`. Each step is one `JOIN ... ON`.
3. **Place the status predicate by preservation need.** In `ON` when the driving table's rows must survive (`LEFT JOIN orders o ON o.customer_id=c.id AND o.status='paid'`); in `WHERE` when they need not.
4. **Aggregate at the grain the question asks about.** Money (`SUM(qty*price)`) is naturally at line grain, so joining down to `lines` is right. Counting orders is at order grain, so `COUNT(DISTINCT o.id)` is needed once `lines` has fanned the rows out.
5. **Use `COUNT(DISTINCT ...)` rather than `COUNT(*)` whenever a join below the counted grain is present.** Q014 counts distinct `o.customer_id`; Q015 counts distinct `o.id`.
6. **Filter inside the counted expression when a `WHERE` would break preservation.** Q014 keeps all products, so the paid test lives inside the aggregate: `COUNT(DISTINCT CASE WHEN o.status='paid' THEN o.customer_id END)`. `CASE` without `ELSE` yields NULL, and `COUNT` ignores NULL, so non-paid rows contribute nothing.
7. **For "does any such row exist", prefer a semi-join or anti-join.** `SELECT DISTINCT` after joins (Q016) answers "who bought an office item"; `NOT EXISTS` (Q019) answers "who bought nothing paid" without inventing NULL rows.
8. **When the question is about an average of totals, aggregate twice.** Q020 groups lines into orders first, in a subquery, then averages those order totals. Averaging `qty*price` directly would average line values, not order values.

## Worked example — Q011 paid-line-detail

The task: "Join all four tables for paid line details. Order by order id and product id."

**Step 1 — FROM customers c JOIN orders o ON o.customer_id = c.id.** Four customers meet four orders; only matching pairs survive. Dee contributes nothing.

| c.id | c.name | o.id | o.status |
| --- | --- | --- | --- |
| 1 | Ada | 10 | paid |
| 1 | Ada | 11 | pending |
| 2 | Bo | 12 | paid |
| 3 | Cy | 13 | cancelled |

**Step 2 — JOIN lines l ON l.order_id = o.id.** Order 10 has two lines, so Ada's row becomes two. Six rows in, six rows out here, because every line's order exists.

| c.name | o.id | o.status | l.product_id | l.qty | l.price |
| --- | --- | --- | --- | --- | --- |
| Ada | 10 | paid | 1 | 2 | 3 |
| Ada | 10 | paid | 2 | 1 | 8 |
| Ada | 11 | pending | 3 | 4 | 2 |
| Bo | 12 | paid | 1 | 1 | 3 |
| Bo | 12 | paid | 3 | 2 | 2 |
| Cy | 13 | cancelled | 2 | 2 | 8 |

**Step 3 — JOIN products p ON p.id = l.product_id.** One product per line, so the row count does not change; each row gains `p.name` and `p.category`.

**Step 4 — WHERE o.status = 'paid'.** The pending and cancelled rows go.

| c.name | o.id | p.id | p.name | l.qty | l.price |
| --- | --- | --- | --- | --- | --- |
| Ada | 10 | 1 | Pen | 2 | 3 |
| Ada | 10 | 2 | Mug | 1 | 8 |
| Bo | 12 | 1 | Pen | 1 | 3 |
| Bo | 12 | 3 | Pad | 2 | 2 |

**Step 5 — SELECT with aliases.** `c.name AS customer`, `o.id AS order_id`, `p.name AS product`, `l.qty`, `l.qty*l.price AS amount`. Two columns are called `name` in their own tables, so the aliases are not decoration — without them the result would have two keys that collide.

**Step 6 — ORDER BY o.id, p.id.** Within order 10, Pen (product 1) precedes Mug (product 2); within order 12, Pen precedes Pad (product 3).

The asserted rows in `tests/Q011.cjs`:

```sql
-- [{"customer":"Ada","order_id":10,"product":"Pen","qty":2,"amount":6},
--  {"customer":"Ada","order_id":10,"product":"Mug","qty":1,"amount":8},
--  {"customer":"Bo","order_id":12,"product":"Pen","qty":1,"amount":3},
--  {"customer":"Bo","order_id":12,"product":"Pad","qty":2,"amount":4}]
```

The reference solution, as it now reads in `solutions/Q011.sql`:

```sql
-- Why this works:
-- The report is at line grain, so the chain runs customers -> orders -> lines
-- -> products and every join is inner: a line with no product, or an order
-- with no customer, would not be a reportable line anyway.
-- No customer has to be preserved here, so the paid restriction can sit in
-- WHERE, which runs after the joins are formed.
-- Aliases matter: customers.name and products.name would collide, so they are
-- renamed customer and product.
-- ORDER BY o.id,p.id fixes the order inside a multi-line order.
SELECT c.name AS customer,
       o.id AS order_id,
       p.name AS product,
       l.qty,
       l.qty * l.price AS amount
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN lines l ON l.order_id = o.id
JOIN products p ON p.id = l.product_id
WHERE o.status = 'paid'
ORDER BY o.id, p.id;
```

**The Q015 contrast, in one trace.** Take the same joined table after step 4 and count orders per customer. `COUNT(o.id)` sees `10, 10` for Ada and returns 2 — wrong. `COUNT(DISTINCT o.id)` sees `{10}` and returns 1, which is what the expected rows demand.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q011 | paid-line-detail | "paid line details" | four inner joins, no aggregate, `WHERE o.status='paid'` |
| Q012 | paid-spend-preserve-customers | "all customers … zero when none … in the join condition" | `LEFT JOIN` twice, status in `ON`, `COALESCE(SUM(l.qty*l.price),0)` |
| Q013 | category-paid-revenue | "revenue by product category" | drive from `products`, `GROUP BY p.category`, `SUM(l.qty*l.price)` |
| Q014 | distinct-paid-buyers-per-product | "including zero-sales products" | `LEFT JOIN`s plus `COUNT(DISTINCT CASE WHEN o.status='paid' THEN o.customer_id END)` |
| Q015 | order-count-not-line-count | "without overcounting line fan-out" | the same joins, `COUNT(DISTINCT o.id)` instead of a sum |
| Q016 | office-paid-customers-semijoin | "distinct customers who bought an office item" | inner joins, `WHERE o.status='paid' AND p.category='office'`, `SELECT DISTINCT c.id,c.name` |
| Q017 | pending-reserved-quantities | "quantities reserved on pending orders" | `WHERE o.status='pending'`, `SUM(l.qty)`, inner join so silent products vanish |
| Q018 | customer-category-paid-breakdown | "only customer/category pairs with paid sales" | inner joins, `GROUP BY c.id,c.name,p.category` — two grouping dimensions |
| Q019 | customers-with-no-paid-lines | "using NOT EXISTS across orders and lines" | no join in the outer query; `WHERE NOT EXISTS(SELECT 1 FROM orders o JOIN lines l …)` |
| Q020 | average-paid-order-not-line | "after aggregating lines to orders" | a derived table groups lines by `o.id`, then `ROUND(AVG(total),1)` over it |

## Pitfalls the tests are designed to catch

- **Line fan-out inflating a count.** Q015 expects `Ada: 1`. `COUNT(o.id)` over the joined rows returns 2 because order 10 has two lines. Only `COUNT(DISTINCT o.id)` matches.
- **Averaging lines instead of orders.** Q020 expects `10.5` — the mean of order 10 (14) and order 12 (7). `AVG(l.qty*l.price)` over the four paid lines gives `5.25`.
- **`WHERE o.status='paid'` in Q012 or Q015.** Cy's only order is cancelled and Dee has none, so their joined rows are NULL-padded; a `WHERE` on `o.status` deletes them and the result shrinks to two rows instead of four. The prompt says "exclude pending/cancelled in the join condition" for exactly this reason.
- **`SUM` returning NULL instead of 0.** `SUM` over zero rows is NULL, not 0. Q012 expects `0`, so `COALESCE(SUM(...),0)` is required. This is different from `COUNT`, which returns 0 on its own.
- **Using `WHERE` in Q014.** Lamp must appear with `buyers: 0`. Any `WHERE` mentioning `o.status` removes Lamp's NULL-padded row entirely. The `CASE` inside `COUNT(DISTINCT ...)` keeps the row and contributes nothing to the count, because `CASE` with no `ELSE` yields NULL and `COUNT` skips NULL.
- **Counting the wrong column in Q014.** `COUNT(DISTINCT o.id)` would count paid orders, not buyers. Pen appears on orders 10 and 12 from two different customers, so both give 2 here — but a customer with two paid orders for the same product would expose the difference.
- **Forgetting `DISTINCT` in Q016.** Ada's paid order 10 contains one office line (Pen); Bo's paid order 12 contains two (Pen and Pad). Without `DISTINCT` the result is three rows, with Bo listed twice, and the 2-row expectation fails.
- **Grouping by name instead of id.** `GROUP BY c.name` happens to work on this seed because the four names are unique, but `GROUP BY c.id,c.name` is the habit that survives a duplicate name. SQLite permits selecting a column that is not in the `GROUP BY`; most other engines do not, and the value chosen would be arbitrary.
- **`NOT IN` in place of `NOT EXISTS` in Q019.** `customer_id` in `orders` is nullable. If a NULL ever reached the subquery, `id NOT IN (…, NULL)` would be unknown for every row and the result would be empty. `NOT EXISTS` is unaffected. Family [09](09-null-semantics-and-three-valued-logic.md) works through the mechanics.
- **Integer division.** All the money columns are `INTEGER`. `SUM(qty*price)/COUNT(*)` would floor; Q020's `10.5` comes from `AVG`, which produces a real, then `ROUND(...,1)`.
- **Dropping `ORDER BY` in Q013 or Q018.** Group order is unspecified in SQLite even though a `GROUP BY` plan often emits sorted groups. The comparison is positional.

## Try it yourself

1. Rewrite Q012 with the status test in `WHERE` and predict the row count before running it. Then explain the difference in one sentence.
2. Q014 counts distinct buyers. Change it to count distinct paid *orders* per product, and say which seed row would have to change for the two answers to differ.
3. Write "total spend per customer including pending orders, but flagged", returning `name, paid, pending` — two conditional sums over the same join. Which of the family's variants does it most resemble?
4. In words: Q019 could be written with `LEFT JOIN … WHERE l.order_id IS NULL`. Describe the intermediate table that version builds, and say why the prompt asks for `NOT EXISTS` instead.

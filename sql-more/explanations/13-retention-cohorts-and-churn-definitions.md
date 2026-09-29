# Retention cohorts and churn definitions — sql-more Q321–Q330

**What you practise:** grouping users by when they joined, counting how many of them came back, and writing the several incompatible definitions of "retained" and "churned" precisely enough that a machine can check them.
**Prerequisites:** [sql-200 01 Join preservation and matching](../../sql-200/explanations/01-join-preservation-and-matching.md) for `LEFT JOIN`; [sql-200 12 CASE pivot and conditional aggregation](../../sql-200/explanations/12-case-pivot-and-conditional-aggregation.md); [sql-200 06 Window offsets frames and analytics](../../sql-200/explanations/06-window-offsets-frames-and-analytics.md) for `LAG` in Q328.
**Exercises:** Q321: cohort-denominator-signups, Q322: exact-day-one-retention, Q323: rolling-day-one-or-later, Q324: day-three-mature-cohorts-only, Q325: active-user-days-deduplication, Q326: never-activated, Q327: churn-inactive-last-two-days, Q328: reactivated-after-gap, Q329: cohort-age-matrix-observed, Q330: activation-within-one-day.

## The problem in plain words

A **cohort** is a group of users who signed up at the same time. Here the signup time is a small integer day number, so there are two cohorts: day 0 and day 1. **Retention** asks how many members of a cohort were still doing something later. **Churn** asks the opposite: how many have gone quiet.

The difficulty is not the SQL. It is that "retained" has at least three meanings and they give different numbers on the same data. *Exactly one day after joining* (Q322) is a point measurement. *On any day from join+1 up to a cut-off* (Q323) is a window measurement. *Exactly three days after joining, but only for cohorts old enough to have had a day three* (Q324) adds a maturity rule, because a cohort that joined yesterday cannot have a day-3 number yet and including it as a zero would drag the average down for no reason.

Churn has the same problem. Q326 counts users who never did anything at all; Q327 counts users who did nothing in the last two days, which is a different set. Q328 looks for the opposite pattern: a user who went quiet and came back.

Two data details drive most of the answers. The `activity` table contains a duplicate row — user 1 appears twice on day 1 — so any count of "days" has to be a `DISTINCT` count. And user 4 has no activity rows at all, so every query that must still report user 4 has to reach them through a `LEFT JOIN` or a `NOT EXISTS`, never through an inner join.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q321.txt`:

```sql
CREATE TABLE users(id INTEGER PRIMARY KEY,joined INTEGER);
CREATE TABLE activity(user_id INTEGER,day INTEGER);
INSERT INTO users VALUES(1,0),(2,0),(3,1),(4,1);
INSERT INTO activity VALUES(1,0),(1,1),(1,1),(1,3),(2,0),(3,1),(3,2);
```

- Four users in two cohorts of two: users 1 and 2 joined on day 0, users 3 and 4 joined on day 1.
- Activity: user 1 on days 0, 1, 1, 3 (the day-1 row is duplicated); user 2 on day 0 only; user 3 on days 1 and 2; user 4 never.
- `activity` has no primary key and no foreign key, so duplicates are legal and are part of the exercise. `COUNT(DISTINCT a.day)` for user 1 is 3, not 4.
- Several prompts fix an "as of" day of 3. It is a literal in the SQL, not a column: Q323 caps activity at `day <= 3`, Q324 admits only cohorts where `joined + 3 <= 3`, and Q327 defines the churn window as days 2 to 3.
- Aliases are graded: Q321 returns `cohort, users`; Q322 and Q324 return `cohort, retained, signups`; Q323 returns `cohort, retained`; Q325 returns `id, active_days`; Q326 and Q327 return `id`; Q328 returns `user_id`; Q329 returns `cohort, age, active`; Q330 returns `cohort, activated, not_activated`.
- Q324's expected list has **one** row, cohort 0. Cohort 1 is excluded by the maturity rule, not reported as zero.
- Q325 expects `{"id":4,"active_days":0}` — a real zero for the user with no rows, which is what distinguishes a `LEFT JOIN` with `COUNT(DISTINCT a.day)` from an inner join.
- Q327 expects users 2 and 4. User 2 was active on day 0 and user 4 never; both are silent in days 2–3, so "include never-activated signups" is not an extra clause, it is a consequence of asking the question with `NOT EXISTS`.
- Q329 expects five rows and says "observed pairs only": the `(cohort 0, age 2)` combination has no activity and must be absent, not present with a zero.
- Q330's expected `not_activated` for cohort 0 is `0` — an integer zero, produced by summing over a group where every user did activate.

## Approach

1. **Start every cohort query from `users`, not from `activity`.** The denominator is signups, and a user with no activity still signs up. Q321 is that idea on its own: `GROUP BY joined` over `users` alone.
2. **Attach activity with a `LEFT JOIN`.** `FROM users u LEFT JOIN activity a ON a.user_id = u.id` keeps user 4 with `a.day` NULL. An inner join would silently reduce the denominator, which is the single most common error in retention reporting.
3. **Express "retained" as a conditional distinct count.** `COUNT(DISTINCT CASE WHEN <condition> THEN u.id END)` counts each qualifying user once. The `CASE` has no `ELSE`, so non-qualifying rows produce NULL, and `COUNT` ignores NULLs. The `DISTINCT` is needed because a user with several qualifying activity days would otherwise be counted several times.
4. **Change only the condition to change the definition.** `a.day = u.joined + 1` is exact day one; `a.day >= u.joined + 1 AND a.day <= 3` is rolling; `a.day = u.joined + 3` is exact day three. The surrounding query is identical.
5. **Put a maturity rule in `WHERE`, on the cohort, not on the activity.** `WHERE u.joined + 3 <= 3` removes whole cohorts before grouping, so an immature cohort does not appear at all.
6. **Use `NOT EXISTS` for churn.** Churn is the absence of matching activity, and `NOT EXISTS(SELECT 1 FROM activity a WHERE a.user_id = u.id AND a.day BETWEEN 2 AND 3)` is true both for a user who was active earlier and for a user who was never active. `BETWEEN x AND y` in SQLite is inclusive at both ends.
7. **Deduplicate before computing gaps.** Q328 asks about the distance between *distinct* activity days, so the first CTE is `SELECT DISTINCT user_id, day FROM activity`; without it the duplicated day-1 row would produce a gap of 0 and shift the sequence.
8. **Use `LAG` partitioned by user for "days since last time".** `day - LAG(day) OVER (PARTITION BY user_id ORDER BY day)` is NULL on each user's first row, which correctly means "no previous visit", and a gap of 2 or more is the reactivation the prompt defines.
9. **Turn `EXISTS` into a number when you need to count both sides.** In SQLite `EXISTS(…)` is an expression yielding the integer 0 or 1, so `SUM(activated)` counts the users who did and `SUM(1 - activated)` counts those who did not, from the same flag.

## Worked example — Q322 exact-day-one-retention

The task, quoted from the prompt: "Count distinct users active exactly one day after joining, alongside signup denominator."

**Step 1 — the join.** `users LEFT JOIN activity ON a.user_id = u.id` produces one row per (user, activity) pair, plus one row with NULLs for the user who has no activity:

| u.id | u.joined | a.day |
| --- | --- | --- |
| 1 | 0 | 0 |
| 1 | 0 | 1 |
| 1 | 0 | 1 |
| 1 | 0 | 3 |
| 2 | 0 | 0 |
| 3 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 1 | NULL |

**Step 2 — `GROUP BY u.joined` makes two groups**, the four rows of cohort 0's users and the four rows of cohort 1's.

**Step 3 — evaluate the retention `CASE` on each row.** The condition is `a.day = u.joined + 1`.

| group | row | `u.joined + 1` | `a.day` | `CASE` yields |
| --- | --- | --- | --- | --- |
| cohort 0 | (1, 0) | 1 | 0 | NULL |
| cohort 0 | (1, 1) | 1 | 1 | **1** |
| cohort 0 | (1, 1) | 1 | 1 | **1** |
| cohort 0 | (1, 3) | 1 | 3 | NULL |
| cohort 0 | (2, 0) | 1 | 0 | NULL |
| cohort 1 | (3, 1) | 2 | 1 | NULL |
| cohort 1 | (3, 2) | 2 | 2 | **3** |
| cohort 1 | (4, –) | 2 | NULL | NULL |

The `CASE` yields `u.id`, not a flag, which is what makes `DISTINCT` meaningful. Cohort 0 produces the multiset `{1, 1}`; `COUNT(DISTINCT …)` reduces it to 1. Without `DISTINCT` the answer would be 2 — the duplicated activity row counted twice — and the retention rate would come out as 100% of a two-person cohort.

**Step 4 — the denominator.** `COUNT(DISTINCT u.id)` over the same group gives 2 for each cohort. Plain `COUNT(*)` would give 5 and 3, the number of joined rows, which is not what "signups" means. This is the second reason the `DISTINCT` matters.

**Step 5 — the expected result**, asserted in `tests/Q322.cjs`:

```json
[{"cohort":0,"retained":1,"signups":2},
 {"cohort":1,"retained":1,"signups":2}]
```

The reference solution, as it now reads in `solutions/Q322.sql`:

```sql
-- Why this works:
-- The denominator is signups, so the query is driven from users and the
-- join to activity is a LEFT JOIN: user 4 has no activity rows and must
-- still be counted in its cohort.
-- Retention is a conditional distinct count. The CASE has no ELSE, so a row
-- that fails the test yields NULL, and COUNT ignores NULLs.
-- COUNT(DISTINCT ...) of u.id, not of the rows, is what makes the duplicate
-- activity row for user 1 on day 1 count once instead of twice.
-- COUNT(DISTINCT u.id) is likewise the signup denominator; COUNT(*) would
-- count joined rows, which is 5 for cohort 0.
-- The condition a.day = u.joined + 1 is the exact-day-one definition; Q323
-- and Q324 change only that expression.
SELECT u.joined AS cohort,
       COUNT(DISTINCT CASE WHEN a.day = u.joined + 1 THEN u.id END) AS retained,
       COUNT(DISTINCT u.id) AS signups
FROM users u
LEFT JOIN activity a ON a.user_id = u.id
GROUP BY u.joined
ORDER BY cohort;
```

**The three retention definitions side by side**, on this seed:

| Definition | Condition | cohort 0 | cohort 1 |
| --- | --- | --- | --- |
| Q322 exact day 1 | `a.day = u.joined + 1` | 1 (user 1) | 1 (user 3) |
| Q323 any day ≥ join+1, to as-of 3 | `a.day >= u.joined + 1 AND a.day <= 3` | 1 (user 1) | 1 (user 3) |
| Q324 exact day 3, mature cohorts | `a.day = u.joined + 3`, `WHERE u.joined + 3 <= 3` | 1 (user 1) | cohort absent |

The numbers coincide for cohorts 0 and 1 here, which is a property of this small seed, not of the definitions. What differs visibly is Q324's row count: one row, not two.

## Policy matrix — what changes between the variants

| ID | Variant | Definition being expressed | What changes in the SQL |
| --- | --- | --- | --- |
| Q321 | cohort-denominator-signups | cohort size | `users` alone, `GROUP BY joined`, `COUNT(*)` |
| Q322 | exact-day-one-retention | active on exactly join+1 | `LEFT JOIN`, `CASE WHEN a.day = u.joined+1` |
| Q323 | rolling-day-one-or-later | active on any day in join+1 … 3 | the condition becomes a range test; no `signups` column |
| Q324 | day-three-mature-cohorts-only | active on exactly join+3, mature cohorts | `CASE` on `u.joined+3` plus `WHERE u.joined+3 <= 3` |
| Q325 | active-user-days-deduplication | how many distinct days each user acted | `GROUP BY u.id`, `COUNT(DISTINCT a.day)` |
| Q326 | never-activated | no activity ever | `NOT EXISTS` with no day predicate |
| Q327 | churn-inactive-last-two-days | no activity in days 2–3 | the same `NOT EXISTS` plus `a.day BETWEEN 2 AND 3` |
| Q328 | reactivated-after-gap | a gap of 2 or more between visits | `SELECT DISTINCT` CTE, `LAG` per user, `WHERE gap >= 2` |
| Q329 | cohort-age-matrix-observed | activity by cohort and age | inner join, `GROUP BY cohort, age` with `a.day - u.joined` |
| Q330 | activation-within-one-day | acted in the window join … join+1 | `EXISTS` as a 0/1 flag in a CTE, then `SUM` both ways |

## Pitfalls the tests are designed to catch

- **Using an inner join for a cohort denominator.** User 4 has no activity rows, so an inner join drops them and Q322's `signups` becomes 1 for cohort 1 instead of 2. Q325 would lose the `{"id":4,"active_days":0}` row entirely.
- **Dropping `DISTINCT` from the retention count.** The duplicate `(1,1)` row makes Q322's cohort-0 `retained` come out as 2 instead of 1.
- **Using `COUNT(*)` as the signup denominator.** After the join, cohort 0 has five rows and cohort 1 has three. The expected value is 2 for both.
- **Counting `COUNT(a.day)` instead of `COUNT(DISTINCT a.day)` in Q325.** User 1 has four activity rows over three distinct days; the expected value is 3.
- **Reporting an immature cohort as zero in Q324.** The expected list has exactly one row. A `CASE` that yields 0 for cohort 1 still emits a second row and fails on row count.
- **Putting Q324's maturity rule in the `CASE` instead of the `WHERE`.** The rule is about which cohorts are reportable, which is a row filter on `users`; the `CASE` only decides who inside a reported cohort counts as retained.
- **Writing churn as "has activity outside the window".** Q327's user 2 has activity on day 0, so a query built on `EXISTS(… day < 2)` finds them — but it misses user 4, who has no rows at all. `NOT EXISTS(… BETWEEN 2 AND 3)` covers both in one test, and both are expected.
- **Assuming `BETWEEN` excludes an endpoint.** `a.day BETWEEN 2 AND 3` includes both 2 and 3. User 1's day-3 activity is what keeps them out of Q327's churn list.
- **Skipping the `DISTINCT` CTE in Q328.** With the duplicate day-1 row present, `LAG` over user 1's days 0, 1, 1, 3 produces gaps 1, 0, 2. The `gap >= 2` test still finds user 1 here, but the intermediate 0 is meaningless and the same shortcut breaks as soon as a duplicate straddles a real gap. The prompt says "previous distinct activity day".
- **Reading `LAG`'s NULL as a gap.** The first row of each partition has no predecessor, so `day - LAG(day)` is NULL. NULL is not `>= 2`, so those rows are excluded without any extra clause.
- **Emitting unobserved cells in Q329.** The query groups the activity rows that exist; it never generates a grid. `(cohort 0, age 2)` has no activity and is correctly missing. Producing a dense matrix would need a separate cross join of cohorts and ages, which this variant does not ask for.
- **Using a `LEFT JOIN` in Q329.** User 4 would contribute `a.day` NULL and therefore an `age` of NULL, adding a row the expected list does not contain. This is the one scenario in the family where an inner join is correct.
- **Counting `not_activated` with a second `EXISTS` in Q330.** `SUM(1 - activated)` reuses the flag already computed and cannot disagree with it. Two independent subqueries can, if their windows are typed differently.

## Try it yourself

1. Change Q323's as-of day from 3 to 2 and predict both rows before running it. Which user drops out, and from which cohort?
2. Add `INSERT INTO activity VALUES(4,5);` to the seed in your head and say which of Q325, Q326, Q327 and Q330 change their answer.
3. Write the dense version of Q329: every cohort crossed with ages 0 to 3, with zeros where there was no activity. Which extra construct do you need?
4. In words: Q326 and Q327 both return a list of quiet users, and user 4 is in both. Describe a user who would appear in Q327 and not in Q326, and say which definition a subscription business would rather report.

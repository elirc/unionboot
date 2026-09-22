# String normalization parsing and matching — sql-200 Q101–Q110

**What you practise:** cleaning and taking apart text with SQLite's scalar string functions, and choosing the right matching operator for case-sensitive, wildcard and literal-wildcard searches.
**Prerequisites:** [09 NULL semantics and three valued logic](09-null-semantics-and-three-valued-logic.md) for how NULL behaves in expressions and filters; `GROUP BY` with `COUNT(*)`; the idea that a scalar function returns a new value and never changes the stored row.
**Exercises:** Q101: trim-lowercase-ascii, Q102: extract-email-domain, Q103: domain-count-normalized, Q104: code-prefix-and-numeric-suffix, Q105: replace-delimiter, Q106: length-after-trim, Q107: case-sensitive-glob-prefix, Q108: like-literal-wildcard-escape, Q109: concatenation-null-fallback, Q110: ordered-group-concat.

## The problem in plain words

One small `contacts` table holds data that arrived from somewhere untidy: a name with spaces around it, an email in capitals, a code with a hyphen in the middle, and one missing email. Every exercise in this family either cleans that text, pulls a piece out of it, or looks for rows that match a pattern.

Nothing here changes the table. `trim`, `lower`, `substr` and `replace` are scalar functions: they take a value and return a new one for the duration of the query. The stored `' Ada '` still has its spaces after Q101 runs.

"Normalization" means deciding what counts as the same. Two emails that differ only in case are the same address, so Q103 groups by `lower(email)` rather than by `email`. Two codes that differ only in punctuation are the same code, so Q105 strips the hyphen. The choice is yours to make and the tests pin it down exactly.

The last four exercises are about matching, and they separate three operators that look interchangeable and are not: `LIKE` (case-insensitive for ASCII, wildcards `%` and `_`), `GLOB` (case-sensitive, wildcards `*` and `?`), and `LIKE … ESCAPE` (the same as `LIKE` but with one character promoted to an escape marker so a wildcard can be searched for literally).

## The contract you must honour

Nine of the ten exercises share one seed, quoted from `prompts/Q101.txt`:

```sql
CREATE TABLE contacts(id INTEGER PRIMARY KEY,name TEXT,email TEXT,code TEXT);
INSERT INTO contacts VALUES(1,' Ada ','ADA@EXAMPLE.COM','AB-001'),(2,'Bo','bo@work.org','AB-002'),
  (3,'cy','cy@example.com','XY-010'),(4,'Dee',NULL,'XY-011'),(5,'Eli','eli+tag@example.com','ZZ-100');
```

Q108 adds a second table on top of that same seed:

```sql
CREATE TABLE labels(id INTEGER,label TEXT);
INSERT INTO labels VALUES(1,'a_b'),(2,'axb'),(3,'_'),(4,'ab');
```

- Row 1's name is `' Ada '` with one space on each side, and row 1's email is the only all-capitals one. Row 4's email is `NULL`. Row 5's email contains a `+`. These four facts are what the exercises are built around.
- Every code has the shape two letters, a hyphen, three digits. Q104 relies on that being fixed-width: `substr(code,1,2)` and `substr(code,4)`.
- Column aliases are graded exactly: `id, name, email` (Q101); `id, domain` (Q102); `domain, contacts` (Q103); `id, prefix, number` (Q104); `id, compact` (Q105); `id, name` (Q106); `id, code` (Q107); `id, label` (Q108); `id, display` (Q109); `roster` (Q110).
- Row counts pin the filters: Q101, Q104, Q105 and Q109 return all 5 rows; Q102 returns 4 because the NULL email is excluded; Q103 returns 2 domains; Q106 returns 3 names; Q107 and Q108 return 2 rows; Q110 returns exactly 1 row.
- Types are graded, not just text. Q104 expects `"number":1`, a JavaScript number, so the digits must be `CAST(... AS INTEGER)`; returning the text `'001'` fails.
- NULL is preserved where the prompt says so. Q101 expects `{"id":4,"name":"Dee","email":null}`, so `lower(email)` must be allowed to stay NULL rather than being coerced with `COALESCE`.
- Q109 expects `"Dee <no-email>"`, so the same NULL must be replaced there. The two exercises want opposite treatments of the same value.
- Q106's expected names are `Ada`, `Dee`, `Eli` — trimmed but not lower-cased, and `cy` is absent because its length is 2, not because of its case.
- Q107 expects only the two `XY-` codes, and Q108 expects only `a_b` and `_`.
- Q110 expects the single row `{"roster":"Eli,Dee,cy,Bo,Ada"}`: descending id order, comma separator, no spaces, names trimmed.

## Approach

1. **Clean before you compare.** If the rule is about the trimmed value, both the `WHERE` clause and the `SELECT` list must trim. Q106 filters on `length(trim(name))` and projects `trim(name)`; trimming in only one of the two places gives the wrong rows or the wrong text.
2. **Find a position, then cut.** `instr(haystack,needle)` returns the 1-based position of the first occurrence, or 0 if there is none. `substr(text,start)` cuts from that position to the end, and `substr(text,start,length)` takes a fixed number of characters. The domain of an email is `substr(email, instr(email,'@')+1)`.
3. **Decide what NULL should become, per exercise.** Scalar string functions return NULL for a NULL input, and `||` returns NULL if any operand is NULL. Use `COALESCE(value, fallback)` where a fallback is wanted, and `WHERE email IS NOT NULL` where the row should be dropped instead.
4. **Group by the normalized expression, not the column.** `GROUP BY lower(substr(...))` collapses differently-spelled duplicates. SQLite also lets you write `GROUP BY domain`, reusing the `SELECT` alias, which keeps the expression in one place.
5. **Pick the matching operator from the requirement.** Case-sensitive prefix: `GLOB 'XY-*'`. Case-insensitive contains: `LIKE '%xy%'`. A literal `_` or `%`: `LIKE` with an `ESCAPE` character.
6. **Cast when the expected value is a number.** SQLite's dynamic typing will happily hand back the text `'001'` from `substr`; `CAST(... AS INTEGER)` is what makes it the number 1.
7. **Order inside a subquery when an aggregate must consume rows in order.** `group_concat` has no `ORDER BY` argument in this build, so the ordering is applied to its input.

## Worked example — Q101 trim-lowercase-ascii

The task, quoted from the prompt: "Trim surrounding spaces from name and lowercase email; SQLite built-ins are ASCII-oriented without ICU. Preserve NULL email."

**Step 1 — `FROM contacts`.** All five rows, in rowid order. No `WHERE` clause, so nothing is removed.

| id | name | email |
| --- | --- | --- |
| 1 | `' Ada '` | `'ADA@EXAMPLE.COM'` |
| 2 | `'Bo'` | `'bo@work.org'` |
| 3 | `'cy'` | `'cy@example.com'` |
| 4 | `'Dee'` | NULL |
| 5 | `'Eli'` | `'eli+tag@example.com'` |

**Step 2 — `trim(name)`.** Leading and trailing spaces are removed. Only row 1 changes; the rest have no surrounding whitespace. Case is untouched, so row 3 stays `cy`.

| id | `trim(name)` |
| --- | --- |
| 1 | `'Ada'` |
| 2 | `'Bo'` |
| 3 | `'cy'` |
| 4 | `'Dee'` |
| 5 | `'Eli'` |

**Step 3 — `lower(email)`.** Only row 1 has upper-case letters to fold. Row 4 is NULL, and `lower(NULL)` is NULL — the function is not applied to a missing value, it simply passes it through.

| id | `lower(email)` |
| --- | --- |
| 1 | `'ada@example.com'` |
| 2 | `'bo@work.org'` |
| 3 | `'cy@example.com'` |
| 4 | NULL |
| 5 | `'eli+tag@example.com'` |

**Step 4 — `ORDER BY id`.** The rows are already in id order here, but the clause is what makes that a promise rather than an accident: without it SQLite may return rows in any order, and the grader compares exact rows in exact order.

The asserted rows in `tests/Q101.cjs` are those five, and the first is `{"id":1,"name":"Ada","email":"ada@example.com"}`.

The reference solution, as it now reads in `solutions/Q101.sql`:

```sql
-- Why this works:
-- trim(name) removes leading and trailing spaces only; spaces inside the
-- string are left alone.
-- lower(email) folds A-Z to a-z. SQLite ships without ICU, so lower() is
-- ASCII-oriented: bytes outside A-Z are returned unchanged.
-- lower(NULL) is NULL, so row 4 keeps its NULL email with no COALESCE.
-- ORDER BY id fixes the graded row order.
SELECT id,
       trim(name) AS name,
       lower(email) AS email
FROM contacts
ORDER BY id;
```

**The Q101/Q109 contrast.** Q109 builds `trim(name) || ' <' || lower(email) || '>'`. For row 4 that expression is NULL end to end, because `||` propagates NULL, and the expected display text is `"Dee <no-email>"`. The fix is `COALESCE(lower(email),'no-email')` — applied to the email alone, before the concatenation, not to the finished string.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q101 | trim-lowercase-ascii | "trim name, lowercase email, preserve NULL" | `trim(name)` and `lower(email)` in the `SELECT` list |
| Q102 | extract-email-domain | "extract lowercase domain after @" | adds `instr`/`substr` and `WHERE email IS NOT NULL` |
| Q103 | domain-count-normalized | "count known emails by domain" | same expression, plus `GROUP BY domain` and `COUNT(*)` |
| Q104 | code-prefix-and-numeric-suffix | "two-letter prefix and integer suffix" | two fixed-offset `substr` calls, one wrapped in `CAST(... AS INTEGER)` |
| Q105 | replace-delimiter | "remove hyphens" | `replace(code,'-','')` |
| Q106 | length-after-trim | "trimmed length exactly three" | `WHERE length(trim(name))=3`, and the projection trims too |
| Q107 | case-sensitive-glob-prefix | "case-sensitive matching `XY-*`" | `WHERE code GLOB 'XY-*'` |
| Q108 | like-literal-wildcard-escape | "a literal underscore, not a wildcard" | `WHERE label LIKE '%!_%' ESCAPE '!'` against the `labels` table |
| Q109 | concatenation-null-fallback | "replace missing email with no-email" | `||` concatenation with `COALESCE(lower(email),'no-email')` |
| Q110 | ordered-group-concat | "one comma-separated list, id descending" | `group_concat(name,',')` over an `ORDER BY id DESC` subquery |

## Pitfalls the tests are designed to catch

- **Trimming in the projection but not the filter.** Q106 expects ids 1, 4, 5. `WHERE length(name)=3` measures `' Ada '` as 5 and drops row 1, returning only two rows.
- **Coercing NULL where the prompt says preserve it.** Q101 asserts `"email":null` for row 4. `COALESCE(lower(email),'')` returns the empty string instead and fails the deep comparison.
- **Letting NULL poison a concatenation.** Q109's row 4 would be `null` without the `COALESCE`, because `'Dee <' || NULL || '>'` is NULL.
- **Filtering NULL with `<>` or `=`.** `WHERE email <> NULL` is unknown for every row, so Q102 would return nothing. `IS NOT NULL` is the only test that works.
- **Off-by-one in `instr`.** `instr` is 1-based and returns the position *of* the `@`. `substr(email, instr(email,'@'))` keeps the `@` itself and produces `'@example.com'`; the `+1` is required.
- **Returning text where a number is expected.** Q104 asserts `"number":1`. Without the cast the value is the string `'001'`, which is neither `1` nor `"1"`.
- **Using `LIKE` for the case-sensitive match.** SQLite's `LIKE` is case-insensitive for ASCII by default, so `code LIKE 'XY-%'` would also match a hypothetical `'xy-020'`. Q107 states case sensitivity, which is `GLOB`.
- **Mixing up the two wildcard vocabularies.** `GLOB 'XY-%'` matches nothing, because in `GLOB` the wildcard is `*` and `%` is an ordinary character. `LIKE 'XY-*'` matches nothing either, for the mirror-image reason.
- **Treating `_` as a wildcard in Q108.** `LIKE '%_%'` matches every label with at least one character, so all four rows come back instead of two. The `ESCAPE` clause is what makes `!_` mean a literal underscore.
- **Assuming `lower` understands non-ASCII.** SQLite is built here without ICU, so `lower` and the `NOCASE` collation fold only `A`–`Z`. The GUIDE states this; no exercise in this family contains a non-ASCII letter, so the tests cannot catch the assumption — your production data will.
- **Expecting `group_concat` to sort for you.** Q110 asserts `"Eli,Dee,cy,Bo,Ada"`. Aggregating over an unordered input is not a promise of any particular order; the reference orders the rows in a subquery first, and that is SQLite 3.49.1 behaviour rather than a portable guarantee.
- **Adding a space to the separator.** `group_concat(name, ', ')` produces `"Eli, Dee, cy, Bo, Ada"`, which is a different string.

## Try it yourself

1. Add a contact whose email is `'Eli+Tag@Example.COM'` and predict, before running, what Q103's counts become and whether Q102 gains a row.
2. Rewrite Q102 to return `NULL` for a contact with no email instead of dropping the row. Which clause disappears, and which function appears?
3. Q107 uses `GLOB 'XY-*'`. Write the same filter with `LIKE` so that it stays case-sensitive, using only the functions in this family. (Hint: compare something that has already been normalized.)
4. In words: Q101 and Q109 read the same NULL email and treat it in opposite ways. Describe the rule you would give a colleague for deciding which treatment a new report needs.

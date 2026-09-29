# FTS5 text retrieval and token policies — sql-more Q251–Q260

**What you practise:** searching text with SQLite's FTS5 full-text index — boolean operators, phrases, prefixes, per-column filters and result highlighting — and understanding that everything FTS5 does happens at the level of *tokens*, not characters.
**Prerequisites:** `SELECT ... WHERE`; `ORDER BY`; the idea of a virtual table (a table whose implementation is a module rather than ordinary storage).
**Exercises:** Q251: single-token-any-column, Q252: and-two-tokens, Q253: or-token-union, Q254: not-exclude-token, Q255: exact-token-phrase, Q256: prefix-token-search, Q257: title-column-filter, Q258: body-column-filter, Q259: highlight-title-tokens, Q260: updates-refresh-index.

## The problem in plain words

`LIKE '%fox%'` scans every row and matches characters. **FTS5** is a different mechanism: an index of *tokens*. When a document is inserted, FTS5 splits each column into tokens with a **tokenizer** — by default `unicode61`, which breaks on non-alphanumeric characters and folds case — and records, for every token, which document and which column it appeared in, and at which position.

Searching then means asking about tokens. `WHERE articles MATCH 'fox'` looks the token `fox` up in that index. Three consequences follow, and they are the source of most of this family's pitfalls:

- **Matching is whole-token.** `'flo'` finds nothing in a corpus containing `flowers`, because `flowers` was stored as one token. Prefix matching needs an explicit `flo*`.
- **Matching is case-insensitive**, because the tokenizer folded case on both sides. `'FOX'` and `'fox'` return the same rows.
- **Position is recorded**, which is what makes a phrase query possible: `'"quick brown"'` means "these two tokens, adjacent, in this order".

On top of the token index FTS5 adds a small query language — `AND`, `OR`, `NOT`, `"phrase"`, `prefix*`, `column : term` — and auxiliary functions such as `highlight()`, which re-renders a stored column with markers around the tokens that matched.

`MATCH` is a query, not a filter over already-fetched rows: the right-hand side is an FTS5 query string, and the left-hand side names either the whole table (search all columns) or one column.

## The contract you must honour

Taken from `prompts/Q251.txt`–`Q260.txt` and `tests/Q251.cjs`–`Q260.cjs`. All ten share one seed:

```sql
CREATE VIRTUAL TABLE articles USING fts5(title, body);
INSERT INTO articles(rowid, title, body) VALUES
  (1,'Red fox','quick brown fox jumps'),
  (2,'Blue bird','quick blue bird flies'),
  (3,'Fox notes','slow red fox sleeps'),
  (4,'Garden','blue flowers grow');
```

- The table has **two searchable columns**, `title` and `body`, numbered `0` and `1` for the auxiliary functions. `rowid` is supplied explicitly by the seed, so document numbers are stable.
- The seed is built so that each policy is separable. `red` is in the *title* of document 1 and in the *body* of document 3. `blue` is in the title of 2 and the body of 4. `fox` appears in both columns of 1 and 3. `flowers` exists only as a longer token.
- The GUIDE pins the tokenizer: "FTS5 uses default unicode61 tokenizer, no custom extension."
- Aliases: `rowid, title` (Q251); `rowid` (Q252–Q258, Q260); `rowid, marked` (Q259).
- Row counts: Q251 2, Q252 1, Q253 3, Q254 1, Q255 1, Q256 1, Q257 1, Q258 1, Q259 2, Q260 3.
- Every query ends in `ORDER BY rowid`. FTS5 happens to return matches in rowid order for these queries, but the graded comparison is positional and the order is not something the module promises — adding `ORDER BY rank` would reorder by relevance instead.
- Q259's expected values are the *stored* text with markers inserted: `"Red [fox]"` and `"[Fox] notes"`. The second shows that highlighting preserves the original capital `F` even though the match was case-insensitive.
- Q260 is the only multi-statement answer: an `UPDATE`, then the graded `SELECT`. The prompt notes the table is "ordinary contentful FTS5, not external-content", which is why the index updates itself.

### FTS5 behaviour the expected rows depend on

Checked against SQLite 3.49.1 through `node:sqlite` in this session:

- `MATCH 'FOX'` returns the same rows as `MATCH 'fox'` — documents 1 and 3.
- `MATCH 'flo'` returns **no rows**; the stored token is `flowers`. `MATCH 'flo*'` returns document 4.
- Two bare terms separated by a space are an implicit `AND`: `MATCH 'quick fox'` returns only document 1, the same as `'quick AND fox'`.
- `MATCH 'blue NOT bird'` returns document 4. FTS5's `NOT` is a binary operator meaning "matches the left side and not the right", not a unary negation.
- The column filter may be written `'title:blue'` or `'title : blue'`; both return document 2. The alternative form `WHERE body MATCH 'red'` — naming the column on the left of `MATCH` — returns document 3.
- `highlight(articles, 1, '[', ']')` on a `fox` search returns `quick brown [fox] jumps`, so column `0` is `title` and column `1` is `body`.
- The hidden `rank` column exists and is a negative bm25 score (better matches are more negative). It is not used by any exercise here; ordering by it would change Q251's and Q259's row order only if the scores differed.
- An `UPDATE` to a contentful FTS5 table re-tokenises the changed column immediately; no `rebuild` command is needed.

## Approach

1. **Decide the scope: whole table or one column.** `articles MATCH '...'` searches every column; `title : blue` inside the query string, or `title MATCH 'blue'`, restricts it.
2. **Write the search as tokens, not as a substring.** If the requirement is "starts with", use `*`. There is no suffix or infix operator — `*fox` is not valid FTS5 syntax.
3. **Combine terms with the operators, in the query string.** `'quick AND fox'`, `'fox OR flowers'`, `'blue NOT bird'`. The operators are part of the FTS5 query language and must be uppercase; they are not SQL's `AND`/`OR`, and putting them in the `WHERE` clause instead would need two separate `MATCH` calls.
4. **Quote a phrase with double quotes inside the single-quoted SQL string**: `MATCH '"quick brown"'`. Without the inner quotes the two tokens are an implicit `AND` and may appear anywhere, in any order.
5. **Let one `MATCH` per query do the work.** SQLite allows only one FTS5 match constraint per table reference in a query; expressing `OR` as two `MATCH` calls joined by SQL `OR` is both unnecessary and usually rejected.
6. **Use `highlight(<table>, <column index>, <open>, <close>)`** to render a matched column with markers. The column index is zero-based and positional, matching the order in the `CREATE VIRTUAL TABLE` declaration.
7. **Order explicitly.** `ORDER BY rowid` for document order; `ORDER BY rank` for relevance. The graded comparison is positional, so the choice is part of the answer.
8. **Update through the virtual table itself** (Q260). `UPDATE articles SET body=... WHERE rowid=4` rewrites both the stored content and the token index, so the next `MATCH` sees the new text.

## Worked example — Q251 single-token-any-column

The task, quoted from `prompts/Q251.txt`: "FTS5 MATCH fox across both columns, sorted by rowid."

**Step 1 — what the index holds.** When the seed inserted the four documents, the tokenizer split each column and folded case. The entries for the token `fox` are:

| document | column | stored text | token positions of `fox` |
| --- | --- | --- | --- |
| 1 | title | `Red fox` | position 1 |
| 1 | body | `quick brown fox jumps` | position 2 |
| 2 | — | — | none |
| 3 | title | `Fox notes` | position 0 |
| 3 | body | `slow red fox sleeps` | position 2 |
| 4 | — | — | none |

Document 3's title begins with a capital `Fox`; the tokenizer stored `fox`, so it is found by a lowercase query.

**Step 2 — `WHERE articles MATCH 'fox'`.** The left operand is the table name, so every column is searched. FTS5 looks up the token and returns the set of matching documents — 1 and 3 — once each, no matter how many times or in how many columns the token occurred.

**Step 3 — `SELECT rowid, title`.** The stored column values are returned unchanged; `MATCH` selects rows, it does not transform them.

| rowid | title |
| --- | --- |
| 1 | Red fox |
| 3 | Fox notes |

**Step 4 — `ORDER BY rowid`.** FTS5 returned these in rowid order anyway, but the clause is what makes it a guarantee. Replacing it with `ORDER BY rank` would sort by bm25 relevance, which on this seed happens to be equal for both documents.

**The asserted result**, from `tests/Q251.cjs`:

```sql
-- [{"rowid":1,"title":"Red fox"},{"rowid":3,"title":"Fox notes"}]
```

The reference solution as it now reads in `solutions/Q251.sql`:

```sql
-- Why this works:
-- MATCH with the table name on the left searches every indexed column, so a
-- document qualifies whether the token is in its title or its body.
-- FTS5 stores tokens, not characters, and the default unicode61 tokenizer
-- folds case, so the query fox also finds the title Fox notes.
-- Each document is returned once however many times the token occurs.
-- ORDER BY rowid makes the document order explicit; ORDER BY rank would
-- sort by relevance instead.
SELECT rowid,
       title
FROM articles
WHERE articles MATCH 'fox'
ORDER BY rowid;
```

**Contrast with Q257**, which is the same idea narrowed to one column. `MATCH 'title : blue'` finds only document 2, because document 4's `blue` sits in its body. Column filtering is a property of the *query string*, not of the select list: selecting only `title` would not restrict the search at all.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q251 | single-token-any-column | "fox across both columns" | `MATCH 'fox'` |
| Q252 | and-two-tokens | "quick AND fox in any columns" | `MATCH 'quick AND fox'` |
| Q253 | or-token-union | "fox OR flowers; one row per document" | `MATCH 'fox OR flowers'` |
| Q254 | not-exclude-token | "blue but NOT bird" | `MATCH 'blue NOT bird'` |
| Q255 | exact-token-phrase | "contiguous token order" | inner double quotes: `MATCH '"quick brown"'` |
| Q256 | prefix-token-search | "prefix flo* rather than full token flo" | trailing star: `MATCH 'flo*'` |
| Q257 | title-column-filter | "search only title column" | column filter in the query: `MATCH 'title : blue'` |
| Q258 | body-column-filter | "search only body" | the same shape with the other column: `MATCH 'body : red'` |
| Q259 | highlight-title-tokens | "highlight column0 with [ and ] markers" | adds `highlight(articles,0,'[',']') AS marked` |
| Q260 | updates-refresh-index | "update document4 body … then MATCH fox" | an `UPDATE` before the unchanged Q251-style search |

## Pitfalls the tests are designed to catch

- **Using `LIKE` instead of `MATCH`.** `WHERE title LIKE '%fox%'` returns documents by substring and ignores the index entirely. It would also match a document containing `foxes`, which `MATCH 'fox'` does not.
- **Expecting `MATCH 'flo'` to find `flowers`.** It cannot: the index holds whole tokens. Q256 exists to make that explicit, and the `*` must be attached to the term with no space.
- **Trying `*flo` or `*flo*`.** FTS5 supports only trailing prefix matching. There is no built-in way to search a token's middle or end without a custom tokenizer, which the GUIDE rules out for this pack.
- **Reading FTS5's `NOT` as a unary operator.** `MATCH 'NOT bird'` is a syntax error; `NOT` needs a left operand. Q254's query is "blue, minus documents containing bird".
- **Writing the boolean operators in lowercase.** FTS5 treats `and`, `or`, `not` in lowercase as ordinary tokens to search for, so `'quick and fox'` becomes a three-token implicit AND and matches nothing here.
- **Dropping the inner quotes in Q255.** `MATCH 'quick brown'` is an implicit `AND` of two tokens; on this seed it still returns only document 1, so the query looks right — but it would also match a document containing `brown … quick` in either order, which the prompt's "contiguous token order" forbids.
- **Filtering a column in the SQL `WHERE` clause.** `WHERE articles MATCH 'blue' AND title LIKE '%blue%'` gets the right row for Q257 by accident and stops working the moment a title contains the word in another form. The column filter belongs inside the query string.
- **Getting the `highlight` column index wrong in Q259.** Column `0` is `title` and column `1` is `body`; passing `1` returns `quick brown [fox] jumps` instead of `Red [fox]`.
- **Expecting `highlight` to normalise case.** The expected value is `[Fox] notes` with the original capital. The function marks the stored text; only the *matching* was case-insensitive.
- **Combining two `MATCH` calls with SQL `OR` in Q253.** A single FTS5 table reference accepts one match constraint; the `OR` belongs in the query string, where it also returns each document once rather than duplicating it.
- **Assuming the index needs a rebuild after Q260's update.** This is a contentful FTS5 table, so the `UPDATE` re-tokenises immediately. An external-content table — one declared with `content=`— would need the trigger or `rebuild` machinery the prompt is distinguishing itself from.
- **Omitting `ORDER BY rowid`.** FTS5's natural output order is not part of its contract, and the graded comparison is positional.

## Try it yourself

1. Run `SELECT rowid, rank FROM articles WHERE articles MATCH 'fox' ORDER BY rank`. What sign do the scores have, and what happens to Q251's row order?
2. Write a query that finds documents where `quick` appears in the body and `fox` appears in the title. Can one query string express that, or does it need two column filters?
3. Insert a document whose body is `Foxes run`. Which of Q251, Q255 and Q256 change, and what does that tell you about stemming in the default tokenizer?
4. In words: Q252's query and `MATCH 'quick fox'` return the same row here. Say what the second form actually means and why writing `AND` is still the clearer habit.

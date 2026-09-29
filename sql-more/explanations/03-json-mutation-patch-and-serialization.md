# JSON mutation patch and serialization — sql-more Q221–Q230

**What you practise:** changing a JSON document with `json_set`, `json_insert`, `json_replace`, `json_remove` and `json_patch`, and knowing exactly which of them creates a key, which overwrites one, and which deletes one.
**Prerequisites:** [01 JSON document projection and type policy](01-json-document-projection-and-type-policy.md); [02 JSON array expansion and nested traversal](02-json-array-expansion-and-nested-traversal.md); `UPDATE ... SET`.
**Exercises:** Q221: set-replace-and-add, Q222: insert-existing-path-unchanged, Q223: replace-missing-path-ignored, Q224: remove-nested-key, Q225: append-array-item, Q226: json-value-not-quoted-string, Q227: merge-patch-null-deletes, Q228: merge-patch-array-replaces, Q229: persist-json-counter-increment, Q230: object-construction-and-quoting.

## The problem in plain words

The JSON1 functions never modify anything in place. `json_set(body, ...)` reads `body`, builds a *new* document, and returns it as text. To change a stored row you have to feed that returned text back into an `UPDATE` (Q229 is the only exercise here that does).

Three of the mutation functions differ only in when they act:

| function | path exists | path missing |
| --- | --- | --- |
| `json_set` | overwrite | create |
| `json_insert` | leave alone | create |
| `json_replace` | overwrite | leave alone |

That single table is most of the family. Q221, Q222 and Q223 run the *same two path/value pairs* through the three functions and get three different documents.

`json_remove(doc, path, ...)` deletes. `json_patch(doc, patch)` is different in kind: it implements **JSON Merge Patch** (RFC 7396), where the second argument is itself a document. Members of the patch are merged into the target recursively, and a member whose patch value is `null` **deletes** the corresponding member instead of setting it to null. Arrays are not merged element by element — a patch array replaces the whole target array.

The last two scenarios are about *serialization*: getting a value into the document as the right JSON type (`json()` around a JSON-looking string, Q226) and getting SQL values out as correctly escaped JSON (`json_object`, Q230).

## The contract you must honour

Taken from `prompts/Q221.txt`–`Q230.txt` and `tests/Q221.cjs`–`Q230.cjs`. All ten share a one-row seed:

```sql
CREATE TABLE configs(id INTEGER PRIMARY KEY, body TEXT);
INSERT INTO configs VALUES
  (1,'{"mode":"draft","n":2,"tags":["a"],"nested":{"x":1,"y":2}}');
```

- One row in, one row out, every time. No exercise in this family needs an `ORDER BY`, because a single row has no order to get wrong.
- Aliases: `body` (Q221, Q222, Q223, Q224, Q227, Q230); `tags` (Q225, Q226, Q228); `n, mode` (Q229).
- The expected value is a **string**, compared character by character. SQLite's own serialization is what produces it: no spaces after `:` or `,`, and members kept in their original order with newly created members appended at the end. Hand-assembling the text with `||` will not match.
- Q221's expected body ends `..."nested":{"x":1,"y":2},"flag":1}` — `mode` is overwritten in place and `flag` is appended, which is how `json_set` orders its output.
- Q229 is the only multi-statement answer. `runtime.cjs` splits on semicolons outside quotes and comments and grades **only the final statement**, so the `UPDATE` runs for its effect and the following `SELECT` supplies the rows. A `--` comment may contain no semicolon of its own, since the splitter only stops a line comment at the newline.
- Q230 selects no table at all: `SELECT json_object(...)` is a one-row query with no `FROM`.
- Q230's expected text is `{"label":"a\"b","note":null}` — the embedded double quote is backslash-escaped by SQLite, and the SQL NULL becomes JSON `null`.

### JSON1 mutation behaviour the expected rows depend on

Checked against SQLite 3.49.1 through `node:sqlite` in this session:

- `json_set('{"tags":["a"]}','$.tags','["x","y"]')` stores the text as a **JSON string**: `{"tags":"[\"x\",\"y\"]"}`. Wrapping the argument in `json(...)` is what makes it an array. This is Q226's whole point.
- `json_set('{"a":1}','$.b',NULL)` produces `{"a":1,"b":null}` — a SQL NULL argument becomes a JSON null member. `json_set` does not delete; only `json_remove` and a merge patch delete.
- `json_insert('{"t":["a"]}','$.t[#]','b')` appends: `{"t":["a","b"]}`. Inside array brackets `#` means "the array length", so `[#]` is one past the last index — a position that does not exist yet, which is why `json_insert` creates it.
- `json_patch('{"a":{"x":1,"y":2}}','{"a":null}')` returns `{}`: a null in a merge patch removes the member, and it removes the whole subtree.
- `json_object('label','a"b','note',NULL)` returns `{"label":"a\"b","note":null}`. `json_quote('a"b')` returns `"a\"b"` — the same escaping applied to one value.
- `json_remove` at a path that does not exist is a no-op, not an error.
- All of these return SQL type `text`. There is no distinct JSON storage type in SQLite's public API here.

## Approach

1. **Pick the function from the create/overwrite table above.** "Replace mode and add flag" is `json_set`; "leave mode alone but add flag" is `json_insert`; "change mode and ignore a flag that is not there" is `json_replace`.
2. **Pass path/value pairs, as many as you need.** `json_set(body,'$.mode','live','$.flag',1)` performs both edits in one call and one pass, rather than nesting two calls.
3. **Write nested paths with dots** — `'$.nested.y'` — and array positions with brackets. `json_remove` takes several paths at once (Q224).
4. **Append to an array with the `[#]` path** (Q225). `json_insert` is the natural partner: the position is by definition missing.
5. **Wrap a JSON-valued argument in `json()`** whenever the value you are storing is itself a document (Q226). Without it you store a string that merely looks like JSON, and later `json_extract` calls will return that string rather than an array.
6. **Use `json_patch` when the edit is described as a document** (Q227, Q228), and remember its two special rules: `null` deletes, and an array replaces wholesale.
7. **Project a sub-document back out with `json_extract`** when the prompt asks for `tags` rather than the whole body (Q225, Q226, Q228). The mutation produces a full document; the extraction picks the part being demonstrated.
8. **Persist with `UPDATE ... SET body = json_set(body, ...)` and then select** (Q229). Reading `json_extract(body,'$.n')` inside the same `json_set` call is safe, because the right-hand side is evaluated against the row's current value.
9. **Build a fresh document with `json_object(key, value, ...)`** (Q230) rather than string concatenation, so that escaping and NULL handling are SQLite's problem and not yours.

## Worked example — Q221 set-replace-and-add

The task, quoted from `prompts/Q221.txt`: "Return JSON with mode replaced by live and new flag set to integer 1; leave other fields intact."

**Step 1 — the stored document.**

```json
{"mode":"draft","n":2,"tags":["a"],"nested":{"x":1,"y":2}}
```

**Step 2 — `json_set(body,'$.mode','live','$.flag',1)`.** The function applies the pairs left to right.

| pair | path present? | action | document after |
| --- | --- | --- | --- |
| `'$.mode'`, `'live'` | yes | overwrite in place | `{"mode":"live","n":2,"tags":["a"],"nested":{"x":1,"y":2}}` |
| `'$.flag'`, `1` | no | create, appended at the end | `{"mode":"live","n":2,"tags":["a"],"nested":{"x":1,"y":2},"flag":1}` |

Two details decide the expected string. First, an overwritten member keeps its original position, so `mode` stays first. Second, a created member is appended, so `flag` lands last — not in alphabetical order, and not where you wrote it in the argument list.

**Step 3 — `AS body`.** The alias reuses the column name; the value is the *new* text, and the stored row is untouched because nothing wrote it back.

**Step 4 — no `ORDER BY`.** `configs` holds one row.

**The asserted result**, from `tests/Q221.cjs`:

```sql
-- [{"body":"{\"mode\":\"live\",\"n\":2,\"tags\":[\"a\"],\"nested\":{\"x\":1,\"y\":2},\"flag\":1}"}]
```

The reference solution as it now reads in `solutions/Q221.sql`:

```sql
-- Why this works:
-- json_set overwrites a path that exists and creates one that does not, so a
-- single call covers both edits the prompt asks for.
-- The pairs are applied left to right: '$.mode' already exists and is
-- replaced in place, keeping its original first position.
-- '$.flag' is new, so SQLite appends it after the existing members, which is
-- why the expected text ends with "flag":1.
-- The function returns new text; the stored row is not modified.
SELECT json_set(body, '$.mode', 'live', '$.flag', 1) AS body
FROM configs;
```

**Contrast with Q222 and Q223.** The arguments are identical in all three. `json_insert` refuses to touch the existing `$.mode` and only adds `flag`, so the expected body still says `"mode":"draft"`. `json_replace` does the opposite: it changes `mode` and ignores `$.flag` because that path does not exist, so the expected body has no `flag` at all. Reading the three expected strings side by side is the fastest way to memorise the table.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q221 | set-replace-and-add | "mode replaced … and new flag set" | `json_set(body,'$.mode','live','$.flag',1)` |
| Q222 | insert-existing-path-unchanged | "existing mode remains draft" | same arguments, function becomes `json_insert` |
| Q223 | replace-missing-path-ignored | "only mode changes" | same arguments, function becomes `json_replace` |
| Q224 | remove-nested-key | "remove nested.y and top-level n" | `json_remove(body,'$.nested.y','$.n')` |
| Q225 | append-array-item | "append b using the `[#]` array path" | `json_insert(body,'$.tags[#]','b')` then extract `'$.tags'` |
| Q226 | json-value-not-quoted-string | "wrapping the value in `json()`" | `json_set(body,'$.tags',json('["x","y"]'))` then extract |
| Q227 | merge-patch-null-deletes | "remove mode using null … nested.x to 9" | `json_patch(body,'{"mode":null,"nested":{"x":9}}')` |
| Q228 | merge-patch-array-replaces | "replaces the entire array rather than appending" | `json_patch(body,'{"tags":["b"]}')` then extract |
| Q229 | persist-json-counter-increment | "update stored n by adding three" | an `UPDATE` statement first, then a `SELECT` of the stored values |
| Q230 | object-construction-and-quoting | "construct JSON object … escape the quote and emit null" | no table: `json_object('label','a"b','note',NULL)` |

## Pitfalls the tests are designed to catch

- **Reaching for `json_set` everywhere.** Q222 and Q223 exist to punish that. `json_set` would change `mode` in Q222 (expected: still `draft`) and would add `flag` in Q223 (expected: absent).
- **Expecting a created member to appear where you named it.** SQLite appends new members. Q221's `flag` comes last even though it is the second pair; writing the pairs in the other order does not move it.
- **Storing JSON as a quoted string.** `json_set(body,'$.tags','["x","y"]')` yields `"tags":"[\"x\",\"y\"]"` — one string, not an array. Q226 names the fix: `json(...)`.
- **Using `json_set(..., NULL)` to delete.** It writes `"key":null` instead. Deletion is `json_remove`, or a `null` inside a merge patch.
- **Assuming a merge patch merges arrays.** Q228's expected `tags` is `["b"]`, not `["a","b"]`. RFC 7396 replaces arrays wholesale; appending needs the `[#]` path from Q225.
- **Assuming a merge patch `null` only clears a leaf.** `json_patch('{"a":{"x":1,"y":2}}','{"a":null}')` returns `{}` — the whole subtree goes. Q227 deletes `mode` and simultaneously merges into `nested`, and `nested.y` survives only because the patch does not mention it.
- **Writing `[-1]` or a literal index in Q225.** The array has one element today; `[#]` means "one past the end" whatever the length is, and is the path the prompt names.
- **Forgetting to write the change back in Q229.** `SELECT json_set(...)` returns a new document and stores nothing; the following `SELECT` would still report `n` as 2. The `UPDATE` is required, and the graded rows come from the last statement.
- **Putting a semicolon inside a comment in Q229.** `runtime.cjs` ends a `--` comment at the newline, so a semicolon there is ignored — but a semicolon written in code where you meant a comment would split the statement and change which one is graded.
- **Building Q230 by concatenation.** `'{"label":"' || 'a"b' || '"}'` produces invalid JSON, because the inner quote is not escaped, and `'x' || NULL` is NULL in SQLite, so the `note` member would destroy the whole string. `json_object` escapes and emits `null` correctly.
- **Expecting `json_object` to sort keys.** It emits them in argument order; `label` then `note` is what the test asserts.
- **Adding a `FROM configs` to Q230.** It would still return one row here, but the exercise is about construction, not about the stored document — and if the table held two rows the answer would double.

## Try it yourself

1. Write one `json_patch` call that produces Q221's expected body. Which member ends up where, and does the result match character for character?
2. Apply `json_insert(body,'$.nested.z',3)` and then `json_remove` the same path. Do you get the original text back byte for byte?
3. Change Q229 to increment `n` for every row in a many-row table. Does the expression `json_extract(body,'$.n')+3` still read the pre-update value?
4. In words: `json_set` and `json_patch` can both change `nested.x` to 9. Name one edit each can do that the other cannot.

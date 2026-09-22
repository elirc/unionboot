# unionboot — Solutions

> Try each exercise for 10+ minutes before reading. Reading the solution
> is fine; copying it without understanding defeats the point.

Every entry has three parts: the reference code, a **Why it works**
paragraph, and a **Worked trace** that runs the exercise file's own
sample input through the code one step at a time. The traces quote the
`// expected:` values from the exercise files exactly.

## 01 — Temperature converter

```js
function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}
```

**Why it works.** The formula is one expression, so the whole function is
a single `return`. Multiplying before dividing — `(c * 9) / 5` rather
than `c * (9 / 5)` — keeps the intermediate value an integer for integer
inputs, so you avoid carrying the repeating binary fraction `1.8` through
the multiplication. The trap this exercise is about is the difference
between printing and returning: `console.log` inside the function would
make the function return `undefined`, and every later exercise builds on
functions that hand a value back to their caller.

**Worked trace** — `celsiusToFahrenheit(100)`, `// expected: 212`.

```text
c        = 100
c * 9    = 900
900 / 5  = 180
180 + 32 = 212      <- returned
```

Check the other two samples the same way: `0 -> 0/5 + 32 = 32`, and
`37 -> 333/5 = 66.6 -> 98.6`.

## 02 — Initials

```js
function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0].toUpperCase())
    .join(".") + ".";
}
```

**Why it works.** Split, transform, join is the standard three-step shape
for string work: `split(" ")` turns the sentence into an array of words,
`map` replaces each word with its first character upper-cased, and
`join(".")` glues them back together. An array is the right intermediate
structure because `map` keeps positions aligned with the input. The trap
is the trailing dot: `join` only puts separators *between* elements, so
`'A.L'` comes out of `join` and the explicit `+ "."` is what turns it
into `'A.L.'`.

**Worked trace** — `getInitials('grace brewster hopper')`,
`// expected: G.B.H.`.

```text
split(" ")                -> ['grace', 'brewster', 'hopper']
map(w => w[0].toUpperCase())
  'grace'    -> 'g' -> 'G'
  'brewster' -> 'b' -> 'B'
  'hopper'   -> 'h' -> 'H'
                          -> ['G', 'B', 'H']
join(".")                 -> 'G.B.H'
+ "."                     -> 'G.B.H.'   <- returned
```

Single-word input takes the same path: `'linus'` gives `['L']`, `join`
returns `'L'` with no separator at all, and the `+ "."` produces `'L.'`.

## 03 — Second largest

```js
function secondLargest(nums) {
  return [...new Set(nums)].sort((a, b) => b - a)[1];
}
```

**Why it works.** "Second largest *unique* value" means duplicates have
to disappear before you rank anything, and a `Set` does that in one pass
— it keeps only the first occurrence of each value. Spreading the Set
into a fresh array matters twice: it gives you something sortable, and it
means `sort`, which mutates in place, never touches the caller's array.
The comparator `(a, b) => b - a` sorts descending numerically; the
default `sort()` compares strings, so `[10, 9]` would come back as
`[10, 9]` by luck and `[100, 9]` as `[100, 9]`… wrong for
`[9, 100]`. Reading index `1` of a one-element array gives `undefined`
for free, which is exactly the required answer when there is no second
distinct value.

**Worked trace** — `secondLargest([4, 9, 1, 9, 7])`, `// expected: 7`.

```text
new Set([4,9,1,9,7])  -> Set {4, 9, 1, 7}   (second 9 dropped)
[...set]              -> [4, 9, 1, 7]       (new array; input untouched)
.sort((a,b) => b - a) -> [9, 7, 4, 1]
[1]                   -> 7                  <- returned
```

Edge cases: `[5, 5, 5]` collapses to `[5]`, so `[1]` is `undefined`; `[]`
collapses to `[]`, so `[1]` is `undefined` again.

## 04 — Word counter

```js
function countWords(words) {
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  return Object.fromEntries(counts);
}
```

**Why it works.** Tallying is "look up the current count, add one, store
it back", and `?? 0` supplies the starting value the first time a word is
seen. The data-structure choice is the whole point: a `Map` has no
prototype, so a word like `'constructor'` or `'toString'` is just a key.
A plain object would inherit those names, and `counts['constructor'] || 0`
would read the inherited constructor *function*, which is truthy, and
adding 1 to it yields `NaN`. `Object.fromEntries` converts the Map to the
plain object the exercise asks for at the very end, after all the
dangerous lookups are done.

**Worked trace** — `countWords(['apple', 'banana', 'apple'])`,
`// expected: { apple: 2, banana: 1 }`.

```text
start            Map {}
'apple'   get -> undefined ?? 0 = 0, set 1   Map { apple: 1 }
'banana'  get -> undefined ?? 0 = 0, set 1   Map { apple: 1, banana: 1 }
'apple'   get -> 1, set 2                    Map { apple: 2, banana: 1 }
Object.fromEntries -> { apple: 2, banana: 1 }
```

The prototype trap: `countWords(['constructor', 'constructor'])` runs the
identical path and returns `{ constructor: 2 }`.

## 05 — FizzBuzz

```js
for (let i = 1; i <= 30; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}
```

**Why it works.** The only design decision is the order of the tests. A
number divisible by both 3 and 5 is divisible by 15, so checking `% 15`
first catches that case before either single-factor branch can claim it.
Written the other way round, 15 would print `"Fizz"` and the `FizzBuzz`
branch would never run. `else if` matters too: with three independent
`if` statements, 15 would print three lines.

**Worked trace** — first lines of `node 05-fizzbuzz.js`; the file says
they should be `1, 2, Fizz, 4, Buzz, Fizz, 7 ...` and line 15 should be
`FizzBuzz`.

```text
i    i%15  i%3  i%5  branch taken      printed
1     1     1    1   else              1
2     2     2    2   else              2
3     3     0    3   i % 3 === 0       Fizz
4     4     1    4   else              4
5     5     2    0   i % 5 === 0       Buzz
6     6     0    1   i % 3 === 0       Fizz
...
15    0     0    0   i % 15 === 0      FizzBuzz
...
30    0     0    0   i % 15 === 0      FizzBuzz
```

The loop runs 30 times and prints exactly 30 lines.

## 06 — Make a counter

```js
function makeCounter(start = 0) {
  let count = start;
  return () => ++count;
}
```

**Why it works.** `count` is declared inside `makeCounter`, so each call
to `makeCounter` creates a brand-new variable, and the returned arrow
function closes over that particular variable. That is what a closure is:
a function plus the scope it was born in. Two counters therefore cannot
interfere, because they are looking at two different `count` bindings —
no shared module-level state exists. The trap is `++count` versus
`count++`: the pre-increment returns the value *after* the bump, which is
what the expected output `1, 2, 3` requires; `count++` would print
`0, 1, 2`.

**Worked trace** — the exercise file's `c1` / `c2` sequence.

```text
c1 = makeCounter()     closure A: count = 0
c1()                   count 0 -> 1, returns 1     // expected: 1
c1()                   count 1 -> 2, returns 2     // expected: 2
c2 = makeCounter(10)   closure B: count = 10
c2()                   count 10 -> 11, returns 11  // expected: 11
c2()                   count 11 -> 12, returns 12  // expected: 12
c1()                   closure A still at 2 -> 3   // expected: 3
```

## 07 — Honor roll

```js
const honorRoll = students
  .filter((s) => s.score >= 70)
  .map((s) => s.name.toUpperCase())
  .sort();

const average = (
  students.reduce((sum, s) => sum + s.score, 0) / students.length
).toFixed(1);
```

**Why it works.** `filter`, `map` and `reduce` each return something new
and leave `students` alone, which is why `students[0].score` is still
`92` afterwards. Order in the chain matters: filtering first means `map`
and `sort` only handle the three qualifying records, and sorting *after*
uppercasing sorts the strings that are actually printed. `sort()` with no
comparator is correct here precisely because the values are strings.
`toFixed(1)` rounds to one decimal and returns a **string**, `'72.2'`,
which is why the assertion wraps it in `Number(...)`.

**Worked trace** — the `students` array defined in `07-honor-roll.js`.

```text
filter(score >= 70)
  Ada 92     keep
  Linus 48   drop
  Grace 78   keep
  Edsger 55  drop
  Barbara 88 keep        -> [Ada, Grace, Barbara]
map(name.toUpperCase())  -> ['ADA', 'GRACE', 'BARBARA']
sort()                   -> ['ADA', 'BARBARA', 'GRACE']   // expected

reduce sum: 0 +92 =92 +48 =140 +78 =218 +55 =273 +88 =361
361 / 5      = 72.2
(72.2).toFixed(1) = '72.2'                                 // expected: 72.2
```

## 08 — Shopping cart

```js
function checkout(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const rate = subtotal > 1000 ? 0.2 : subtotal > 500 ? 0.1 : 0;
  const discount = subtotal * rate;
  return { subtotal, discount, total: subtotal - discount };
}
```

**Why it works.** `reduce` with the seed `0` is the safe way to total a
list: it returns `0` for an empty cart instead of throwing, which is why
`checkout([])` gives `{ subtotal: 0, discount: 0, total: 0 }`. The
chained ternary reads as a policy table evaluated top-down, and because
the thresholds are strictly greater-than, a subtotal of exactly `500`
gets no discount and exactly `1000` gets 10%, not 20%. Computing
`discount` once and subtracting it guarantees `subtotal - discount` and
`total` can never disagree.

**Worked trace** — the exercise file's `cart`, `// expected:
{ subtotal: 600, discount: 60, total: 540 }`.

```text
reduce
  Keyboard  80 * 1 = 80    sum = 80
  Cable      5 * 4 = 20    sum = 100
  Monitor  250 * 2 = 500   sum = 600
subtotal = 600
600 > 1000? no   600 > 500? yes  -> rate = 0.1
discount = 600 * 0.1 = 60
total    = 600 - 60 = 540
```

The second sample takes the last branch: subtotal `6`, `rate` `0`,
`{ subtotal: 6, discount: 0, total: 6 }`.

## 09 — Capitalize words

```js
function capitalizeWords(sentence) {
  return sentence
    .split(" ")
    .filter((w) => w.length > 0)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
```

**Why it works.** Each word is rebuilt from two pieces — the first
character upper-cased and the rest lower-cased — so input that is already
shouting (`'FUN'`) is normalised rather than left alone. The `filter`
step is what makes the empty-string case work: `''.split(" ")` returns
`['']`, not `[]`, so without the filter `w[0]` would be `undefined` and
`.toUpperCase()` would throw. Filtering empty segments also protects
against runs of spaces.

**Worked trace** — `capitalizeWords('jAVA sCRIPT is FUN')`,
`// expected: Java Script Is Fun`.

```text
split(" ")   -> ['jAVA', 'sCRIPT', 'is', 'FUN']
filter       -> unchanged (no empty segments)
map
  'jAVA'   -> 'J' + 'AVA'.toLowerCase()   = 'Java'
  'sCRIPT' -> 'S' + 'CRIPT'.toLowerCase() = 'Script'
  'is'     -> 'I' + 's'                   = 'Is'
  'FUN'    -> 'F' + 'UN'.toLowerCase()    = 'Fun'
join(" ")    -> 'Java Script Is Fun'
```

Empty input: `''` -> `['']` -> filter -> `[]` -> `join` -> `''`.

## 10 — Flatten one level

```js
function flatten(arr) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item)) out.push(...item);
    else out.push(item);
  }
  return out;
}
```

**Why it works.** `push(...item)` copies an array's elements into `out`
without recursing into them, which is precisely the "one level only"
rule. `Array.isArray` is the correct test because `typeof []` is
`'object'`, so a `typeof` check would also catch plain objects. The trap
is that a deeper array such as `[5]` is an *element* of `[4, [5]]`, so it
is pushed unchanged and survives in the output.

**Worked trace** — `flatten([1, [2, 3], [4, [5]]])`,
`// expected: [ 1, 2, 3, 4, [ 5 ] ]`.

```text
item        isArray  action                out after
1           no       push(1)               [1]
[2, 3]      yes      push(2, 3)            [1, 2, 3]
[4, [5]]    yes      push(4, [5])          [1, 2, 3, 4, [5]]
```

`flatten([[], [1], [2, 3]])` spreads an empty array (adds nothing) and
then `1`, `2`, `3`, giving `[1, 2, 3]`.

## 11 — Palindrome check

```js
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z]/g, "");
  return clean === [...clean].reverse().join("");
}
```

**Why it works.** Normalise first, compare second. Lower-casing *before*
the regex is what lets the character class stay `[^a-z]`: after
`toLowerCase()` there are no capitals left to strip, so one class removes
punctuation, spaces and digits in a single pass. `[...clean]` builds a
fresh array of characters, so `reverse()` — which mutates — never touches
anything the caller can see. An empty string reverses to an empty string,
so `isPalindrome('')` is `true` without a special case.

**Worked trace** — `isPalindrome('A man, a plan, a canal: Panama')`,
`// expected: true`.

```text
toLowerCase()            'a man, a plan, a canal: panama'
replace(/[^a-z]/g, '')   'amanaplanacanalpanama'
[...clean]               ['a','m','a','n','a',...]
reverse().join('')       'amanaplanacanalpanama'
equal?                   true
```

`'hello'` cleans to `'hello'`, reverses to `'olleh'`, so the comparison
is `false`.

## 12 — Chunk an array

```js
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}
```

**Why it works.** Stepping the index by `size` instead of by one means
each iteration produces exactly one chunk, and `slice` does the two hard
parts for you: it copies (so chunks are independent arrays) and it clamps
the end index to the array length, so the final short chunk needs no
special handling. An empty array never enters the loop, so the result is
`[]` rather than `[[]]`.

**Worked trace** — `chunk([1, 2, 3, 4, 5], 2)`,
`// expected: [ [ 1, 2 ], [ 3, 4 ], [ 5 ] ]`.

```text
i = 0   slice(0, 2) -> [1, 2]     out = [[1,2]]
i = 2   slice(2, 4) -> [3, 4]     out = [[1,2],[3,4]]
i = 4   slice(4, 6) -> [5]        out = [[1,2],[3,4],[5]]   (end clamped)
i = 6   6 < 5 false -> stop
```

`chunk([1, 2, 3], 5)` runs once: `slice(0, 5)` clamps to `[1, 2, 3]`.

## 13 — First unique character

```js
function firstUniqueChar(str) {
  const counts = {};
  for (const ch of str) counts[ch] = (counts[ch] || 0) + 1;
  for (let i = 0; i < str.length; i++) {
    if (counts[str[i]] === 1) return i;
  }
  return -1;
}
```

**Why it works.** You cannot know a character is unique until you have
seen the whole string, so this is a two-pass algorithm: pass one builds
the frequency table, pass two walks the string *in order* and returns the
first index whose count is `1`. Walking the string rather than the table
in the second pass is what makes "first" mean first by position. The
counting object is safe here only because the keys are single characters
from the sample inputs — with arbitrary words you would want the `Map` of
exercise 04.

**Worked trace** — `firstUniqueChar('swiss')`, `// expected: 1`.

```text
pass 1
  's' -> 1     { s: 1 }
  'w' -> 1     { s: 1, w: 1 }
  'i' -> 1     { s: 1, w: 1, i: 1 }
  's' -> 2     { s: 2, w: 1, i: 1 }
  's' -> 3     { s: 3, w: 1, i: 1 }
pass 2
  i = 0  str[0] = 's'  count 3  no
  i = 1  str[1] = 'w'  count 1  return 1
```

`'aabb'` reaches the end of pass two with every count at `2`, so it falls
through to `return -1`.

## 14 — Digital root

```js
function digitalRoot(n) {
  while (n >= 10) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return n;
}
```

**Why it works.** The task is "repeat until a condition holds", which is
the definition of a `while` loop — recursion would work too but needs an
extra base case. Converting the number to a string and splitting it is
the cheapest way to get at individual digits; `Number(d)` is required
because `sum + '4'` would concatenate rather than add. The loop condition
`n >= 10` is also the exit test for single-digit input, so
`digitalRoot(7)` returns `7` without iterating at all.

**Worked trace** — `digitalRoot(942)`, `// expected: 6`.

```text
n = 942   942 >= 10 -> '942' -> ['9','4','2'] -> 9 + 4 + 2 = 15
n = 15     15 >= 10 -> '15'  -> ['1','5']     -> 1 + 5     = 6
n = 6       6 >= 10 false -> return 6
```

`digitalRoot(99999)`: `9*5 = 45`, then `4 + 5 = 9`.

## 15 — Reverse the words

```js
function reverseWords(sentence) {
  return sentence.trim().split(/\s+/).reverse().join(" ");
}
```

**Why it works.** Three jobs, three calls. `trim()` removes leading and
trailing whitespace; splitting on the regex `/\s+/` instead of the string
`" "` treats any run of whitespace as one separator, which is what
"collapse extra spaces" means; `reverse()` flips the word order while
leaving each word's characters intact. Order matters: without `trim()`
first, a leading space would produce an empty first element that
`reverse` would move to the end and `join` would turn into a trailing
space.

**Worked trace** — `reverseWords('  too   many spaces ')`,
`// expected: spaces many too`.

```text
trim()        'too   many spaces'
split(/\s+/)  ['too', 'many', 'spaces']    (the 3-space run is one split)
reverse()     ['spaces', 'many', 'too']
join(" ")     'spaces many too'
```

Empty input: `''.trim()` is `''`, `''.split(/\s+/)` is `['']`, and
joining a single empty string gives `''`.

## 16 — Anagram check

```js
function areAnagrams(a, b) {
  const norm = (s) => s.toLowerCase().replace(/\s/g, "").split("").sort().join("");
  return norm(a) === norm(b);
}
```

**Why it works.** Two strings are anagrams exactly when their sorted
letters are identical, so normalising both to a canonical form turns the
problem into one `===`. The helper does the normalising in one place,
which guarantees both sides get the same treatment — a common bug is
lower-casing one argument and forgetting the other. Sorting is
`O(n log n)`; a frequency `Map` would be `O(n)`, but at these input sizes
the sorted-string version is shorter and obviously correct.

**Worked trace** — `areAnagrams('Dormitory', 'Dirty Room')`,
`// expected: true`.

```text
'Dormitory'   lower -> 'dormitory'  no spaces
              sort  -> d i m o o r r t y   -> 'dimoorrty'
'Dirty Room'  lower -> 'dirty room'
              strip -> 'dirtyroom'
              sort  -> d i m o o r r t y   -> 'dimoorrty'
'dimoorrty' === 'dimoorrty'  ->  true
```

`areAnagrams('aab', 'abb')` normalises to `'aab'` and `'abb'` — same
letters, different counts, so `false`.

## 17 — LRU cache

```js
class LRUCache {
  #map = new Map();

  constructor(capacity) {
    this.capacity = capacity;
  }

  get(key) {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key);
    this.#map.delete(key); // re-insert to mark as most recently used
    this.#map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.#map.has(key)) this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.capacity) {
      const oldest = this.#map.keys().next().value; // least recently used
      this.#map.delete(oldest);
    }
  }
}
```

**Why it works.** A `Map` iterates in insertion order, so "delete then
re-set" is the whole trick for tracking recency: re-inserting a key moves
it to the back of the iteration order, which makes the *front* the least
recently used entry. `map.keys().next().value` reads that front key
without materialising an array. Both `get` and `put` count as a use, so
both re-insert. The `#map` field is private, so callers cannot reach in
and reorder the cache behind the class's back, and the capacity check
runs after the insert — one eviction per `put` is enough because the size
can only exceed capacity by one.

**Worked trace** — the exercise file's `LRUCache(2)` sequence.

```text
put('a',1)   map: a=1                          size 1
put('b',2)   map: a=1, b=2                     size 2
get('a')     has -> delete a, set a
             map: b=2, a=1                     returns 1   // expected: 1
put('c',3)   map: b=2, a=1, c=3   size 3 > 2
             oldest = first key = 'b' -> delete
             map: a=1, c=3
get('b')     not present                       undefined   // expected
get('a')     map: c=3, a=1                     returns 1   // expected: 1
get('c')     map: a=1, c=3                     returns 3   // expected: 3
```

Note `'b'` was evicted rather than `'a'`, even though `'a'` was inserted
first: the `get('a')` promoted it.

## 18 — Event emitter

```js
class Emitter {
  #listeners = new Map();

  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
    return this;
  }

  off(event, fn) {
    const list = this.#listeners.get(event);
    if (!list) return this;
    const idx = list.indexOf(fn);
    if (idx !== -1) list.splice(idx, 1);
    return this;
  }

  emit(event, ...args) {
    for (const fn of this.#listeners.get(event) ?? []) fn(...args);
  }
}
```

**Why it works.** The structure is a `Map` from event name to an array of
listeners: the Map gives safe arbitrary string keys, the array preserves
registration order so listeners fire in the order they were added.
`off` removes by function *identity* via `indexOf`, which is why you must
keep a reference to the listener you registered — an inline arrow passed
to `on` can never be removed. The `?? []` in `emit` is what makes
emitting an unknown event a no-op instead of a `TypeError` on
`undefined`.

**Worked trace** — the exercise file's `bus` sequence (`shout` and `log`
push into `seen`).

```text
on('message', shout)   listeners: message -> [shout]
on('message', log)     listeners: message -> [shout, log]
emit('message','hi')   calls shout('hi'), then log('hi')
                       seen = ['shout: hi', 'log: hi']
off('message', log)    indexOf(log) = 1 -> splice
                       listeners: message -> [shout]
emit('message','again')
                       seen = ['shout: hi', 'log: hi', 'shout: again']
emit('nope')           get('nope') -> undefined ?? [] -> loop body never runs
```

Final `seen` is `[ 'shout: hi', 'log: hi', 'shout: again' ]`.

## 19 — Deep equality

```js
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((k) => k in b && deepEqual(a[k], b[k]));
}
```

**Why it works.** The guards are ordered cheapest-first: identity, then
type, then the null check, then shape. `typeof null === "object"` is the
classic JavaScript trap, and it is why the explicit `a === null` line
exists — without it, `deepEqual(null, {})` would fall through to
`Object.keys(null)` and throw. The `Array.isArray` comparison stops
`[1, 2]` from matching `{ 0: 1, 1: 2 }`, which have identical keys and
values. Comparing key *counts* before recursing is what makes
`{ x: 1 }` differ from `{ x: 1, y: undefined }`: both agree on `x`, but
the second has an extra own key even though its value is `undefined`.
Recursion is natural here because the sub-problem — compare two values —
is the same problem one level down.

**Worked trace** — `deepEqual({ x: 1, y: { z: 2 } }, { x: 1, y: { z: 2 } })`,
`// expected: true`.

```text
level 0   a === b?           no (different objects)
          typeof both        'object'
          null?              no
          isArray both       false === false
          keys               ['x','y'] vs ['x','y']   lengths 2 = 2
          'x' in b -> deepEqual(1, 1)      -> 1 === 1  true
          'y' in b -> deepEqual({z:2},{z:2})
level 1     keys ['z'] vs ['z']
            deepEqual(2, 2) -> true
          every(...) -> true
```

The three failing samples: `{x:1}` vs `{x:1,y:undefined}` stops at the
key-count line (1 vs 2); `[1,2]` vs `[2,1]` recurses and finds
`deepEqual(1, 2)` false; `null` vs `{}` is caught by the null guard.

## 20 — Async waterfall

```js
// version 1: async/await
async function main() {
  const user = await fetchUser(1);
  const posts = await fetchPosts(user);
  const comments = await fetchComments(posts);
  console.log(comments);
}
main();

// version 2: .then() chaining
fetchUser(1)
  .then((user) => fetchPosts(user))
  .then((posts) => fetchComments(posts))
  .then((comments) => console.log(comments));
```

**Why it works.** Each call needs the previous call's result, so the
three requests genuinely have to run one after another — this is a
waterfall, not a case for `Promise.all`. The two versions are the same
program: `await` suspends `main` until the promise settles and hands you
the resolved value, while `.then(cb)` registers `cb` to receive it.
Returning a promise from inside `.then` is what keeps the chain flat —
the next `.then` waits for *that* promise rather than receiving it as a
value. Both versions log the same array, and both run to completion
without blocking the rest of the program.

**Worked trace** — `20-async-sequence.js` with its own fake API calls.

```text
t=0ms     fetchUser(1) called          pending
t=100ms   resolves { id: 1, name: 'Ada' }
          -> fetchPosts(user) called   pending
t=200ms   resolves [ 'post by Ada #1', 'post by Ada #2' ]
          -> fetchComments(posts)      pending
t=300ms   resolves [ 'comment on "post by Ada #1"',
                     'comment on "post by Ada #2"' ]
          console.log(comments)
```

Both versions start at `t=0` and print one array each, so running the
file produces two identical lines.

## 21 — Retry with backoff

```js
function retry(fn, attempts, delayMs) {
  return new Promise((resolve, reject) => {
    const attempt = (triesLeft) => {
      fn()
        .then(resolve)
        .catch((err) => {
          if (triesLeft <= 1) return reject(err);
          setTimeout(() => attempt(triesLeft - 1), delayMs);
        });
    };
    attempt(attempts);
  });
}
```

**Why it works.** The outer promise is created once and settled once,
while the inner `attempt` function calls itself again after each failure
— you cannot `await` inside a plain `.catch()` chain without an async
function, so the setTimeout-in-catch recursion is the standard pattern
for this shape. `triesLeft` counts *total* tries, so the guard
`triesLeft <= 1` fires on the last permitted attempt and rejects with the
error that actually occurred, preserving its identity rather than
wrapping it. Because `resolve` and `reject` are captured in the closure,
any level of the recursion can settle the single promise the caller is
holding.

**Worked trace** — `retry(flaky, 5, 200)` from the exercise file, where
`flaky` fails the first three times.

```text
attempt(5)   fn() -> reject('boom')  triesLeft 5 > 1 -> wait 200ms
             log: attempt 1: failed
attempt(4)   fn() -> reject('boom')  triesLeft 4 > 1 -> wait 200ms
             log: attempt 2: failed
attempt(3)   fn() -> reject('boom')  triesLeft 3 > 1 -> wait 200ms
             log: attempt 3: failed
attempt(2)   fn() -> resolve('succeeded on attempt 4')
             resolve(...) settles the outer promise
             .then(console.log) prints: succeeded on attempt 4
```

If every attempt failed, `attempt(1)` would hit `triesLeft <= 1` and
`reject(err)` with the last error, and the `.catch` in the exercise file
would print `gave up: boom`.

## 22 — Balanced brackets

```js
function isBalanced(str) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of str) {
    if ("([{".includes(ch)) stack.push(ch);
    else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}
```

**Why it works.** Brackets close in last-opened-first-closed order, which
is exactly what a stack models; an array with `push`/`pop` is a stack.
Every closer must match the most recent opener, so one `pop` and one
comparison decides it. `")("` must fail because you pop before you push —
popping an empty array returns `undefined`, which fails the comparison
naturally, so no explicit emptiness check is needed. The final
`stack.length === 0` catches the opposite error, openers that were never
closed, and characters that are neither opener nor closer fall through
both branches and are ignored.

**Worked trace** — `isBalanced('{[()]}')` (`true`) and `isBalanced('([)]')`
(`false`).

```text
'{[()]}'
  '{'  push        stack ['{']
  '['  push        stack ['{','[']
  '('  push        stack ['{','[','(']
  ')'  pop '(' === pairs[')'] = '('   ok   stack ['{','[']
  ']'  pop '[' === '['                ok   stack ['{']
  '}'  pop '{' === '{'                ok   stack []
  length 0 -> true

'([)]'
  '('  push        stack ['(']
  '['  push        stack ['(','[']
  ')'  pop '[' !== pairs[')'] = '('   -> return false
```

And `')('`: the first character pops an empty stack, `undefined !== '('`,
so it returns `false` immediately.

## 23 — Todo reducer

```js
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const id = state.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;
      return [...state, { id, text: action.text, done: false }];
    }
    case "TOGGLE":
      return state.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t
      );
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return [...state];
  }
}
```

**Why it works.** Every case must return a NEW array — `[...state]`,
`state.map(...)` and `state.filter(...)` do this for free, while
`state.push(x)` would not, and would also throw on the frozen empty array
the tests pass in. `TOGGLE` goes one level further and spreads the
matching todo into a new object (`{ ...t, done: !t.done }`), leaving the
previous state's objects untouched; that is why an already-added todo
still reads `done: false` after a toggle produced a new state. The
reducer is *pure*: same inputs, same output, no side effects, which is
what lets the test call it twice on the same input and deep-compare the
results. Deriving the new id from `Math.max` of the existing ids rather
than from `state.length` keeps ids unique after removals.

**Worked trace** — the exercise file's `s0 … s4` chain.

```text
s0 = []
ADD 'learn closures'
  id = max(0) + 1 = 1
  s1 = [ { id: 1, text: 'learn closures', done: false } ]
ADD 'learn promises'
  id = max(0, 1) + 1 = 2
  s2 = [ {id:1,...}, { id: 2, text: 'learn promises', done: false } ]
TOGGLE id 1
  map: id 1 matches -> { ...t, done: true }; id 2 kept as the same object
  s3 = [ {id:1,done:true}, {id:2,done:false} ]
  s2[0].done is still false
REMOVE id 2
  filter keeps id 1
  s4 = [ {id:1,done:true} ]
s1 === s2  -> false   (every step is a new array)
```

## 24 — Prototypes & `this`

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  describe() {
    return `${this.name} is an animal`;
  }
}

class Dog extends Animal {
  describe() {
    return `${this.name} is a dog`;
  }
  bark() {
    return "WOOF";
  }
}

const d = new Dog("Rex");
console.log(d.describe());            // Rex is a dog
console.log(new Animal("Rex").describe()); // Rex is an animal
console.log(d instanceof Animal);     // true
console.log(d.bark());                // WOOF
```

**Why it works.** `class` is syntax over prototypes: `Dog.prototype`'s
prototype is `Animal.prototype`, so a method lookup on a `Dog` instance
checks the instance, then `Dog.prototype`, then `Animal.prototype`, and
stops at the first match. `Dog` defines its own `describe`, so that one
wins — this is overriding, not deleting; `Animal.prototype.describe` is
still there and still used by plain `Animal` instances. `Dog` declares no
constructor, so it inherits `Animal`'s, which is why `new Dog("Rex")`
sets `this.name`. `instanceof` walks the same prototype chain, which is
why a `Dog` is also an `Animal`.

**Worked trace** — the four `console.log` lines.

```text
new Dog('Rex')
  no Dog constructor -> Animal's runs -> this.name = 'Rex'
d.describe()
  own property?        no
  Dog.prototype?       yes -> 'Rex is a dog'
new Animal('Rex').describe()
  Animal.prototype     -> 'Rex is an animal'
d instanceof Animal
  chain: d -> Dog.prototype -> Animal.prototype  found -> true
d.bark()
  Dog.prototype.bark   -> 'WOOF'
```

## 25 — groupBy

```js
function groupBy(arr, keyFn) {
  const groups = new Map();
  for (const item of arr) {
    const key = String(keyFn(item));
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return Object.fromEntries(groups);
}
```

**Why it works.** `keyFn` is a callback, so the caller decides what
"same group" means — that is what makes this a higher-order function. The
`Map` accumulator gives insertion-ordered groups and, as in exercise 04,
tolerates dangerous key names: a `keyFn` that returns `'constructor'`
produces the plain group `{ constructor: [...] }` instead of colliding
with an inherited property. `String(...)` normalises keys the way object
properties would be normalised anyway, so `1` and `'1'` land in the same
bucket. The `has`/`set` pair is the lazy-initialisation idiom: create the
array only when a group is first needed.

**Worked trace** — `groupBy([1, 2, 3, 4], n => n % 2 ? 'odd' : 'even')`,
`// expected: { odd: [ 1, 3 ], even: [ 2, 4 ] }`.

```text
1  key 'odd'   not present -> set []   push 1   Map { odd: [1] }
2  key 'even'  not present -> set []   push 2   Map { odd: [1], even: [2] }
3  key 'odd'   present               push 3   Map { odd: [1,3], even: [2] }
4  key 'even'  present               push 4   Map { odd: [1,3], even: [2,4] }
Object.fromEntries -> { odd: [1, 3], even: [2, 4] }
```

Group order follows first appearance, so `odd` comes first.

## 26 — Pipeline & once

```js
function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
```

**Why it works.** `pipe` is `reduce` over an array of functions with the
input value as the seed: each step feeds its output into the next, so
`pipe(f, g, h)(x)` is `h(g(f(x)))`. Using the seed rather than
`fns[0](x)` is what makes `pipe()` return the identity function — the
reduction over an empty array simply returns the seed. `once` keeps two
pieces of closure state, a boolean flag and the cached result, and
crucially uses a separate `called` flag rather than testing
`result === undefined`, so a function that legitimately returns
`undefined` is still only run once.

**Worked trace** — `pipe(double, addFive, toString)(10)`,
`// expected: result: 25`, and the `once` counter.

```text
pipe: acc starts at 10
  double(10)      -> 20
  addFive(20)     -> 25
  toString(25)    -> 'result: 25'
pipe()(7): reduce over [] with seed 7 -> 7

once:
  call 1   called=false -> set true, result = fn() (calls -> 1)
                        -> 'expensive result'
  call 2   called=true  -> skip fn, return cached 'expensive result'
  call 3   same
  calls === 1
```

## 27 — Memoize

```js
function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
}
```

**Why it works.** Memoisation trades memory for time: remember what
`fn(arg)` returned and never compute it twice for the same argument. The
`Map` is essential rather than convenient here, because Map keys can be
*any* value compared by identity — two distinct objects with the same
shape are two different keys, and a plain object cache would stringify
both to `'[object Object]'` and wrongly share a result. The
`has`-then-`get` pattern (rather than `cache.get(arg) ?? fn(arg)`) is
what makes a cached `undefined` count as a hit instead of recomputing
forever.

**Worked trace** — the exercise file's `fastSquare` and `fn2` calls.

```text
fastSquare(4)   has(4)? no  -> slowSquare(4) = 16, cache {4:16}   16
fastSquare(4)   has(4)? yes -> 16 (slowCalls unchanged)           16
fastSquare(5)   has(5)? no  -> slowSquare(5) = 25, cache {4,5}    25
fastSquare(4)   hit                                               16
slowCalls = 2

key1 = {id:1}, key2 = {id:1}   (different objects)
fn2(key1)  miss -> stores object A     fn2(key1) again -> A
fn2(key1) === fn2(key1)  -> true
fn2(key2)  miss (different key) -> object B
fn2(key1) === fn2(key2)  -> false
```

## 28 — Tree sum

```js
function treeSum(node) {
  if (!node) return 0;
  return (
    node.value + node.children.reduce((sum, child) => sum + treeSum(child), 0)
  );
}
```

**Why it works.** A tree is defined recursively — a node holds a value
and a list of subtrees — so the natural algorithm mirrors that shape:
the total is this node's value plus the totals of its children. The base
case `if (!node) return 0` is what stops the recursion, and returning `0`
rather than throwing makes `treeSum(null)` correct for free. A leaf needs
no special case either: its `children` array is empty, so the `reduce`
returns its seed `0`.

**Worked trace** — the exercise file's `tree`, `// expected: 21`.

```text
treeSum(1)
  children:
    treeSum(2)
      treeSum(4) -> 4 + 0 = 4
      treeSum(5) -> 5 + 0 = 5
      -> 2 + (4 + 5) = 11
    treeSum(3)
      treeSum(6) -> 6 + 0 = 6
      -> 3 + 6 = 9
  -> 1 + (11 + 9) = 21
```

`treeSum(null)` hits the guard and returns `0`.

## 29 — CSV parser

```js
function parseCSV(text) {
  const lines = text.trim().split("\n").filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => (row[h] = cells[i]));
    return row;
  });
}
```

**Why it works.** Parsing happens in two dimensions: split the text into
lines, then split each line into cells. Trimming at three levels — the
whole text, each line, each cell — is what absorbs the ragged whitespace
in the sample (`name, age , city`). The `lines.length < 2` guard covers
both degenerate inputs the tests use: empty text and a header with no
data rows, both of which must return `[]`. Zipping `headers` with `cells`
by index is what turns positional data into named fields; every value
stays a string, which is why the expected output has `age: '36'` and not
`36`.

**Worked trace** — `parseCSV(csv)` from the exercise file.

```text
trim + split('\n') + drop blanks
  ['name, age , city', 'Ada, 36 , London', 'Linus,25, Helsinki']
headers = ['name', 'age', 'city']
row 1: cells ['Ada', '36', 'London']
       { name: 'Ada', age: '36', city: 'London' }
row 2: cells ['Linus', '25', 'Helsinki']
       { name: 'Linus', age: '25', city: 'Helsinki' }
```

`parseCSV('')` trims to `''`, splits to `['']`, the filter drops it, and
`lines.length` is `0 < 2`, so the result is `[]`.

## 30 — Random picker

```js
function picker(items) {
  let pool = [...items];
  const pick = () => {
    if (pool.length === 0) pool = [...items];
    const idx = Math.floor(Math.random() * pool.length);
    return pool.splice(idx, 1)[0];
  };
  pick.reset = () => (pool = [...items]);
  return pick;
}
```

**Why it works.** "No repeats until everything has been used" is sampling
*without* replacement, so the pool must shrink: `splice(idx, 1)` removes
the chosen item and returns it inside a one-element array, hence the
`[0]`. The pool is a copy (`[...items]`), so the caller's array is never
drained. Refilling when the pool is empty is checked at the *start* of
`pick`, which gives automatic recycling without the previous call having
to know it was the last one. Functions are objects, so `pick.reset` can
be attached to the returned function and share the same closed-over
`pool`.

**Worked trace** — `picker(['a', 'b', 'c'])`; one possible run, since the
order is random but the *set* is not.

```text
pool ['a','b','c']
p()   pool not empty, idx 1 -> splice out 'b'   pool ['a','c']   -> 'b'
p()   idx 1 -> 'c'                              pool ['a']       -> 'c'
p()   idx 0 -> 'a'                              pool []          -> 'a'
picks sorted -> ['a','b','c']        // expected
p()   pool empty -> refill ['a','b','c'], then pick as above
p.reset()  pool = ['a','b','c'] again
```

## 31 — Mini template engine

```js
function render(template, data) {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
    const value = path.split(".").reduce((obj, key) => obj?.[key], data);
    return value === undefined ? match : String(value);
  });
}
```

**Why it works.** `String.replace` with a function callback is the
substitution engine: the `g` flag makes it visit every placeholder, and
the capture group hands the callback the path text between the braces.
`\s*` on both sides tolerates `{{ name }}` as well as `{{name}}`. The
dotted path is resolved by reducing over the segments, and `?.`
(optional chaining) in the `.reduce()` handles the "unknown key" case in
one expression — it short-circuits to `undefined` instead of throwing
when an intermediate step is missing. Testing `value === undefined`
rather than falsiness is the trap: `{{a.b}}` with `b: 0` must render
`'0'`, so only a genuinely missing value falls back to returning `match`
and leaving the placeholder in the output.

**Worked trace** — the three calls in the exercise file plus the `0` case
from the test.

```text
render('Hello {{name}}!', data)
  match '{{name}}', path 'name'
  reduce: data['name'] -> 'Ada'   defined -> 'Ada'
  -> 'Hello Ada!'

render('City: {{user.address.city}}', data)
  path 'user.address.city'
  data.user -> {address:{city:'London'}} -> .address -> .city -> 'London'
  -> 'City: London'

render('{{a.b}}', { a: { b: 0 } })
  reduce -> 0    0 === undefined? no -> String(0) = '0'

render('Hi {{missing}}', data)
  reduce -> undefined -> return match '{{missing}}'
  -> 'Hi {{missing}}'
```

## 32 — Diff two arrays

```js
function diff(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  return {
    onlyInA: [...setA].filter((x) => !setB.has(x)).sort((x, y) => x - y),
    onlyInB: [...setB].filter((x) => !setA.has(x)).sort((x, y) => x - y),
    common: [...setA].filter((x) => setB.has(x)).sort((x, y) => x - y),
  };
}
```

**Why it works.** The efficiency requirement is the reason for the Sets:
`set.has(x)` is roughly constant time, so each of the three passes is
`O(n)` plus the `O(n log n)` sort — a nested `a.filter(x => !b.includes(x))`
would be `O(n²)`. Building the Sets also deduplicates, which is why
`diff([1, 1], [1])` reports `common: [1]` and nothing "only in A". Each
category is computed from a fresh spread of the Set, so the three sorts
never interfere with one another, and the numeric comparator is required
because the default sort is lexicographic.

**Worked trace** — `diff([1, 2, 3, 4], [3, 4, 5, 6])`,
`// expected: { onlyInA: [ 1, 2 ], onlyInB: [ 5, 6 ], common: [ 3, 4 ] }`.

```text
setA {1,2,3,4}   setB {3,4,5,6}
onlyInA: 1 in B? no keep | 2 no keep | 3 yes drop | 4 yes drop -> [1,2]
onlyInB: 3 in A? yes drop | 4 yes drop | 5 no keep | 6 no keep -> [5,6]
common:  1 no | 2 no | 3 yes | 4 yes                           -> [3,4]
each sorted ascending (already in order here)
```

`diff([], [1])` gives `{ onlyInA: [], onlyInB: [1], common: [] }`.

## 33 — Word ladder (BFS)

```js
function ladderLength(begin, end, wordList) {
  const dict = new Set(wordList);
  if (!dict.has(end)) return 0;

  const queue = [[begin, 1]];
  const seen = new Set([begin]);

  while (queue.length > 0) {
    const [word, level] = queue.shift();
    if (word === end) return level;

    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next =
          word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (dict.has(next) && !seen.has(next)) {
          seen.add(next);
          queue.push([next, level + 1]);
        }
      }
    }
  }
  return 0;
}
```

**Why it works.** This is a shortest-path problem on an implicit graph
whose nodes are words and whose edges join words differing by one letter.
BFS guarantees the shortest path because it explores every word at
distance `k` before any word at distance `k + 1`, so the first time `end`
comes off the queue its `level` is minimal. The `seen` set is what keeps
it from exploding combinatorially: without it, words would be re-queued
through every path that reaches them. Marking a word as seen at *enqueue*
time rather than dequeue time also prevents duplicates within one level.
Neighbours are generated rather than searched for — 25 substitutions per
position is cheaper than scanning the whole dictionary per word — and the
early `dict.has(end)` check returns `0` before any work when the target
is unreachable by construction.

**Worked trace** — `ladderLength('hit', 'cog', ['hot','dot','dog','lot','log','cog'])`,
`// expected: 5`.

```text
dict has 'cog' -> continue
queue [['hit',1]]  seen {hit}

dequeue hit/1   neighbours in dict: hot
                queue [['hot',2]]        seen {hit,hot}
dequeue hot/2   neighbours: dot, lot
                queue [['dot',3],['lot',3]]  seen {+dot,lot}
dequeue dot/3   neighbours: dog          (hot already seen)
                queue [['lot',3],['dog',4]]  seen {+dog}
dequeue lot/3   neighbours: log
                queue [['dog',4],['log',4]]  seen {+log}
dequeue dog/4   neighbours: cog
                queue [['log',4],['cog',5]]  seen {+cog}
dequeue log/4   neighbours: none unseen
dequeue cog/5   word === end -> return 5
```

Without `cog` in the list the first guard returns `0`;
`ladderLength('hit','hit',['hit'])` dequeues `hit` at level `1` and
returns `1` immediately.

## 34 — Two sum (single-pass Map lookup)

```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let j = 0; j < nums.length; j++) {
    if (seen.has(target - nums[j])) return [seen.get(target - nums[j]), j];
    seen.set(nums[j], j);
  }
}
```

**Why it works.** Instead of testing every pair, you turn the question
around: while standing on `nums[j]`, ask whether the *complement*
`target - nums[j]` has already been seen. A `Map` from value to index
answers that in constant time, so the whole scan is `O(n)` rather than
`O(n²)`. Checking before inserting is what stops an element pairing with
itself, and because the complement is always an earlier index, the
returned pair is naturally in ascending order. Duplicates are fine: for
`[3, 3]` the first `3` is recorded, and the second one finds it.

**Worked trace** — `twoSum([2, 7, 11, 15], 9)`, `// expected: [ 0, 1 ]`.

```text
j=0  nums[0]=2   complement 7   seen has 7? no    seen {2 -> 0}
j=1  nums[1]=7   complement 2   seen has 2? yes   return [0, 1]
```

`twoSum([3, 2, 4], 6)`: `j=0` stores `3->0`; `j=1` looks for `4`, not
found, stores `2->1`; `j=2` looks for `2`, found at index `1`, returns
`[1, 2]` — note it is *not* `[0, 0]`, because `3` was never allowed to
pair with itself.

## 35 — Move zeroes (two pointers, in place)

```js
function moveZeroes(nums) {
  let write = 0;
  for (const n of nums) if (n !== 0) nums[write++] = n;
  while (write < nums.length) nums[write++] = 0;
}
```

**Why it works.** Two indices move at different speeds over the same
array: the implicit read pointer of the `for…of` loop visits every slot,
while `write` only advances when a non-zero value is stored. Because
`write` can never overtake the read position, copying forward never
destroys a value that has not been read yet. After the first pass the
first `write` slots hold the non-zero values in their original order, and
the tail — whatever is left over — is overwritten with zeroes. Nothing is
allocated, so the requirement to modify in place is satisfied and the
function returns `undefined` by design.

**Worked trace** — the exercise file's `a = [0, 1, 0, 3, 12]`,
`// expected: [ 1, 3, 12, 0, 0 ]`.

```text
write  read value  action              array
0      0           zero, skip          [0,1,0,3,12]
0      1           nums[0]=1, write 1  [1,1,0,3,12]
1      0           zero, skip          [1,1,0,3,12]
1      3           nums[1]=3, write 2  [1,3,0,3,12]
2      12          nums[2]=12, write 3 [1,3,12,3,12]
fill phase
3                  nums[3]=0, write 4  [1,3,12,0,12]
4                  nums[4]=0, write 5  [1,3,12,0,0]
```

`b = [0, 0, 0]` never stores anything in the first pass, so `write`
stays `0` and the fill phase rewrites all three zeroes.

## 36 — Maximum subarray (Kadane's algorithm)

```js
function maxSubArray(nums) {
  let current = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}
```

**Why it works.** `current` is the best sum of a slice that *ends at* the
current index. At each step there are only two candidates: extend the
previous slice (`current + nums[i]`) or start fresh at this element
(`nums[i]`), and `Math.max` picks the better one — that is the whole
algorithm, and it makes one pass with two numbers instead of a table.
`best` is tracked separately because the optimal slice may have ended
earlier. Seeding both from `nums[0]` rather than from `0` is what makes
the all-negative case work: with a seed of `0` the answer for
`[-3, -1, -2]` would wrongly be `0` instead of `-1`.

**Worked trace** — `maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])`,
`// expected: 6`.

```text
i  nums[i]  current + nums[i]  current = max  best
-  -2       -                  -2             -2
1   1       -1                  1 (restart)    1
2  -3       -2                 -2             1
3   4        2                  4 (restart)    4
4  -1        3                  3              4
5   2        5                  5              5
6   1        6                  6              6
7  -5        1                  1              6
8   4        5                  5              6
return 6        (the slice [4, -1, 2, 1])
```

`[5, 4, -1, 7, 8]` never restarts, so `best` climbs to `23`.

## 37 — Roman numerals → integers (value tables + lookahead)

```js
function romanToInt(s) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) total += values[s[i]] < values[s[i + 1]] ? -values[s[i]] : values[s[i]];
  return total;
}
```

**Why it works.** Subtractive pairs such as `IV` and `CM` are the only
irregularity, and they are fully characterised by one rule: a symbol
worth less than the symbol immediately after it is subtracted rather than
added. So a single left-to-right pass with a one-character lookahead is
enough — no pair table needed. The lookup `values[s[i + 1]]` past the end
of the string is `undefined`, and any `number < undefined` comparison is
`false`, so the last character is always added; that quiet behaviour is
what saves a boundary check.

**Worked trace** — `romanToInt('MCMXCIV')`, `// expected: 1994`.

```text
i  s[i]  value  next  next value  rule          total
0  M     1000   C     100         add  +1000    1000
1  C      100   M    1000         sub   -100     900
2  M     1000   X      10         add  +1000    1900
3  X       10   C     100         sub    -10    1890
4  C      100   I       1         add   +100    1990
5  I        1   V       5         sub     -1    1989
6  V        5   -     undefined   add     +5    1994
```

`'LVIII'` has no descent, so it is `50 + 5 + 1 + 1 + 1 = 58`.

## 38 — Integers → Roman numerals (greedy)

```js
const romanPairs = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];

function intToRoman(num) {
  let out = "";
  for (const [value, symbol] of romanPairs) {
    while (num >= value) { out += symbol; num -= value; }
  }
  return out;
}
```

**Why it works.** Putting the subtractive forms (`900 -> "CM"`,
`40 -> "XL"`, …) into the table as if they were ordinary symbols is the
trick that makes a plain greedy loop correct: with the table sorted
descending, repeatedly peeling off the largest value that still fits can
never paint you into a corner. The `while` inside the `for` handles
repeats such as `MMM`, and the descending order guarantees the classical
"no more than three identical symbols in a row" rule falls out
automatically, because a fourth repeat would always have been absorbed by
the next larger entry.

**Worked trace** — `intToRoman(1994)`, `// expected: MCMXCIV`.

```text
num    entry tried   emitted   out
1994   1000 M        yes       'M'        num 994
 994   1000 M        no
 994    900 CM       yes       'CM'       num  94
  94    500 D..100 C no
  94     90 XC       yes       'XC'       num   4
   4     50 L..5 V   no
   4      4 IV       yes       'IV'       num   0
   0     1 I         no
return 'MCMXCIV'
```

`intToRoman(3999)` takes `M` three times, then `CM`, `XC`, `IX`:
`MMMCMXCIX`.

## 39 — String compression (run-length encoding)

```js
function compress(s) {
  let out = '';
  for (let i = 0; i < s.length;) {
    let j = i + 1;
    while (s[j] === s[i] && j < s.length) j++;
    out += s[i] + (j - i);
    i = j;
  }
  return out.length <= s.length ? out : s;
}
```

**Why it works.** The outer loop advances by whole *runs* rather than by
one character — note it has no increment clause; `i = j` jumps straight
past the run the inner `while` just measured. `j - i` is therefore the
run length, and `s[i] + (j - i)` relies on JavaScript coercing the number
to a string during concatenation. The final comparison is the policy the
prompt states: return the compressed form only when it is no longer than
the input, so `'aaabbc'` (6 chars in, 6 chars out) keeps the compressed
version while `'aab'` (3 in, 4 out) returns the original.

**Worked trace** — `compress('aaabbc')`, `// expected: a3b2c1`.

```text
i=0  s[0]='a'  j runs 1,2,3 until s[3]='b'   run length 3   out 'a3'
i=3  s[3]='b'  j runs 4,5 until s[5]='c'     run length 2   out 'a3b2'
i=5  s[5]='c'  j = 6 = length                run length 1   out 'a3b2c1'
i=6  loop ends
out.length 6 <= s.length 6  -> return 'a3b2c1'
```

`compress('aab')` builds `'a2b1'`, whose length `4 > 3`, so the original
`'aab'` is returned. `compress('')` never enters the loop and returns
`''`.

## 40 — Longest substring without repeats (sliding window)

```js
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    if (last.has(s[right])) left = Math.max(left, last.get(s[right]) + 1);
    last.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

**Why it works.** The window `[left, right]` always holds a
repeat-free substring. When `right` lands on a character seen before, the
window's left edge must jump to just past that earlier occurrence — hence
`last.get(ch) + 1`. The `Math.max(left, …)` is the subtle part: a stale
entry from *before* the current window must not drag `left` backwards,
which is exactly what would break `'abba'`. Because `left` and `right`
each only move forward, the scan is `O(n)` and nothing is recomputed from
scratch. The `Map` stores the most recent index of each character, which
is all the window needs.

**Worked trace** — `lengthOfLongestSubstring('pwwkew')`,
`// expected: 3`.

```text
right  ch  last.has(ch)  left  last after      window    best
0      p   no             0    {p:0}           'p'        1
1      w   no             0    {p:0,w:1}       'pw'       2
2      w   yes (1) -> 2   2    {p:0,w:2}       'w'        2
3      k   no             2    {...,k:3}       'wk'       2
4      e   no             2    {...,e:4}       'wke'      3
5      w   yes (2) -> 3   3    {...,w:5}       'kew'      3
return 3
```

`'abcabcbb'` peaks at `'abc'` = `3`; `'bbbbb'` keeps resetting to a
window of one; `''` never enters the loop and returns `0`.

## 41 — Longest common prefix (strings & early exit)

```js
function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (const s of strs.slice(1)) {
    while (!s.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}
```

**Why it works.** The answer can never be longer than the first string,
so start with `strs[0]` as an optimistic candidate and shrink it by one
character at a time until every other string starts with it. `startsWith`
does the comparison without any index arithmetic, and the shrinking is
monotonic — the prefix only ever gets shorter — so each string is
examined a bounded number of times. When the strings share nothing, the
prefix shrinks all the way to `''`, and `'anything'.startsWith('')` is
`true`, which terminates the loop without a special case. The empty-array
guard is needed because `strs[0]` would otherwise be `undefined`.

**Worked trace** — `longestCommonPrefix(['flower', 'flow', 'flight'])`,
`// expected: fl`.

```text
prefix = 'flower'
s = 'flow'
  'flow'.startsWith('flower')  false -> prefix 'flowe'
  'flow'.startsWith('flowe')   false -> prefix 'flow'
  'flow'.startsWith('flow')    true
s = 'flight'
  startsWith('flow')  false -> 'flo'
  startsWith('flo')   false -> 'fl'
  startsWith('fl')    true
return 'fl'
```

`['dog','racecar','car']` shrinks `'dog'` to `''`. `['solo']` never
enters the loop and returns `'solo'`.

## 42 — Merge sorted arrays (two pointers)

```js
function mergeSorted(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  return out.concat(a.slice(i), b.slice(j));
}
```

**Why it works.** Both inputs are already sorted, so the smallest
remaining value is always at one of the two cursors — comparing just
those two and advancing the winner produces the merged order in `O(n+m)`
without calling `sort`. The loop stops as soon as *either* input is
exhausted, and the trailing `concat` appends whatever is left of the
other one; since that remainder is already sorted and all of it is larger
than everything emitted, no further comparison is needed. `<=` rather
than `<` keeps equal values in `a`-before-`b` order, which makes the
merge stable, and because `slice` and `concat` copy, neither input is
mutated — that is what lets the test merge a frozen array.

**Worked trace** — `mergeSorted([1, 3, 5], [2, 4, 6])`,
`// expected: [ 1, 2, 3, 4, 5, 6 ]`.

```text
i  j  a[i]  b[j]  push   out
0  0   1     2    1      [1]          i -> 1
1  0   3     2    2      [1,2]        j -> 1
1  1   3     4    3      [1,2,3]      i -> 2
2  1   5     4    4      [1,2,3,4]    j -> 2
2  2   5     6    5      [1,2,3,4,5]  i -> 3
i = 3 = a.length -> loop ends
concat(a.slice(3) = [], b.slice(2) = [6]) -> [1,2,3,4,5,6]
```

`mergeSorted([], [])` skips the loop and concatenates two empty slices.

## 43 — Count primes (Sieve of Eratosthenes)

```js
function countPrimes(n) {
  if (n <= 2) return 0;
  const prime = new Uint8Array(n).fill(1);
  prime[0] = prime[1] = 0;
  for (let p = 2; p * p < n; p++) {
    if (prime[p]) for (let k = p * p; k < n; k += p) prime[k] = 0;
  }
  return prime.reduce((sum, bit) => sum + bit, 0);
}
```

**Why it works.** Rather than testing each number for primality, the
sieve eliminates: assume everything is prime, then cross out every
multiple of each surviving number. Two optimisations make it fast enough
to look almost linear. Crossing out can start at `p * p`, because any
smaller multiple of `p` has a smaller prime factor and was already
crossed out. And the outer loop can stop once `p * p >= n`, because a
composite below `n` must have a factor no larger than its square root.
`Uint8Array` is a compact flag array whose elements are already `0`/`1`,
so counting the survivors is a plain sum.

**Worked trace** — `countPrimes(10)`, `// expected: 4`.

```text
flags index:  0 1 2 3 4 5 6 7 8 9
initial fill: 1 1 1 1 1 1 1 1 1 1
0 and 1 = 0:  0 0 1 1 1 1 1 1 1 1
p=2 (4<10)    cross 4, 6, 8
              0 0 1 1 0 1 0 1 0 1
p=3 (9<10)    cross 9
              0 0 1 1 0 1 0 1 0 0
p=4 (16<10 false) stop
sum = 1+1+1+1 = 4     (indices 2, 3, 5, 7)
```

`countPrimes(0)`, `countPrimes(1)` and `countPrimes(2)` all take the
`n <= 2` guard and return `0` — note "strictly less than n", so `2` is
not counted when `n` is `2`.

## 44 — Power set (bitmask or recursion)

```js
function subsets(nums) {
  let out = [[]];
  for (const n of nums) out = out.concat(out.map(a => [...a, n]));
  return out;
}
```

**Why it works.** Each element is either in a subset or not, so adding
one element doubles the answer: keep every subset you already have, plus
a copy of each with the new element appended. That doubling is exactly
why there are `2^n` subsets. `out.map(a => [...a, n])` builds the copies
as *new* arrays, so the originals are untouched — appending with `push`
here would corrupt the subsets you are iterating over. The seed `[[]]` —
a list containing the empty subset — is what makes `subsets([])` return
`[[]]` rather than `[]`, and it also keeps elements in input order within
each subset.

**Worked trace** — `subsets([1, 2, 3])`.

```text
start        [ [] ]
n = 1  copies [ [1] ]
       out    [ [], [1] ]
n = 2  copies [ [2], [1,2] ]
       out    [ [], [1], [2], [1,2] ]
n = 3  copies [ [3], [1,3], [2,3], [1,2,3] ]
       out    [ [], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3] ]
8 subsets   // expected: 2^3 = 8, any order
```

`subsets([]).length` is `1`.

## 45 — Permutations (backtracking)

```js
function permutations(arr) {
  if (!arr.length) return [[]];
  return arr.flatMap((value, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(rest => [value, ...rest]));
}
```

**Why it works.** Every permutation starts with *some* element, so the
recursion picks each element in turn as the head and permutes the
remaining elements. `[...arr.slice(0, i), ...arr.slice(i + 1)]` is the
array without position `i` — a new array, so there is nothing to "un-pick"
and no shared state to corrupt. `flatMap` is what keeps the result a flat
list of permutations rather than a list of lists per choice. The base
case returns `[[]]`, one empty permutation, which is what lets the
`map(rest => [value, ...rest])` step produce `[value]` at the bottom
level.

**Worked trace** — `permutations([1, 2, 3])`, `// expected: 6 arrays`.

```text
head 1  permutations([2,3])
          head 2 -> permutations([3]) -> [[3]] -> [2,3]
          head 3 -> permutations([2]) -> [[2]] -> [3,2]
        -> [1,2,3], [1,3,2]
head 2  permutations([1,3]) -> [1,3], [3,1]
        -> [2,1,3], [2,3,1]
head 3  permutations([1,2]) -> [1,2], [2,1]
        -> [3,1,2], [3,2,1]
flatMap -> 6 permutations
```

`permutations([]).length` is `1` (the empty ordering) and
`permutations(['a']).length` is `1`.

## 46 — Rotate array (reversal trick)

```js
function rotate(nums, k) {
  if (!nums.length) return;
  k %= nums.length;
  const reverse = (lo, hi) => {
    while (lo < hi) { [nums[lo], nums[hi]] = [nums[hi], nums[lo]]; lo++; hi--; }
  };
  reverse(0, nums.length - 1);
  reverse(0, k - 1);
  reverse(k, nums.length - 1);
}
```

**Why it works.** Rotating right by `k` moves the last `k` elements to
the front. Reversing the whole array puts those `k` elements at the
front, but backwards — and puts the rest after them, also backwards. So
reversing each of the two blocks in place restores their internal order,
and the rotation is done with `O(1)` extra space and three linear passes.
`k %= nums.length` collapses over-large rotations (a rotation by the
length is a no-op), and the empty guard is needed because `% 0` is `NaN`.
The destructuring swap `[nums[lo], nums[hi]] = [nums[hi], nums[lo]]`
exchanges two slots without a temporary variable.

**Worked trace** — the exercise file's `a = [1,2,3,4,5,6,7]` with `k = 3`,
`// expected: [ 5, 6, 7, 1, 2, 3, 4 ]`.

```text
k = 3 % 7 = 3
reverse(0, 6)   [7, 6, 5, 4, 3, 2, 1]
reverse(0, 2)   [5, 6, 7, 4, 3, 2, 1]     first k restored
reverse(3, 6)   [5, 6, 7, 1, 2, 3, 4]     remainder restored
```

`b = [1, 2]` with `k = 5`: `5 % 2 = 1`, so the whole array reverses to
`[2, 1]`, then `reverse(0, 0)` and `reverse(1, 1)` are both no-ops.

## 47 — Debounce (timers & closures)

```js
// Optional scheduler enables deterministic timer tests. Defaults are real timers.
function debounce(fn, waitMs, timers = { setTimeout, clearTimeout }) {
  let id;
  return function (...args) {
    timers.clearTimeout(id);
    id = timers.setTimeout(() => fn.apply(this, args), waitMs);
  };
}
```

**Why it works.** Debouncing means "run once the calls stop", so every
call cancels the pending timer and schedules a new one; only a call that
is never cancelled gets to fire, `waitMs` after the last invocation. The
timer id lives in the closure, which is what lets one call reach the
previous call's timer. `clearTimeout(undefined)` is harmless, so the
first call needs no guard. The wrapper is a `function`, not an arrow, so
`this` is the call-site receiver, and `fn.apply(this, args)` replays both
the receiver and the final arguments — capturing `args` fresh on each
call is what makes the *last* arguments win. The injectable `timers`
object defaults to the real timers and exists so tests can drive a fake
clock.

**Worked trace** — the exercise file's sequence with `waitMs = 200`.

```text
t=0     debounced('a')    clearTimeout(undefined); schedule fire at 200
t=50    debounced('ab')   cancel the 200 timer;    schedule fire at 250
t=120   debounced('abc')  cancel the 250 timer;    schedule fire at 320
t=320   timer fires -> search('abc') -> log ['search: abc']
t=500   console.log(log)  // expected: [ 'search: abc' ]
```

`'a'` and `'ab'` never run: their timers were cleared before they could
fire.

## 48 — Throttle (timers & closures)

```js
function throttle(fn, intervalMs, now = Date.now) {
  let last = -Infinity;
  return function (...args) {
    const current = now();
    if (current - last >= intervalMs) {
      last = current;
      return fn.apply(this, args);
    }
  };
}
```

**Why it works.** Throttling means "at most once per interval", so unlike
debounce there is no timer at all — just a remembered timestamp. Each
call compares the clock against `last` and either runs and re-stamps, or
is dropped. Seeding `last` to `-Infinity` makes the very first call's
difference `Infinity`, so it always runs immediately as the prompt
requires, with no extra "first call" flag. Stamping with the *current*
time rather than the previous deadline means the window restarts from the
call that ran. The injectable `now` defaults to `Date.now` and lets tests
supply a deterministic clock.

**Worked trace** — the exercise file's sequence with `intervalMs = 200`.

```text
t      call         current - last          action        count
0      throttled()  0 - (-Infinity) = Inf   run, last=0   1
0      throttled()  0 - 0 = 0     < 200     dropped       1
100    throttled()  100 - 0 = 100 < 200     dropped       1
250    throttled()  250 - 0 = 250 >= 200    run, last=250 2
300    throttled()  300 - 250 = 50 < 200    dropped       2
500    console.log(count)   // expected: 2
```

## 49 — Fibonacci three ways (recursion → memo → loop)

```js
function fibonacciSuite() {
  let naiveCalls = 0, memoCalls = 0;
  const cache = new Map([[0, 0], [1, 1]]);
  function fibNaive(n) { naiveCalls++; return n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2); }
  function fibMemo(n) {
    memoCalls++;
    if (!cache.has(n)) cache.set(n, fibMemo(n - 1) + fibMemo(n - 2));
    return cache.get(n);
  }
  function fibIter(n) {
    let a = 0, b = 1;
    for (let i = 0; i < n; i++) [a, b] = [b, a + b];
    return a;
  }
  return { fibNaive, fibMemo, fibIter, counts: () => ({ naiveCalls, memoCalls }) };
}
```

**Why it works.** The three versions compute the same numbers with wildly
different work. `fibNaive` recomputes whole subtrees — its call count
grows exponentially. `fibMemo` is the same recursion plus a `Map` that
remembers every result, so each value is computed once; the cache is
pre-seeded with the two base cases, which doubles as the recursion's
stopping condition (`cache.has(0)` and `cache.has(1)` are true, so no
deeper call is made). `fibIter` drops recursion entirely and keeps only
the two values it needs, using a destructuring swap to advance the pair.
Wrapping all three in a factory is what gives the counters a private home
while `counts()` exposes a snapshot.

**Worked trace** — `fibIter(10)` step by step, plus the call counts the
exercise file asks you to print.

```text
i:   start  0   1   2   3   4   5   6   7   8   9
a:     0    1   1   2   3   5   8  13  21  34  55
b:     1    1   2   3   5   8  13  21  34  55  89
return a = 55

counts after fibNaive(30) and fibMemo(30):
  naive calls: 2692537      memo calls: 59
  59 = 1 top-level call + 2 child calls for each n in 2..30
```

Both `fibNaive(30)` and `fibMemo(30)` return `832040`.

## 50 — Deep clone (recursion, cycles, special types)

```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) {
    const date = new Date(value.getTime());
    seen.set(value, date);
    return date;
  }
  const clone = Array.isArray(value) ? new Array(value.length) : {};
  seen.set(value, clone);
  for (const key of Object.keys(value)) {
    Object.defineProperty(clone, key, { value: deepClone(value[key], seen), enumerable: true, writable: true, configurable: true });
  }
  return clone;
}
```

**Why it works.** The guards run in a deliberate order. Primitives and
`null` are returned as they are — `null` must be checked explicitly
because `typeof null` is `'object'`. The `seen` map is consulted next, so
a value encountered twice yields the *same* clone both times; that single
rule handles cycles and preserves shared references (two properties
pointing at one `Date` still point at one clone). `Date` needs its own
branch because copying its enumerable keys would produce an empty object,
not a working date. For containers, the clone is registered in `seen`
*before* the children are cloned — that ordering is what stops a
self-referencing object from recursing forever. `WeakMap` is used rather
than `Map` so the bookkeeping does not keep the originals alive, and
`Object.defineProperty` writes each key as a plain own data property,
which keeps a key such as `__proto__` a normal property instead of a
prototype assignment.

**Worked trace** — the exercise file's `original` and `cyc`.

```text
deepClone({ a: 1, b: { c: [1, 2, { d: Date }] } })
  object      -> clone {}   seen { original -> {} }
  key 'a'     -> 1 primitive
  key 'b'     -> object, clone {}   seen { ..., b -> {} }
    key 'c'   -> array, clone new Array(3)
      [0] 1, [1] 2 primitives
      [2] object -> clone {}
        key 'd' -> Date -> new Date(same ms)
copy !== original                       // expected: true
copy.b.c[2].d !== original.b.c[2].d     // expected: true
copy.b.c[2].d.getFullYear() === 2026    // expected: 2026

deepClone(cyc) where cyc.self = cyc
  clone {} registered in seen first
  key 'name' -> 'loop'
  key 'self' -> seen.has(cyc) -> returns the clone itself
  cycCopy !== cyc && cycCopy.self === cycCopy   // expected: true
```

`deepClone(42)` returns `42` from the first guard.

## 51 — Product of array except self (prefix/suffix products)

```js
function productExceptSelf(nums) {
  const out = new Array(nums.length);
  let prefix = 1, suffix = 1;
  for (let i = 0; i < nums.length; i++) { out[i] = prefix; prefix *= nums[i]; }
  for (let i = nums.length - 1; i >= 0; i--) { out[i] *= suffix; suffix *= nums[i]; }
  return out;
}
```

**Why it works.** The product of everything except position `i` is the
product of everything to its left times the product of everything to its
right. The first pass writes the running left-product into `out[i]`
*before* multiplying `nums[i]` in, so `out[i]` never includes itself; the
second pass does the mirror image from the right. Banning division is the
point of the exercise: dividing the total product by `nums[i]` breaks as
soon as any element is `0`, whereas this version handles zeroes with no
special case — `[0, 2, 3]` correctly yields `[6, 0, 0]`. Two passes and
one output array mean `O(n)` time and no extra structures.

**Worked trace** — `productExceptSelf([1, 2, 3, 4])`,
`// expected: [ 24, 12, 8, 6 ]`.

```text
prefix pass
  i=0  out[0] = 1        prefix 1*1 = 1
  i=1  out[1] = 1        prefix 1*2 = 2
  i=2  out[2] = 2        prefix 2*3 = 6
  i=3  out[3] = 6        prefix 6*4 = 24
  out = [1, 1, 2, 6]
suffix pass
  i=3  out[3] = 6*1  = 6     suffix 1*4 = 4
  i=2  out[2] = 2*4  = 8     suffix 4*3 = 12
  i=1  out[1] = 1*12 = 12    suffix 12*2 = 24
  i=0  out[0] = 1*24 = 24    suffix 24*1 = 24
  out = [24, 12, 8, 6]
```

`productExceptSelf([2, 5])` gives `[5, 2]`.

## 52 — Unique paths (dynamic programming grid)

```js
function uniquePaths(m, n) {
  const row = Array(n).fill(1);
  for (let r = 1; r < m; r++) for (let c = 1; c < n; c++) row[c] += row[c - 1];
  return row[n - 1];
}
```

**Why it works.** The number of ways to reach a cell is the ways to reach
the cell above plus the ways to reach the cell to its left, and the top
row and left column each have exactly one path. The full DP table would
be `m × n`, but each row only needs the row above it, so a single rolling
array suffices: when the inner loop reads `row[c]` it still holds the
value from the previous row (the cell above), and `row[c - 1]` has
already been updated to this row (the cell to the left). That is why the
one-line update `row[c] += row[c - 1]` is correct, and why the memory is
`O(n)` instead of `O(m·n)`.

**Worked trace** — `uniquePaths(3, 7)`, `// expected: 28`.

```text
row 0 (initial fill)   [1, 1, 1, 1,  1,  1,  1]
r = 1                  [1, 2, 3, 4,  5,  6,  7]
r = 2                  [1, 3, 6, 10, 15, 21, 28]
return row[6] = 28
```

`uniquePaths(3, 2)`: `[1,1] -> [1,2] -> [1,3]`, returns `3`.
`uniquePaths(1, 1)` skips both loops and returns `row[0] = 1`.

## 53 — Climbing stairs (DP, fibonacci in disguise)

```js
function climbStairs(n) {
  let previous = 1, current = 1;
  for (let i = 2; i <= n; i++) [previous, current] = [current, previous + current];
  return current;
}
```

**Why it works.** The last move onto step `n` is either a 1-step from
`n-1` or a 2-step from `n-2`, and those two sets of routes are disjoint,
so `ways(n) = ways(n-1) + ways(n-2)` — the Fibonacci recurrence in a
trench coat. Because each answer depends only on the two before it, the
whole DP table collapses to two variables, giving `O(n)` time and `O(1)`
space. Both seeds are `1`: there is one way to stand still (`n = 0`) and
one way to climb a single step. The destructuring assignment updates both
variables from their old values simultaneously, avoiding the classic bug
of overwriting `previous` before it is used.

**Worked trace** — `climbStairs(10)`, `// expected: 89`.

```text
i:         start  2  3  4  5  6   7   8   9  10
previous:    1    1  2  3  5  8  13  21  34  55
current:     1    2  3  5  8 13  21  34  55  89
return current = 89
```

`climbStairs(2)` runs one iteration and returns `2` (`1+1`, `2`);
`climbStairs(3)` returns `3` (`1+1+1`, `1+2`, `2+1`).

## 54 — Coin change (dynamic programming)

```js
function coinChange(coins, amount) {
  const best = Array(amount + 1).fill(Infinity);
  best[0] = 0;
  for (let a = 1; a <= amount; a++) for (const coin of coins) {
    if (coin <= a) best[a] = Math.min(best[a], best[a - coin] + 1);
  }
  return best[amount] === Infinity ? -1 : best[amount];
}
```

**Why it works.** `best[a]` is the fewest coins that make exactly `a`.
Any solution for `a` ends with some coin, so trying every coin and taking
`best[a - coin] + 1` considers every possibility. Filling the table in
increasing order of `a` guarantees `best[a - coin]` is final before it is
read. `Infinity` is the "impossible" marker, and it propagates correctly
because `Infinity + 1` is still `Infinity`, so an unreachable amount
never masquerades as a cheap one. Greedy "take the biggest coin first"
would be wrong here — that is the trap — which is why every coin is tried
at every amount.

**Worked trace** — `coinChange([1, 2, 5], 11)`, `// expected: 3`.

```text
a:       0  1  2  3  4  5  6  7  8  9  10  11
best[a]: 0  1  1  2  2  1  2  2  3  3   2   3

e.g. a=6: 1 + best[5] = 2, 1 + best[4] = 3, 1 + best[1] = 2  -> 2
    a=11: 1 + best[10] = 3, 1 + best[9] = 4, 1 + best[6] = 3 -> 3
return 3      (5 + 5 + 1)
```

`coinChange([2], 3)` leaves `best[3] = Infinity`, so it returns `-1`;
`coinChange([1], 0)` returns `best[0] = 0` without entering the loop.

## 55 — Mini JSON database (class, files, JSON)

```js
// The legacy starter leaves several policies open. This reference loads
// lazily, uses the disk object as-is when present, and propagates bad JSON.
// get returns the stored value; set is the auto-saving mutation API.
class TinyDB {
  #data;
  constructor(file, defaults = {}) { this.file = file; this.defaults = defaults; }
  #load() {
    if (this.#data !== undefined) return;
    try { this.#data = JSON.parse(fs.readFileSync(this.file, "utf8")); }
    catch (error) {
      if (error.code !== "ENOENT") throw error;
      this.#data = JSON.parse(JSON.stringify(this.defaults));
    }
  }
  get(key) { this.#load(); return Object.hasOwn(this.#data, key) ? this.#data[key] : undefined; }
  set(key, value) {
    this.#load();
    Object.defineProperty(this.#data, key, { value, enumerable: true, writable: true, configurable: true });
    this.save();
  }
  save() { this.#load(); fs.writeFileSync(this.file, JSON.stringify(this.#data, null, 2)); }
}
```

**Why it works.** The constructor does no I/O; `#load` is called at the
top of every public method and returns immediately if `#data` is already
populated, which is the lazy-loading pattern the prompt asks for. The
`catch` distinguishes two very different failures: `ENOENT` (no file yet)
falls back to the defaults, while a syntax error in an existing file is
re-thrown rather than silently discarded. Defaults are deep-copied via
`JSON.parse(JSON.stringify(...))`, so two databases built from the same
defaults object cannot share nested state. `Object.hasOwn` in `get` is
what makes a missing key return `undefined` instead of reaching an
inherited property, and `Object.defineProperty` in `set` stores even a
key named `__proto__` as an ordinary own property. `set` calls `save`, so
every mutation reaches disk.

**Worked trace** — the self-test in `55-sqlite-free-json-db.js`, which
deletes `db.json` first.

```text
new TinyDB(file, { visits: 0, users: [] })   no I/O yet, #data undefined
db.get('visits')
  #load: readFileSync -> ENOENT -> #data = deep copy of defaults
  hasOwn 'visits' -> 0                        // expected: 0
db.set('visits', 1)      #data.visits = 1, writes db.json
db.set('users', [...])   #data.users  = [...], writes db.json
db.get('users')[0].name                       // expected: Ada

new TinyDB(file, { visits: 0, users: [] })   a second instance
db2.get('visits')
  #load: readFileSync succeeds -> #data = { visits: 1, users: [...] }
  -> 1                                        // expected: 1
```

## 56 — Bank account with private fields (classes, getters, errors)

```js
class BankAccount {
  #balance = 0;
  #history = [];
  constructor(name) { this.name = name; }
  get balance() { return this.#balance; }
  get history() { return this.#history.map((entry) => ({ ...entry })); }
  #validate(amount) {
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) throw new Error("Amount must be positive");
  }
  deposit(amount) {
    this.#validate(amount);
    this.#balance += amount;
    this.#history.push({ type: "deposit", amount, balance: this.#balance });
  }
  withdraw(amount) {
    this.#validate(amount);
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.#history.push({ type: "withdraw", amount, balance: this.#balance });
  }
  static fromSnapshot({ balance, history }) {
    const account = new BankAccount();
    account.#balance = balance;
    account.#history = history.map((entry) => ({ ...entry }));
    return account;
  }
}
```

**Why it works.** `#balance` is a real private field, not a convention:
code outside the class body cannot read or write it, so the only way in
is through `deposit` and `withdraw`, which is what makes the invariant
"balance never goes negative" enforceable. The getter exposes the value
read-only — `account.balance = 999` cannot reach `#balance`. The
`history` getter returns copies of the entries, so a caller cannot edit
the ledger it is handed. Validation is factored into a private method so
both mutators reject the same inputs with the same message, and the two
error messages are distinct because they describe different problems: bad
input versus insufficient funds. `fromSnapshot` is `static` and can touch
`#balance` on another instance because private-field access is scoped to
the class body, not the object.

**Worked trace** — the exercise file's sequence.

```text
new BankAccount('Ada')   #balance 0, #history []
deposit(100)   validate ok   #balance 100
               history + { type:'deposit',  amount:100, balance:100 }
withdraw(30)   validate ok   30 > 100? no   #balance 70
               history + { type:'withdraw', amount: 30, balance: 70 }
acct.balance          -> 70                 // expected: 70
acct.history.length   -> 2                  // expected: 2
acct.history[0]  { type: 'deposit', amount: 100, balance: 100 }
withdraw(1000) 1000 > 70 -> throw Error('Insufficient funds')
                                 // expected: caught: Insufficient funds
deposit(-5)    -5 <= 0   -> throw Error('Amount must be positive')
                                 // expected: caught: Amount must be positive
fromSnapshot({ balance: 70, history: acct.history }).balance -> 70
```

## 57 — Linked list (pointers via object references)

```js
class LinkedList {
  head = null;
  push(value) {
    const node = { value, next: null };
    if (!this.head) { this.head = node; return; }
    let tail = this.head;
    while (tail.next) tail = tail.next;
    tail.next = node;
  }
  find(value) {
    for (let node = this.head; node; node = node.next) if (node.value === value) return node;
    return null;
  }
  delete(value) {
    let previous = null, node = this.head;
    while (node) {
      if (node.value === value) {
        if (previous) previous.next = node.next; else this.head = node.next;
        return true;
      }
      previous = node; node = node.next;
    }
    return false;
  }
  toArray() {
    const out = [];
    for (let node = this.head; node; node = node.next) out.push(node.value);
    return out;
  }
}
```

**Why it works.** A linked list is objects holding references to other
objects: `{ value, next }`, with `null` marking the end. Traversal is
always the same loop — start at `head`, follow `next` until the reference
is `null` — which is why `find`, `delete` and `toArray` share a shape.
`delete` carries a `previous` pointer because a singly linked node cannot
see backwards, and the `if (previous) … else this.head = …` branch is the
head special case: removing the first node means moving `head`, not
patching a predecessor. Returning `true`/`false` rather than throwing
lets the caller decide what a missing value means. `push` walks to the
tail each time, which is `O(n)`; a stored tail pointer would make it
`O(1)` but the exercise does not require it.

**Worked trace** — the exercise file's sequence.

```text
push(1)  head = {1, next:null}
push(2)  walk to {1} -> next = {2}       1 -> 2
push(3)  walk to {2} -> next = {3}       1 -> 2 -> 3
toArray()                                 // expected: [ 1, 2, 3 ]
find(2)  node {1} no -> node {2} match
         -> { value: 2, next: { value: 3, next: null } }
find(99) walks off the end -> null
delete(2)
  previous null, node {1}  no match  -> previous {1}, node {2}
  match: previous.next = node.next = {3}   1 -> 3
  return true
toArray()                                 // expected: [ 1, 3 ]
delete(99)  loop ends -> false
delete(1)   previous is null -> this.head = node.next = {3}  -> true
toArray()                                 // expected: [ 3 ]
```

## 58 — Binary search tree (recursion + invariant)

```js
class BST {
  root = null;
  insert(value) {
    const node = { value, left: null, right: null };
    if (!this.root) { this.root = node; return; }
    let current = this.root;
    while (current.value !== value) {
      const side = value < current.value ? "left" : "right";
      if (!current[side]) { current[side] = node; return; }
      current = current[side];
    }
  }
  has(value) {
    let current = this.root;
    while (current) {
      if (current.value === value) return true;
      current = current[value < current.value ? "left" : "right"];
    }
    return false;
  }
  toArray() {
    const out = [];
    const walk = (node) => { if (node) { walk(node.left); out.push(node.value); walk(node.right); } };
    walk(this.root);
    return out;
  }
}
```

**Why it works.** The invariant is that everything in a node's left
subtree is smaller and everything in its right subtree is larger. `insert`
and `has` both exploit it the same way: compare, then descend one side,
which discards half the remaining tree at each step. Duplicates are
ignored by the loop condition `current.value !== value` — arriving at an
equal node ends the loop without linking the freshly built node, so it is
simply discarded. `toArray` is an in-order traversal (left, node, right),
and the invariant guarantees that visiting in that order emits the values
sorted, which is exactly what the exercise's final `every` check tests.

**Worked trace** — `[50, 30, 70, 20, 40, 60, 80, 30]` inserted in order.

```text
50 becomes the root
30 < 50 -> left of 50
70 > 50 -> right of 50
20 < 50, < 30 -> left of 30
40 < 50, > 30 -> right of 30
60 > 50, < 70 -> left of 70
80 > 50, > 70 -> right of 70
30 -> walks to the node 30, current.value === value -> loop ends, dropped

            50
          /    \
        30      70
       /  \    /  \
     20   40  60   80

toArray (left, node, right)
  20, 30, 40, 50, 60, 70, 80      // expected
has(40)  50 -> left 30 -> right 40   true
has(45)  50 -> 30 -> 40 -> right is null -> false
```

## 59 — Binary search (the O(log n) classic)

```js
function bsearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}
```

**Why it works.** `lo` and `hi` bound an inclusive range that must
contain the target if it is present anywhere. Each comparison halves that
range, giving `O(log n)`. Two details are where off-by-one bugs live: the
loop condition is `lo <= hi`, because a range of one element (`lo === hi`)
still needs checking; and the updates move *past* `mid` (`mid + 1` /
`mid - 1`), because `mid` has just been ruled out. Moving to `mid`
instead would loop forever on a two-element range. When the range becomes
empty the target is absent, so the function falls out of the loop and
returns `-1`, which also covers the empty array (`hi` starts at `-1`).

**Worked trace** — `bsearch([1, 3, 5, 7, 9, 11], 7)`, `// expected: 3`.

```text
lo hi  mid  arr[mid]  comparison        next
0  5    2      5      5 < 7   -> lo = 3
3  5    4      9      9 > 7   -> hi = 3
3  3    3      7      match   -> return 3
```

`bsearch([1,3,5,7,9,11], 6)`: the range narrows to `lo = 3`, `hi = 2`,
the condition fails, and it returns `-1`. `bsearch([], 5)` starts with
`lo = 0`, `hi = -1` and never enters the loop.

## 60 — Collect concurrent results (promise bookkeeping)

```js
function promiseAll(values) {
  return new Promise((resolve, reject) => {
    const results = new Array(values.length);
    let remaining = values.length;
    if (!remaining) { resolve(results); return; }
    values.forEach((value, index) => {
      Promise.resolve(value).then((result) => {
        results[index] = result;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}
```

**Why it works.** All the inputs are started immediately, and each one
writes into its *own* slot when it settles, so the output keeps input
order regardless of completion order. `Promise.resolve(value)` normalises
everything — plain values, promises and thenables — into a promise, so
one code path handles all three. The completion test is a counter, not
`results.length`: assigning `results[9]` would set `length` to 10 even
though earlier slots are still empty, which is the bug the exercise's
hint warns about. `reject` is passed directly as the rejection handler,
so the first rejection settles the outer promise and every later
settlement is ignored — a promise can only settle once. The empty-array
case must be handled up front, because with nothing to await the counter
would never reach zero.

**Worked trace** — `promiseAll([Promise.resolve(3), 7])`,
`// expected: [3, 7]`.

```text
results = [empty, empty]   remaining = 2
index 0  Promise.resolve(already-resolved 3)
index 1  Promise.resolve(7)      (plain value -> resolved promise)
microtask: index 0 settles -> results[0] = 3, remaining 1
microtask: index 1 settles -> results[1] = 7, remaining 0 -> resolve
-> [3, 7]
```

The thenable sample `[{ then: (resolve) => resolve('yes') }]` takes the
same path because `Promise.resolve` adopts any object with a `then`
method; `promiseAll([])` resolves to `[]` from the guard; and
`promiseAll([Promise.reject(new Error('offline'))])` rejects with that
error.

## 61 — A complete batch report (fulfilled vs rejected records)

```js
function allSettled(values) {
  return new Promise((resolve) => {
    const results = new Array(values.length);
    let remaining = values.length;
    if (!remaining) { resolve(results); return; }
    function finish(index, record) {
      results[index] = record;
      if (--remaining === 0) resolve(results);
    }
    values.forEach((value, index) => {
      Promise.resolve(value).then(
        (value) => finish(index, { status: "fulfilled", value }),
        (reason) => finish(index, { status: "rejected", reason }),
      );
    });
  });
}
```

**Why it works.** This is exercise 60 with one conceptual change: a
rejection is *data for the report*, not a reason to fail. So the outer
promise has no `reject` parameter at all, and both handlers funnel into
the same `finish` helper, which records a result and decrements the same
counter. Because both paths count as completed positions, the counter
still reaches zero exactly once. The record shapes are fixed by the
prompt — `{status:"fulfilled", value}` and `{status:"rejected", reason}`
— and the reason is stored by identity, so a rejection with the plain
string `"no"` is reported as `"no"`, not wrapped in an `Error`.

**Worked trace** — `allSettled([2, Promise.reject('no'), Promise.resolve(4)])`.

```text
results = 3 empty slots    remaining = 3
index 0  value 2        -> fulfilled  { status: 'fulfilled', value: 2 }
index 1  rejects 'no'   -> rejected   { status: 'rejected', reason: 'no' }
index 2  resolves 4     -> fulfilled  { status: 'fulfilled', value: 4 }
remaining 3 -> 2 -> 1 -> 0  -> resolve

[ { status: 'fulfilled', value: 2 },
  { status: 'rejected',  reason: 'no' },
  { status: 'fulfilled', value: 4 } ]
```

`allSettled([])` fulfils with `[]` from the guard.

## 62 — Limit concurrent jobs (async scheduling)

```js
async function mapLimit(items, limit, worker) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError("limit must be a positive integer");
  const results = new Array(items.length);
  let next = 0, stopped = false;
  async function run() {
    while (!stopped && next < items.length) {
      const index = next++;
      try { results[index] = await worker(items[index], index); }
      catch (error) { stopped = true; throw error; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}
```

**Why it works.** Instead of scheduling jobs, you start a fixed number of
*runners* and let them pull work from a shared cursor. `next++` hands out
each index exactly once — safe without locks because JavaScript runs one
turn at a time, and the increment is synchronous. A runner does not take
another index until its `await` has settled, so at most `limit` calls are
ever in flight. Ordering is preserved because each result is stored by
its own index. The `stopped` flag makes the first failure stop *new*
work; jobs already running are still awaited by `Promise.all`, which
rejects with the first error. `Math.min(limit, items.length)` avoids
spawning idle runners, and because `mapLimit` is `async`, the validation
`throw` becomes a rejected promise rather than a synchronous exception.

**Worked trace** — `mapLimit([3, 1, 2], 2, async (n, i) => n * 10 + i)`,
`// expected: [30, 11, 22]`.

```text
limit 2 -> two runners A and B; next = 0
A takes index 0 (next 1)   awaits worker(3, 0)
B takes index 1 (next 2)   awaits worker(1, 1)
A settles -> results[0] = 3*10+0 = 30
A takes index 2 (next 3)   awaits worker(2, 2)
B settles -> results[1] = 1*10+1 = 11;  next >= length -> B exits
A settles -> results[2] = 2*10+2 = 22;  A exits
Promise.all resolves -> [30, 11, 22]
```

`mapLimit([], 2, …)` makes zero runners and returns `[]`;
`mapLimit([1], 0, …)` rejects with `RangeError`.

## 63 — Sequential async reduction (data-dependent steps)

```js
async function asyncReduce(items, reducer, initial) {
  let acc = await initial;
  for (let i = 0; i < items.length; i++) acc = await reducer(acc, items[i], i);
  return acc;
}
```

**Why it works.** Each step needs the previous step's result, so unlike
`mapLimit` there is nothing to parallelise — running these concurrently
would be incorrect, not merely slower. A plain `for` loop with `await`
inside expresses that directly; an `async` callback passed to `forEach`
would not, because `forEach` ignores returned promises and would fire
every step at once. `await initial` handles the prompt's rule that the
seed may itself be a promise, and `await` on a non-promise simply yields
the value, so both cases share one line. A synchronous `throw` inside
`reducer` propagates as a rejection of the `async` function with the
exact reason preserved, and an empty `items` array skips the loop and
returns the awaited seed.

**Worked trace** — `asyncReduce([2, 3, 4], async (acc, n) => acc * n, Promise.resolve(1))`,
`// expected: 24`.

```text
acc = await Promise.resolve(1)   -> 1
i=0  reducer(1, 2, 0) -> 2   acc = 2
i=1  reducer(2, 3, 1) -> 6   acc = 6
i=2  reducer(6, 4, 2) -> 24  acc = 24
return 24
```

`asyncReduce([], () => 99, 7)` returns `7` — the reducer is never called.
`asyncReduce(['a','b'], (acc, s, i) => acc + i + s, '')` builds
`'' + 0 + 'a'` then `'0a' + 1 + 'b'` = `'0a1b'`, showing the index is
passed through.

## 64 — Bound a wait (timer lifecycle)

```js
function withTimeout(value, ms) {
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) return Promise.reject(new RangeError("Invalid delay"));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out")), ms);
    Promise.resolve(value).then(
      (result) => { clearTimeout(timer); resolve(result); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}
```

**Why it works.** Two things race for one promise: the timer and the
input. Whichever settles first wins, and the loser is ignored because a
promise settles once. Both input handlers are attached immediately and
both clear the timer, which is the lifecycle rule the exercise is about —
leaving a 30-second timer alive after an early success would keep the
Node process running. Attaching a rejection handler also means a late
failure is *handled* rather than becoming an unhandled rejection.
Validation returns `Promise.reject(...)` rather than throwing, so callers
only ever have to deal with a promise. At `ms = 0` the already-resolved
input still wins, because promise callbacks are microtasks and run before
any timer callback.

**Worked trace** — the exercise file's three checks.

```text
withTimeout(Promise.resolve('ready'), 0)
  ms valid  -> timer scheduled for 0ms (a macrotask)
  Promise.resolve(value).then(...) queued as a microtask
  microtask runs first: clearTimeout(timer), resolve('ready')
  -> 'ready'

withTimeout(new Promise(() => {}), 5)
  input never settles; at t=5ms the timer fires
  -> rejects with Error: Timed out

withTimeout(1, -1)
  -1 < 0 -> Promise.reject(new RangeError('Invalid delay'))
```

## 65 — A cancellable pause (AbortSignal cleanup)

```js
function abortableDelay(ms, signal) {
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) return Promise.reject(new RangeError("Invalid delay"));
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(signal.reason); return; }
    const cleanup = () => signal?.removeEventListener("abort", onAbort);
    const onAbort = () => { clearTimeout(timer); cleanup(); reject(signal.reason); };
    const timer = setTimeout(() => { cleanup(); resolve(); }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
```

**Why it works.** The order of the four steps is the lesson. Validate
`ms` first, so an invalid delay rejects the same way with or without a
signal. Check `signal.aborted` before allocating anything, so an
already-aborted signal costs no timer. Then set up the timer and the
listener, and give *both* settlement paths the same `cleanup` function:
the timer path removes the listener so a completed delay does not retain
it, and the abort path clears the timer so a cancelled delay does not
keep the event loop alive. `reject(signal.reason)` passes the reason by
identity, which is what the test `(error) => error === reason` checks.
`signal?.` makes the parameter genuinely optional, and the function never
calls `abort()` itself — cancellation belongs to the caller's controller.

**Worked trace** — the exercise file's cancellation check.

```text
abortableDelay(0)
  ms valid, no signal -> timer at 0ms -> cleanup (no-op) -> resolve()
  -> undefined

const waiting = abortableDelay(1000, controller.signal)
  signal.aborted? false
  timer scheduled for 1000ms; 'abort' listener registered (once)
controller.abort(reason)
  onAbort: clearTimeout(timer)     the 1000ms timer never fires
           removeEventListener
           reject(signal.reason)   same object as `reason`
  await assert.rejects(waiting, error => error === reason)  passes

abortableDelay(-1)  -> RangeError before any timer is created
```

## 66 — Parse a form-style query string

```js
function parseQuery(text) {
  const out = new Map();
  const dec = (s) => decodeURIComponent(s.replace(/\+/g, ' '));
  for (const part of text.replace(/^\?/, '').split('&')) {
    if (!part) continue;
    const i = part.indexOf('=');
    const k = dec(i < 0 ? part : part.slice(0, i));
    const v = dec(i < 0 ? '' : part.slice(i + 1));
    if (!out.has(k)) out.set(k, []);
    out.get(k).push(v);
  }
  return out;
}
```

**Why it works.** A query string is a flat list of segments, but a key
may repeat, so the natural shape is a `Map` from key to an array of
values — and a `Map` also means a key such as `constructor` or an empty
string is stored without any prototype interference. Splitting each
segment at its **first** `=` via `indexOf` is the central detail:
`split('=')` would cut `token=a=b` into three pieces and lose part of the
value. Decoding happens after the split, so an encoded `%3D` inside a
value can never be mistaken for a separator, and `+` is replaced with a
space before `decodeURIComponent` because that is the form-encoding rule
that `decodeURIComponent` alone does not apply. Malformed percent
escapes make `decodeURIComponent` throw `URIError`, which the prompt
wants propagated rather than swallowed.

**Worked trace** — `parseQuery('?tag=js&tag=node&q=hello+world&flag')`.

```text
strip leading '?' -> 'tag=js&tag=node&q=hello+world&flag'
split('&')        -> ['tag=js', 'tag=node', 'q=hello+world', 'flag']

'tag=js'         i=3   k 'tag'  v 'js'          Map { tag: ['js'] }
'tag=node'       i=3   k 'tag'  v 'node'        Map { tag: ['js','node'] }
'q=hello+world'  i=1   k 'q'    v 'hello world' (+ -> space)
'flag'           i=-1  k 'flag' v ''            Map { ..., flag: [''] }

[...map] = [['tag',['js','node']], ['q',['hello world']], ['flag',['']]]
```

`'x=a=b&&%61=1'`: the empty segment between the two `&` is skipped by
`if (!part) continue`, `x` keeps the whole value `'a=b'`, and `%61`
decodes to the key `a`. `parseQuery('bad=%ZZ')` throws `URIError`.

## 67 — Paginate without off-by-one errors

```js
function paginate(items, page, pageSize) {
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1) throw new RangeError('Invalid pagination');
  const totalPages = Math.ceil(items.length / pageSize);
  page = Math.min(page, Math.max(1, totalPages));
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    totalItems: items.length,
    totalPages,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };
}
```

**Why it works.** The order is validate, compute `totalPages`, clamp,
then slice — doing it in any other order is where off-by-one bugs come
from. `Math.ceil` gives the page count including a partial last page, and
`Math.max(1, totalPages)` is what keeps the clamp sensible for empty
input: `totalPages` is `0`, but the reported page must still be `1`.
Because pages are 1-based and `slice` is 0-based, the offset is
`(page - 1) * pageSize`; `slice` also clamps its end index, so the last
page needs no special case, and it returns a new array without cloning
the item objects, satisfying "do not change input". `hasNext` is computed
from the clamped page, so a request beyond the end reports `false`.

**Worked trace** — `paginate(['a','b','c','d','e'], 9, 2)`.

```text
validate: 9 and 2 are positive integers
totalPages = ceil(5 / 2) = 3
page = min(9, max(1, 3)) = 3            (clamped from 9)
slice((3-1)*2, 3*2) = slice(4, 6) = ['e']   (end clamped to length)
hasPrevious = 3 > 1 = true
hasNext     = 3 < 3 = false
-> { items: ['e'], page: 3, pageSize: 2, totalItems: 5,
     totalPages: 3, hasPrevious: true, hasNext: false }
```

`paginate([], 8, 2)`: `totalPages` is `0`, `page` becomes
`min(8, max(1, 0)) = 1`, `slice(0, 2)` is `[]`, and `hasNext` is
`1 < 0 = false`. `paginate([], 0, 2)` throws `RangeError` before any of
that.

## 68 — Stable sorting by several business rules

```js
function multiSort(rows, rules) {
  return rows
    .map((row, i) => ({ row, i }))
    .sort((a, b) => {
      for (const { key, direction } of rules) {
        const c = a.row[key] < b.row[key] ? -1 : a.row[key] > b.row[key] ? 1 : 0;
        if (c) return direction === 'desc' ? -c : c;
      }
      return a.i - b.i;
    })
    .map((x) => x.row);
}
```

**Why it works.** A multi-key sort is one comparator that consults the
rules in priority order and returns the first non-zero result; only when
a rule ties does it move on to the next. Direction is applied by negating
that rule's result, which keeps one comparison expression for both
directions. The decorate–sort–undecorate step (`{ row, i }`) makes the
final tie-break explicit: rows equal on every rule fall through to
`a.i - b.i`, restoring their original order. That is stability made
visible rather than relied upon. `map` produces a new array, so `rows`
itself is never reordered — `sort` mutates, but only the decorated copy —
and the row objects are shared, not cloned, which is what "new shallow
array" means. Comparison uses `<` and `>` so the same code handles the
all-numbers and all-strings cases in code-unit order, as the prompt
requires instead of `localeCompare`.

**Worked trace** — the exercise file's `rows` with rules
`team asc`, `score desc`; `// expected: ['c','d','b','a']`.

```text
decorated: {a,team b,score 9,i 0} {b,a,2,i 1} {c,a,5,i 2} {d,a,5,i 3}

team asc:   'a' rows (b, c, d) before the 'b' row (a)
within team 'a', score desc: 5, 5, then 2  ->  c, d, b
c vs d: team ties, score ties -> a.i - b.i = 2 - 3 < 0 -> c first
row 'a' (team 'b') last

sorted ids  ['c', 'd', 'b', 'a']
rows unchanged: ['a', 'b', 'c', 'd']
multiSort(rows, []) returns a different array object with the same rows
```

## 69 — Own-property path lookup with a real missing sentinel

```js
function getPath(root, path, fallback) {
  for (const key of path) {
    if (root === null || typeof root !== 'object' || !Object.hasOwn(root, key)) return fallback;
    root = root[key];
  }
  return root;
}
```

**Why it works.** The loop walks one key at a time, reassigning `root` to
the value it just read, so an empty path returns the original root with
no special case. Each step must pass three tests before it descends: the
current value is not `null`, it is an object (functions and primitives
cannot be traversed here), and the key is an **own** property.
`Object.hasOwn` is the whole point of the exercise — it is what separates
"absent" from "present but `undefined`", so a real stored `undefined` is
returned while a missing key yields the fallback. Truthiness checks or
`?.` with `??` both collapse that distinction and would wrongly convert
stored `undefined`, `null`, `0` or `false` into the fallback. `hasOwn`
also refuses inherited names such as `toString`.

**Worked trace** — the exercise file's `data` object.

```text
data = { users: [ { name: 'Ada', middle: undefined } ], count: 0 }

getPath(data, ['users', 0, 'name'], 'missing')
  'users'  object, own -> root = [ {...} ]
  0        object (arrays are objects), own index 0 -> root = { name, middle }
  'name'   own -> root = 'Ada'
  -> 'Ada'

getPath(data, ['users', 0, 'middle'], 'missing')
  'middle' is an OWN key whose value is undefined
  -> undefined        (not 'missing')

getPath(data, ['toString'], 'missing')
  hasOwn(data, 'toString') is false (inherited)
  -> 'missing'

getPath(data, [], 'missing')   loop never runs -> data
```

## 70 — Flatten nested configuration into dotted paths

```js
function flattenObject(root) {
  const out = new Map();
  function visit(obj, prefix) {
    for (const key of Object.keys(obj)) {
      const p = prefix ? prefix + '.' + key : key;
      const v = obj[key];
      if (v !== null && typeof v === 'object') {
        if (!Object.keys(v).length) out.set(p, {});
        else visit(v, p);
      } else out.set(p, v);
    }
  }
  visit(root, '');
  return out;
}
```

**Why it works.** The recursion carries a path prefix down instead of
building paths on the way back up, so each leaf can be recorded the
moment it is reached. `Object.keys` preserves insertion order and the
recursion is depth-first, which together produce the required ordering.
There are three cases per key, and getting them in the right order
matters: `null` is checked before `typeof` because `typeof null` is
`'object'`; a container with no keys is a *leaf*, stored as a brand-new
`{}` so the output never aliases the input; everything else is either a
container to recurse into or a plain leaf value. A `Map` is the return
type because dotted paths are arbitrary strings and, unlike an object,
a Map cannot confuse one with a prototype property. This is a path
representation, not array flattening as in exercise 10.

**Worked trace** —
`flattenObject({ user: { name: 'Ada', flags: {} }, active: true })`.

```text
visit(root, '')
  key 'user'    object, 2 keys -> visit(user, 'user')
    key 'name'  leaf 'Ada'          set 'user.name'  -> 'Ada'
    key 'flags' object, 0 keys      set 'user.flags' -> {}  (new object)
  key 'active'  leaf true           set 'active'     -> true

[...map] = [['user.name','Ada'], ['user.flags',{}], ['active',true]]
```

`flattenObject({})` returns an empty Map; `flattenObject({ a: { b: null } })`
gives `[['a.b', null]]`, because `null` is a leaf, not a container.

## 71 — Rebuild nested configuration with conflict detection

```js
function unflattenObject(entries) {
  const paths = new Set(entries.keys());
  for (const p of paths) {
    const parts = p.split('.');
    if (parts.some((x) => !x || ['__proto__', 'constructor', 'prototype'].includes(x))) throw new Error('Invalid path');
    for (let i = 1; i < parts.length; i++) {
      if (paths.has(parts.slice(0, i).join('.'))) throw new Error('Conflicting paths');
    }
  }
  const out = {};
  for (const [p, v] of entries) {
    const parts = p.split('.');
    let obj = out;
    for (const key of parts.slice(0, -1)) obj = obj[key] ??= {};
    obj[parts.at(-1)] = v !== null && typeof v === 'object' ? {} : v;
  }
  return out;
}
```

**Why it works.** Validation is a separate pass that finishes before a
single property is written, which is what makes the conflict rule work in
*either* insertion order: `'a'` plus `'a.b'` is rejected whether `'a'`
came first or second, because by the time any path is checked the `Set`
already holds every key. The prefix test asks "is any proper prefix of
this path also a full path?" — if so, one entry claims to be a leaf and
another claims it is a container. Dangerous segments (`__proto__`,
`constructor`, `prototype`) and empty segments are rejected in the same
pass; without that, `obj['__proto__'] ??= {}` would write through to the
prototype instead of creating a property. The build pass then uses
`??=` to create missing containers lazily, and clones empty-object leaves
as fresh `{}` so the output shares nothing with the input Map.

**Worked trace** —
`unflattenObject(new Map([['user.name','Ada'], ['user.flags',{}], ['ok',true]]))`.

```text
validation
  'user.name'   segments ok; prefix 'user' in paths? no
  'user.flags'  segments ok; prefix 'user' in paths? no
  'ok'          single segment, no prefixes to check

build
  'user.name'   obj = out.user ??= {}      obj.name  = 'Ada'
  'user.flags'  obj = out.user (exists)    obj.flags = {} (new object)
  'ok'          no container steps         out.ok    = true

-> { user: { name: 'Ada', flags: {} }, ok: true }
```

Rejections: `new Map([['a.b',1],['a',{}]])` — checking `'a.b'` finds the
prefix `'a'` in `paths`, so `Error('Conflicting paths')`.
`new Map([['a..b',1]])` splits to `['a','','b']`, and the empty segment
triggers `Error('Invalid path')`.

## 72 — Combine occupied calendar ranges

```js
function mergeIntervals(intervals) {
  const sorted = intervals.map(([start, end]) => [start, end]).sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else out.push([start, end]);
  }
  return out;
}
```

**Why it works.** Sorting by start time means that when you reach an
interval, every earlier interval has already been processed, so it can
only possibly overlap the most recent output interval — one comparison
per input instead of comparing all pairs. `start <= last[1]` uses `<=`
because these are closed ranges and touching counts as overlapping, so
`[1,3]` and `[3,5]` merge into `[1,5]`. `Math.max(last[1], end)` is the
detail that stops a fully contained interval from shrinking its
container: `[1,8]` followed by `[2,3]` keeps the end at `8`. The
`map(([start, end]) => [start, end])` step copies every pair before
sorting, so neither the outer array nor the inner pairs are mutated and
every output pair is new.

**Worked trace** —
`mergeIntervals([[8,10], [1,3], [2,6], [10,10]])`,
`// expected: [[1, 6], [8, 10]]`.

```text
copy + sort by start -> [[1,3], [2,6], [8,10], [10,10]]

[1,3]    out empty            -> push        out [[1,3]]
[2,6]    2 <= 3  overlap      -> end = max(3,6) = 6   out [[1,6]]
[8,10]   8 <= 6? no           -> push        out [[1,6],[8,10]]
[10,10]  10 <= 10 touching    -> end = max(10,10)     out [[1,6],[8,10]]
```

`[[1,8],[2,3],[8,9]]` merges to `[[1,9]]`: `[2,3]` is swallowed without
shortening the range, and `[8,9]` touches at `8`.

## 73 — Peak simultaneous meetings (sweep line)

```js
function peakOverlap(intervals) {
  const deltas = new Map();
  for (const [start, end] of intervals) {
    if (start === end) continue;
    deltas.set(start, (deltas.get(start) ?? 0) + 1);
    deltas.set(end, (deltas.get(end) ?? 0) - 1);
  }
  const timestamps = [...deltas.keys()].sort((a, b) => a - b);
  let active = 0, peak = 0;
  for (const time of timestamps) {
    active += deltas.get(time);
    if (active > peak) peak = active;
  }
  return peak;
}
```

**Why it works.** Instead of asking "how many meetings overlap at time
t?" for every t, you record only the moments where the count *changes*:
`+1` at each start, `-1` at each end. Sweeping those timestamps in order
while accumulating gives the live count in `O(n log n)`, dominated by the
sort. The `Map` keyed by timestamp is what makes the half-open rule work:
a meeting ending at 10 and one starting at 10 contribute `-1` and `+1` to
the *same* key, so the sum at that key is `0` and the two never appear to
overlap. Checking the peak only after the whole key has been applied is
the same idea stated the other way round. Zero-length meetings are
skipped up front, as the prompt requires.

**Worked trace** — `peakOverlap([[0,10], [5,15], [10,20]])`,
`// expected: 2`.

```text
deltas   0: +1        (from [0,10])
        10: -1 then +1 = 0   ([0,10] ends, [10,20] starts)
         5: +1        (from [5,15])
        15: -1
        20: -1

sweep in timestamp order
  t=0    active 0 + 1 = 1    peak 1
  t=5    active 1 + 1 = 2    peak 2
  t=10   active 2 + 0 = 2    peak 2
  t=15   active 2 - 1 = 1
  t=20   active 1 - 1 = 0
return 2
```

`[[1,2],[2,3],[2,2]]`: the zero-length `[2,2]` is skipped, and at `t=2`
the `-1` and `+1` cancel, so the peak is `1`. `[[4,4]]` leaves `deltas`
empty and returns `0`.

## 74 — Rank common words with deterministic ties

```js
function topKWords(text, k) {
  if (!Number.isInteger(k) || k < 0) throw new RangeError('Invalid k');
  const counts = new Map();
  for (const w of text.toLowerCase().match(/[a-z]+/g) ?? []) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || (a.word < b.word ? -1 : a.word > b.word ? 1 : 0))
    .slice(0, k);
}
```

**Why it works.** Lower-casing before matching lets one character class,
`[a-z]+`, define a word as a maximal run of ASCII letters, so
apostrophes, digits and punctuation all act as separators without any
extra code. `?? []` covers input that contains no letters at all, because
`match` returns `null` rather than an empty array — that is the trap the
hint names. Counting uses a `Map` so that a word like `constructor` is
just a key. The comparator is two-level: `b.count - a.count` sorts
frequency descending, and the `||` falls through to the alphabetical
comparison only when that difference is `0`, which is what makes ties
deterministic. Explicit `<`/`>` gives code-unit order, as required
instead of `localeCompare`. `slice(0, k)` clamps naturally, so `k = 0`
yields `[]` and an over-large `k` returns everything.

**Worked trace** — `topKWords('Tea, tea! coffee; coffee. water', 2)`.

```text
toLowerCase -> 'tea, tea! coffee; coffee. water'
match(/[a-z]+/g) -> ['tea','tea','coffee','coffee','water']
counts (insertion order) Map { tea: 2, coffee: 2, water: 1 }
records [ {tea,2}, {coffee,2}, {water,1} ]
sort
  tea vs coffee   counts tie (2 - 2 = 0) -> 'coffee' < 'tea' -> coffee first
  water last      (count 1)
  -> [ {coffee,2}, {tea,2}, {water,1} ]
slice(0, 2) -> [ { word: 'coffee', count: 2 }, { word: 'tea', count: 2 } ]
```

`topKWords('42...', 3)` matches nothing, so `?? []` yields an empty Map
and the result is `[]`. `topKWords('a', -1)` throws `RangeError`.

## 75 — Running median with sorted insertion

```js
class RunningMedian {
  #values = [];
  get size() { return this.#values.length; }
  add(n) {
    if (typeof n !== 'number' || !Number.isFinite(n)) throw new TypeError('Finite number required');
    let lo = 0, hi = this.size;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.#values[mid] < n) lo = mid + 1; else hi = mid;
    }
    this.#values.splice(lo, 0, n);
    return this.median();
  }
  median() {
    if (!this.size) return undefined;
    const m = this.size >> 1;
    return this.size % 2 ? this.#values[m] : (this.#values[m - 1] + this.#values[m]) / 2;
  }
}
```

**Why it works.** Keeping the internal array sorted at all times makes
the median a constant-time index lookup; the cost moves to insertion, but
a binary search plus one `splice` is fast enough for the stated limit of
10000 values. This binary search is a *lower-bound* search: the loop
narrows on `lo < hi` and never returns early, so it ends at the first
position whose value is not less than `n` — the correct insertion point,
duplicates included. Validation happens before any state changes, so a
rejected `add` leaves the stream exactly as it was. `size >> 1` is
integer halving, and the parity test picks one middle element for odd
sizes or averages the two central values for even ones. `#values` is
private, so the storage cannot be tampered with from outside.

**Worked trace** — the exercise file's stream;
`// expected: [5, 3, 5, 4]`.

```text
median()  size 0 -> undefined

add(5)  search over []      insert at 0   [5]
        size 1 odd,  m=0 -> 5
add(1)  lo0 hi1 mid0: 5 < 1? no -> hi 0   insert at 0   [1,5]
        size 2 even, m=1 -> (1 + 5) / 2 = 3
add(9)  lo0 hi2 mid1: 5 < 9? yes -> lo 2  insert at 2   [1,5,9]
        size 3 odd,  m=1 -> 5
add(3)  lo0 hi3 mid1: 5 < 3? no  -> hi 1
        lo0 hi1 mid0: 1 < 3? yes -> lo 1  insert at 1   [1,3,5,9]
        size 4 even, m=2 -> (3 + 5) / 2 = 4
size -> 4
add(NaN) -> TypeError, array unchanged
```

## 76 — Atomic cart edits using integer cents

```js
function applyCartBatch(cart, operations) {
  const draft = new Map(cart.map((r) => [r.sku, { ...r }]));
  for (const op of operations) {
    if (!op || typeof op.sku !== 'string' || !op.sku || !Number.isInteger(op.qty) || op.qty < 1) throw new Error('Invalid fields');
    const row = draft.get(op.sku);
    if (op.type === 'add') {
      if (!Number.isInteger(op.priceCents) || op.priceCents < 0 || (row && row.priceCents !== op.priceCents)) throw new Error('Invalid price');
      if (row) row.qty += op.qty;
      else draft.set(op.sku, { sku: op.sku, priceCents: op.priceCents, qty: op.qty });
    } else if (op.type === 'remove') {
      if (!row || row.qty < op.qty) throw new Error('Invalid removal');
      row.qty -= op.qty;
      if (!row.qty) draft.delete(op.sku);
    } else throw new Error('Unknown operation');
  }
  const items = [...draft.values()];
  return { items, totalCents: items.reduce((s, r) => s + r.qty * r.priceCents, 0) };
}
```

**Why it works.** "Atomic" means all-or-nothing, and the way to get that
without undo logic is to never touch the original: every row is cloned
into a `draft` Map up front, all operations mutate the draft, and the
caller's `cart` is only ever read. If any operation throws, the draft is
discarded with it and the cart is provably untouched — the test asserts
`cart[0].qty` is unchanged after a failed batch. The Map is keyed by SKU
so a repeat `add` finds the existing row in constant time, and because
`Map` preserves insertion order, existing rows keep their order while new
SKUs append in operation order. Prices are integer cents so totals are
exact — floating-point money is the classic rounding bug this exercise
avoids. Validation is per-operation and happens before that operation is
applied, and the shared field checks are hoisted above the type switch
because both operation types need them.

**Worked trace** — the exercise file's cart and batch.

```text
cart = [ { sku: 'tea', priceCents: 125, qty: 2 } ]
draft = Map { tea -> { sku:'tea', priceCents:125, qty:2 } }   (a clone)

op { type:'add', sku:'tea', priceCents:125, qty:1 }
  fields ok; row exists; 125 === 125 -> row.qty 2 + 1 = 3
op { type:'remove', sku:'tea', qty:2 }
  row.qty 3 >= 2 -> qty 1; not zero, row kept

items = [ { sku:'tea', priceCents:125, qty:1 } ]
totalCents = 1 * 125 = 125
-> { items: [...], totalCents: 125 }

failing batch: remove qty 3 from the original qty 2
  draft row qty 2 < 3 -> throw Error('Invalid removal')
  cart[0].qty is still 2
```

## 77 — A small explicit state machine

```js
function createMachine(initial, transitions) {
  if (!Object.hasOwn(transitions, initial)) throw new Error('Unknown initial');
  for (const events of Object.values(transitions)) {
    for (const dest of Object.values(events)) {
      if (!Object.hasOwn(transitions, dest)) throw new Error('Unknown destination');
    }
  }
  let state = initial;
  return {
    getState: () => state,
    can: (event) => Object.hasOwn(transitions[state], event),
    send(event) {
      if (!Object.hasOwn(transitions[state], event)) throw new Error('Unsupported event');
      return (state = transitions[state][event]);
    },
  };
}
```

**Why it works.** The whole graph is validated once, before the closure
exists, so a machine that was constructed successfully can never
transition into a state that does not exist — the invalid case fails at
build time rather than at some later `send`. `state` lives in the closure,
so it is unreachable except through the three returned methods, and
`getState` is a reader that cannot be used to set. `Object.hasOwn` is
what separates a declared event from an inherited property: without it,
`can('toString')` would be `true` and `send('toString')` would set the
state to a function. The `send` guard runs before the assignment, so an
unsupported event throws *without* changing state, which is what the test
checks by reading `getState()` afterwards.

**Worked trace** — the exercise file's machine.

```text
transitions { idle:{start:'running'}, running:{finish:'done',cancel:'idle'},
              done:{} }
validate: 'idle' is an own key; destinations running, done, idle all exist

state 'idle'
can('start')    hasOwn(transitions.idle, 'start')     -> true
send('start')   allowed -> state 'running'            -> 'running'
send('finish')  hasOwn(transitions.running,'finish')  -> state 'done'
send('start')   hasOwn(transitions.done, 'start') false -> throw
getState()      -> 'done'      (unchanged by the failed send)
```

`createMachine('a', { a: { go: 'missing' } })` throws at construction
because `missing` is not an own key of `transitions`.

## 78 — A shared history buffer for two editors

```js
function createHistory(max) {
  if (!Number.isInteger(max) || max < 1) throw new RangeError('Invalid capacity');
  let entries = [], cursor = -1;
  return {
    push(entry) {
      entries = entries.slice(0, cursor + 1);
      entries.push(entry);
      if (entries.length > max) entries.shift();
      cursor = entries.length - 1;
      return entries.length;
    },
    canUndo: () => cursor > 0,
    undo() {
      if (cursor <= 0) return undefined;
      return entries[--cursor];
    },
    canRedo: () => cursor + 1 < entries.length,
    redo() {
      if (cursor + 1 >= entries.length) return undefined;
      return entries[++cursor];
    },
  };
}
```

**Why it works.** One array plus one cursor models the whole undo/redo
problem: everything at or before `cursor` is the past (with `cursor`
itself being the currently applied entry), everything after it is the
redo future. `undo` and `redo` just move the cursor and return the entry
it now points at. Pushing while the cursor is not at the end must discard
the future, which is what `entries.slice(0, cursor + 1)` does — that is
the standard "new edit erases the redo stack" rule. Eviction is from the
front, so the oldest entry is lost when the buffer is over capacity, and
`cursor` is recomputed from the length afterwards so it stays valid.
`canUndo` is `cursor > 0` rather than `cursor >= 0` because the entry
under the cursor is the current state, not something to undo to. Because
`entries` and `cursor` are per-call closure variables, two wrappers that
share one returned object share the cursor, while two separate
`createHistory` calls do not.

**Worked trace** — the exercise file's `createHistory(2)` sequence.

```text
                          entries        cursor   returns
push('a')                 ['a']            0        1
push('b')                 ['a','b']        1        2
push('c')  slice(0,2)=['a','b'], push -> ['a','b','c'],
           length 3 > 2 -> shift 'a'
                          ['b','c']        1        2
undo()     cursor 1 > 0 -> entries[0]
                          ['b','c']        0       'b'
undo()     cursor 0 -> not allowed                undefined
canUndo()  0 > 0 false                            false
redo()     cursor+1 = 1 < 2 -> entries[1]
                          ['b','c']        1       'c'
push('d')  slice(0,2)=['b','c'], push -> ['b','c','d'],
           shift 'b'      ['c','d']        1        2
canRedo()  1 + 1 < 2 false                        false
createHistory(0) -> RangeError
```

## 79 — A first-in-first-out queue with O(1) operations

```js
class Queue {
  #data = new Map();
  #head = 0;
  #tail = 0;
  get size() { return this.#data.size; }
  enqueue(v) { this.#data.set(this.#tail++, v); return this; }
  peek() { return this.#data.get(this.#head); }
  dequeue() {
    if (!this.size) return undefined;
    const v = this.peek();
    this.#data.delete(this.#head++);
    if (!this.size) this.clear();
    return v;
  }
  clear() { this.#data.clear(); this.#head = this.#tail = 0; return this; }
}
```

**Why it works.** `array.shift()` is `O(n)` because every remaining
element moves down one slot; the head-index technique avoids that by
never moving anything. Each value is stored under a monotonically
increasing integer key, `#head` names the oldest key and `#tail` the next
one to be written, and dequeuing is a delete plus a cursor bump —
constant time regardless of queue length. A `Map` rather than a plain
object keeps `size` exact and avoids any prototype interference from
numeric keys. `peek` and `dequeue` return `undefined` on an empty queue
because `Map.get` of a missing key already does, and `undefined` is also
a legal stored value — which is why `dequeue` tests `size` rather than
comparing the value. Resetting the cursors when the queue drains keeps
the key numbers from growing forever, and `enqueue` returning `this`
allows chaining.

**Worked trace** — the exercise file's sequence.

```text
enqueue(1).enqueue(2).enqueue(3)
  data { 0:1, 1:2, 2:3 }   head 0  tail 3  size 3
dequeue()  size 3, peek data.get(0) = 1, delete 0, head 1
           size 2 -> returns 1                      // expected: 1
enqueue(4) data { 1:2, 2:3, 3:4 }   tail 4
dequeue()  -> 2   head 2
dequeue()  -> 3   head 3
dequeue()  -> 4   head 4, size now 0 -> clear() resets head/tail to 0
dequeue()  size 0 -> undefined
           // expected: [ 2, 3, 4, undefined ]
new Queue().peek() -> data.get(0) on an empty Map -> undefined
```

## 80 — Schema validation without a framework

```js
function validate(schema, data) {
  const errors = [];
  for (const [key, rule] of Object.entries(schema)) {
    const type = rule.type ?? 'string';
    const value = data !== null && typeof data === 'object' && Object.hasOwn(data, key) ? data[key] : undefined;
    let error;
    if (value === undefined) {
      if (rule.required) error = 'required';
    } else if (value === null || typeof value !== type || (type === 'number' && !Number.isFinite(value))) {
      error = 'wrong type';
    } else if (type === 'string') {
      if (rule.min !== undefined && value.length < rule.min) error = 'too short';
      else if (rule.max !== undefined && value.length > rule.max) error = 'too long';
    } else if (type === 'number') {
      if (rule.min !== undefined && value < rule.min) error = 'below min';
      else if (rule.max !== undefined && value > rule.max) error = 'above max';
    }
    if (error) errors.push(key + ': ' + error);
  }
  return { valid: !errors.length, errors };
}
```

**Why it works.** The rules are checked in a fixed cascade — presence,
then type, then constraints — and each field records at most one message
because `error` is a single variable and every branch is an `else if`.
That ordering is what the prompt demands: a missing required field
reports `required` rather than `wrong type`, and when both `min` and
`max` could fail only the `min` message is kept. Iterating
`Object.entries(schema)` means the error order follows schema key order
and extra keys in `data` are ignored by construction. The value lookup
guards against primitive or `null` `data` and uses `Object.hasOwn`, so an
absent key and a stored `undefined` are treated identically as "missing",
which is exactly what the prompt says. `null` is rejected before the
`typeof` test because `typeof null` is `'object'` and would never match a
declared type anyway, and `Number.isFinite` catches `NaN` and the
infinities, which `typeof` happily calls `'number'`.

**Worked trace** — the exercise file's `schema` with
`{ name: 'A', age: -1 }`.

```text
key 'name'  type 'string', required true, min 2
  value 'A'  present, typeof 'string' ok
  length 1 < 2 -> 'too short'          errors ['name: too short']
key 'age'   type 'number', min 0, max 130
  value -1   present, finite number
  -1 < 0 -> 'below min'   (max is not consulted)
                                       errors [..., 'age: below min']
key 'email' type defaults to 'string', not required
  value undefined, rule.required falsy -> no error

-> { valid: false, errors: ['name: too short', 'age: below min'] }
```

`validate(schema, { name: 'Li', age: 30 })` produces
`{ valid: true, errors: [] }`. `validate(schema, null)` finds no own
properties, so every value is `undefined`; only `name` is required, so
`valid` is `false`.

## 81 — Install order for packages (Kahn topological sort)

```js
function topoSort(nodes, edges) {
  const next = new Map(nodes.map((n) => [n, new Set()]));
  const degree = new Map(nodes.map((n) => [n, 0]));
  for (const [a, b] of edges) {
    if (!next.get(a).has(b)) {
      next.get(a).add(b);
      degree.set(b, degree.get(b) + 1);
    }
  }
  const ready = nodes.filter((n) => degree.get(n) === 0).sort();
  const out = [];
  while (ready.length) {
    const n = ready.shift();
    out.push(n);
    for (const b of next.get(n)) {
      degree.set(b, degree.get(b) - 1);
      if (!degree.get(b)) { ready.push(b); ready.sort(); }
    }
  }
  if (out.length !== nodes.length) throw new Error('cycle');
  return out;
}
```

**Why it works.** Kahn's algorithm is breadth-first search over a
dependency graph: a node may be emitted once its in-degree — the number
of unmet prerequisites — reaches zero, and emitting it decrements the
in-degree of everything that depended on it. The adjacency `Set` is what
makes duplicate edges harmless: a repeated `[a, b]` is not added twice,
so `b`'s in-degree is not inflated and `b` can still be released. Keeping
`ready` sorted after every insertion is what makes the output
deterministic — among nodes that are simultaneously available, the
alphabetically smallest is taken. The cycle test is the final count: a
node inside a cycle never reaches in-degree zero, so if fewer nodes were
emitted than exist, something is circular, and the message contains
`cycle` as the test requires.

**Worked trace** — `topoSort(['b','a','c'], [['a','c'], ['b','c']])`,
`// expected: ['a', 'b', 'c']`.

```text
next    a -> {c}   b -> {c}   c -> {}
degree  a 0        b 0        c 2

ready = nodes with degree 0, sorted -> ['a', 'b']
shift 'a'  out ['a']        c: 2 -> 1   not ready
shift 'b'  out ['a','b']    c: 1 -> 0   ready ['c']
shift 'c'  out ['a','b','c']
out.length 3 === nodes.length 3 -> return ['a','b','c']
```

`topoSort(['a','b'], [['a','b'], ['b','a']])`: both in-degrees are `1`,
`ready` starts empty, `out` stays empty, `0 !== 2`, so it throws
`Error('cycle')`.

## 82 — Rolling average over a live measurement feed

```js
function createRollingAverage(windowSize) {
  if (!Number.isInteger(windowSize) || windowSize < 1) throw new RangeError('Invalid window');
  const values = new Array(windowSize);
  let count = 0, index = 0, sum = 0;
  return {
    push(n) {
      if (count === windowSize) sum -= values[index];
      else count++;
      values[index] = n;
      sum += n;
      index = (index + 1) % windowSize;
      return sum / count;
    },
    average: () => (count ? sum / count : NaN),
    get size() { return count; },
    reset() { count = index = sum = 0; },
  };
}
```

**Why it works.** A ring buffer of fixed length plus a running `sum`
makes `push` constant time: `index` cycles with `% windowSize`, so the
slot about to be overwritten always holds the oldest value in the window,
and subtracting it before writing the new one keeps `sum` correct without
re-adding the whole window. The `count === windowSize` test distinguishes
the fill phase (nothing to evict, `count` grows) from the steady state
(evict then write), which is why the average is over `count` and not
always over `windowSize`. `average()` returns `NaN` for an empty feed
rather than dividing by zero, `size` is a getter so callers can read but
not set it, and every instance has its own closure variables, so two
feeds never interfere.

**Worked trace** — the exercise file's `createRollingAverage(3)`.

```text
push  count==3?  sum change            values       index  returns
10    no  (0)    count 1, sum 0+10=10  [10,_,_]      1      10/1 = 10
20    no  (1)    count 2, sum 30       [10,20,_]     2      30/2 = 15
30    no  (2)    count 3, sum 60       [10,20,30]    0      60/3 = 20
40    yes        sum -= values[0]=10 -> 50
                 values[0]=40, sum 90  [40,20,30]    1      90/3 = 30
size -> 3
reset()          count = index = sum = 0
average()        count 0 -> NaN
createRollingAverage(0) -> RangeError
```

## 83 — Capstone: async pipeline with an error trap

```js
function asyncPipeline(stages) {
  const list = [...stages];
  let trap;
  return {
    use(fn) { trap = fn; },
    async run(initial) {
      let value = await initial;
      for (let i = 0; i < list.length; i++) {
        try { value = await list[i](value); }
        catch (error) {
          if (!trap) throw error;
          value = await trap({ error, stageIndex: i });
        }
      }
      return value;
    },
  };
}
```

**Why it works.** This pulls together most of the pack: a closure holds
the configuration, `[...stages]` copies the array so later mutation by
the caller cannot change the pipeline, and a plain `for` loop with one
`await` inside gives both the stage index and a place to catch. Wrapping
just the single `await list[i](value)` in `try` is what makes a
synchronous `throw` and a rejected promise behave identically — `await`
turns the rejection into an exception at that exact point. The trap's
return value becomes that stage's output, so the loop simply continues
with the recovered value; with no trap registered, `throw error` rejects
`run`'s promise with the original reason unchanged. Nothing outside
`run` is mutated, so `run` can be called repeatedly and `use` can swap
the trap between calls.

**Worked trace** — the exercise file's pipeline.

```text
stages [ n => n + 1, () => { throw Error('boom') }, n => n * 10 ]

use(() => 0);  run(1)
  value 1
  i=0  1 + 1 = 2
  i=1  throws -> trap({error, stageIndex: 1}) -> 0     value 0
  i=2  0 * 10 = 0
  -> 0                                        // expected: 0

use(({ stageIndex }) => stageIndex);  run(5)
  value 5
  i=0  5 + 1 = 6
  i=1  throws -> trap returns stageIndex 1             value 1
  i=2  1 * 10 = 10
  -> 10                                       // expected: 10

asyncPipeline([]).run('x')
  loop body never runs -> 'x'                 // expected: 'x'
```

With no `use` call, a stage rejection propagates out of `run` unchanged.

---

## Design notes — the ideas this pack keeps returning to

Each line names a cross-cutting idea and the exercise where it first
appears, then where it comes back.

- **Immutability — never mutate the caller's data.** First at 03 (spread
  before `sort`), then 23 (a reducer that returns new arrays), 42, 67, 68
  and 76 (a cloned draft so a failed batch leaves the cart untouched).
- **`Map` vs plain object for keyed data.** First at 04 (`'constructor'`
  as a word), then 25, 27, 66, 74 and 79. A `Map` has no prototype, keeps
  insertion order, and compares keys by identity.
- **Own-property checks instead of truthiness.** First at 04, then 27
  (`cache.has` so a cached `undefined` counts), 69 (`Object.hasOwn` as
  the missing sentinel), 77 and 80.
- **Closures as private state.** First at 06, then 26, 27, 30, 47, 48,
  78, 82 and 83 — a factory function returns an API whose variables no
  caller can reach.
- **Classes with `#private` fields.** First at 17, then 18, 56, 75 and
  79, for the same goal with an object-oriented shape and an enforceable
  invariant.
- **Stack vs recursion.** The explicit stack first at 22 (balanced
  brackets); recursion at 19, 28, 45, 50 and 58. Same LIFO idea, one on
  the heap, one on the call stack.
- **Two pointers and sliding windows.** First at 35 (read/write
  pointers), then 40 (a window that only moves forward), 42, 46, 59 and
  75.
- **Sorting with an explicit comparator and a deterministic tie-break.**
  First at 03 (`(a, b) => a - b`, because the default sort is
  lexicographic), then 07, 32, 68, 74 and 81.
- **Memoisation and DP tables.** First at 27 (`memoize`), then 49
  (`fibMemo` at 59 calls versus 2,692,537), 52, 53 and 54 — remember
  subproblem answers instead of recomputing them.
- **Promises, microtasks and timer lifecycle.** First at 20 (the
  waterfall), then 21, 47, 48, 60, 61, 62, 63, 64, 65 and 83. Microtasks
  run before timer callbacks (64), timers must be cleared on every path
  (64, 65), and a promise settles only once (60).
- **BFS for shortest paths and orderings.** First at 33 (word ladder),
  then 81 (Kahn's topological sort is BFS over a dependency graph). Both
  need a `seen`/in-degree structure to stay finite.
- **Sweep and prefix/suffix passes.** First at 36 (Kadane's running
  best), then 51 (prefix and suffix products), 72 (sort then merge) and
  73 (a `+1`/`-1` sweep line).

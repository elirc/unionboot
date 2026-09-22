# unionboot — Solutions

> Try each exercise for 10+ minutes before reading. Reading the solution
> is fine; copying it without understanding defeats the point.

## 01 — Temperature converter

```js
function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}
```

## 02 — Initials

```js
function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0].toUpperCase())
    .join(".") + ".";
}
```

## 03 — Second largest

```js
function secondLargest(nums) {
  return [...new Set(nums)].sort((a, b) => b - a)[1];
}
```

## 04 — Word counter

```js
function countWords(words) {
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  return Object.fromEntries(counts);
}
```

## 05 — FizzBuzz

```js
for (let i = 1; i <= 30; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}
```

## 06 — Make a counter

```js
function makeCounter(start = 0) {
  let count = start;
  return () => ++count;
}
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

## 08 — Shopping cart

```js
function checkout(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const rate = subtotal > 1000 ? 0.2 : subtotal > 500 ? 0.1 : 0;
  const discount = subtotal * rate;
  return { subtotal, discount, total: subtotal - discount };
}
```

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

## 11 — Palindrome check

```js
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z]/g, "");
  return clean === [...clean].reverse().join("");
}
```

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

## 15 — Reverse the words

```js
function reverseWords(sentence) {
  return sentence.trim().split(/\s+/).reverse().join(" ");
}
```

## 16 — Anagram check

```js
function areAnagrams(a, b) {
  const norm = (s) => s.toLowerCase().replace(/\s/g, "").split("").sort().join("");
  return norm(a) === norm(b);
}
```

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

## 28 — Tree sum

```js
function treeSum(node) {
  if (!node) return 0;
  return (
    node.value + node.children.reduce((sum, child) => sum + treeSum(child), 0)
  );
}
```

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

## 31 — Mini template engine

```js
function render(template, data) {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
    const value = path.split(".").reduce((obj, key) => obj?.[key], data);
    return value === undefined ? match : String(value);
  });
}
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

---

## Design notes (why the tricky ones are tricky)

- **17 LRU:** a plain `Map` keeps insertion order, so "delete then re-set" is
  the whole trick for tracking recency.
- **19 deepEqual:** `typeof null === "object"` is the classic JS trap; also
  `[1,2]` vs `{0:1, 1:2}` must not compare equal.
- **21 retry:** you can't `await` inside a plain `.catch()` chain without an
  async function — the setTimeout-in-catch recursion is the standard pattern.
- **22 brackets:** `")("` must fail because you pop before you push — an
  empty stack pop returns `undefined`, which fails the comparison naturally.
- **23 reducer:** every case must return a NEW array/object. `state.map(...)`
  and `[...state, x]` do this for free; `state.push(x)` does not.
- **31 template:** `?.` (optional chaining) in the `.reduce()` handles the
  "unknown key" case in one expression.
- **33 word ladder:** BFS guarantees the shortest path; the `seen` set is
  what keeps it from exploding combinatorially.

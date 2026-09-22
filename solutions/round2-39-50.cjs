'use strict';
// Reference solutions 39–50. Keep learner files blank while practising.
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
function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (const s of strs.slice(1)) {
    while (!s.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}
function mergeSorted(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  return out.concat(a.slice(i), b.slice(j));
}
function countPrimes(n) {
  if (n <= 2) return 0;
  const prime = new Uint8Array(n).fill(1);
  prime[0] = prime[1] = 0;
  for (let p = 2; p * p < n; p++) {
    if (prime[p]) for (let k = p * p; k < n; k += p) prime[k] = 0;
  }
  return prime.reduce((sum, bit) => sum + bit, 0);
}
function subsets(nums) {
  let out = [[]];
  for (const n of nums) out = out.concat(out.map(a => [...a, n]));
  return out;
}
function permutations(arr) {
  if (!arr.length) return [[]];
  return arr.flatMap((value, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(rest => [value, ...rest]));
}
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
// Optional scheduler enables deterministic timer tests. Defaults are real timers.
function debounce(fn, waitMs, timers = { setTimeout, clearTimeout }) {
  let id;
  return function (...args) {
    timers.clearTimeout(id);
    id = timers.setTimeout(() => fn.apply(this, args), waitMs);
  };
}
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
module.exports = { compress, lengthOfLongestSubstring, longestCommonPrefix, mergeSorted, countPrimes, subsets, permutations, rotate, debounce, throttle, fibonacciSuite, deepClone };

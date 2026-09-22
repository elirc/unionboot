"use strict";
// Reference implementations for 34–38 and 51–83. Not imported by starters.
// Run all reference tests: node ../verify-round2-remaining.cjs (from this folder).
const fs = require("node:fs");

function twoSum(nums, target) {
  const seen = new Map();
  for (let j = 0; j < nums.length; j++) {
    if (seen.has(target - nums[j])) return [seen.get(target - nums[j]), j];
    seen.set(nums[j], j);
  }
}
function moveZeroes(nums) {
  let write = 0;
  for (const n of nums) if (n !== 0) nums[write++] = n;
  while (write < nums.length) nums[write++] = 0;
}
function maxSubArray(nums) {
  let current = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}
const romanPairs = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
function romanToInt(s) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) total += values[s[i]] < values[s[i + 1]] ? -values[s[i]] : values[s[i]];
  return total;
}
function intToRoman(num) {
  let out = "";
  for (const [value, symbol] of romanPairs) {
    while (num >= value) { out += symbol; num -= value; }
  }
  return out;
}
function productExceptSelf(nums) {
  const out = new Array(nums.length);
  let prefix = 1, suffix = 1;
  for (let i = 0; i < nums.length; i++) { out[i] = prefix; prefix *= nums[i]; }
  for (let i = nums.length - 1; i >= 0; i--) { out[i] *= suffix; suffix *= nums[i]; }
  return out;
}
function uniquePaths(m, n) {
  const row = Array(n).fill(1);
  for (let r = 1; r < m; r++) for (let c = 1; c < n; c++) row[c] += row[c - 1];
  return row[n - 1];
}
function climbStairs(n) {
  let previous = 1, current = 1;
  for (let i = 2; i <= n; i++) [previous, current] = [current, previous + current];
  return current;
}
function coinChange(coins, amount) {
  const best = Array(amount + 1).fill(Infinity);
  best[0] = 0;
  for (let a = 1; a <= amount; a++) for (const coin of coins) {
    if (coin <= a) best[a] = Math.min(best[a], best[a - coin] + 1);
  }
  return best[amount] === Infinity ? -1 : best[amount];
}
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
function bsearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}
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
async function asyncReduce(items, reducer, initial) {
  let acc = await initial;
  for (let i = 0; i < items.length; i++) acc = await reducer(acc, items[i], i);
  return acc;
}
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

module.exports = {
  34: twoSum, 35: moveZeroes, 36: maxSubArray, 37: romanToInt, 38: intToRoman,
  51: productExceptSelf, 52: uniquePaths, 53: climbStairs, 54: coinChange,
  55: TinyDB, 56: BankAccount, 57: LinkedList, 58: BST, 59: bsearch,
  60: promiseAll, 61: allSettled, 62: mapLimit, 63: asyncReduce,
  64: withTimeout, 65: abortableDelay,
  72: mergeIntervals, 73: peakOverlap,
};

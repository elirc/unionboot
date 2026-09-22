'use strict';
// Inventory and existing regression checks; NOT a claim of full correctness.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const root = __dirname;
const files = fs.readdirSync(root);
const missingStarters = [], invalidStarters = [], missingSolutions = [];
let syntaxPassed = 0;
for (let id = 1; id <= 83; id++) {
  const matches = files.filter(name => name.startsWith(String(id).padStart(2, '0') + '-') && name.endsWith('.js'));
  if (matches.length !== 1) { missingStarters.push(id); continue; }
  try { new vm.Script(fs.readFileSync(path.join(root, matches[0]), 'utf8'), { filename: matches[0] }); syntaxPassed++; }
  catch (error) { invalidStarters.push({ id, message: error.message }); }
}
const documented = fs.readFileSync(path.join(root, 'SOLUTIONS.md'), 'utf8');
const remaining = require('./solutions/round2-remaining.cjs');
const batch = require('./solutions/round2-39-50.cjs');
const names = ['compress', 'lengthOfLongestSubstring', 'longestCommonPrefix', 'mergeSorted', 'countPrimes', 'subsets', 'permutations', 'rotate', 'debounce', 'throttle', 'fibonacciSuite', 'deepClone'];
for (let id = 1; id <= 83; id++) {
  const present = id <= 33
    ? new RegExp('## ' + String(id).padStart(2, '0') + ' [^\\n]+\\r?\\n\\s*```js\\r?\\n[\\s\\S]+?```').test(documented)
    : id >= 39 && id <= 50 ? typeof batch[names[id - 39]] === 'function' : typeof remaining[id] === 'function';
  if (!present) missingSolutions.push(id);
}
console.log(`Starter syntax: ${syntaxPassed}/83 pass (not solution correctness).`);
console.log(`Missing/duplicate starters: ${missingStarters.join(', ') || 'none'}`);
console.log(`Invalid starter syntax: ${JSON.stringify(invalidStarters)}`);
console.log(`Reference presence: ${83 - missingSolutions.length}/83 (presence is not proof).`);
console.log(`Missing reference solutions: ${missingSolutions.join(', ') || 'none'}`);
let failures = 0;
for (const file of ['verify-23.cjs', 'verify-39-50.cjs', 'verify-round2-remaining.cjs']) {
  console.log(`\nRunning ${file}`);
  const run = spawnSync(process.execPath, [path.join(root, file)], { encoding: 'utf8', timeout: 120000 });
  process.stdout.write(run.stdout || '');
  process.stderr.write(run.stderr || '');
  if (run.status !== 0) { failures++; console.error(run.error?.message || `Exit status: ${run.status}`); }
}
console.log('\nExisting harnesses do not cover every exercise. Full 83-exercise correctness: NOT VERIFIED.');
console.log('Audit gate: FAIL until missing solutions and full per-exercise correctness coverage are supplied.');
// Fail closed: existing test commands cannot prove all 83 solutions correct.
process.exitCode = 1;

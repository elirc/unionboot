'use strict';
// Why this works:
// Three flat records describe the same document: the common ancestor `base`,
// and two independent edits, `local` and `remote`. A key that is absent means
// that side deleted it, so absence has to be something the comparison can
// handle as a value in its own right.
// `missing` is a unique Symbol used as that value, and `read` returns it
// whenever Object.hasOwn reports the key is not an own property. A sentinel is
// needed rather than undefined or a `record[key] ?? fallback` fallback,
// because the record values are strings and deletion must stay distinguishable
// from the empty string: the test asserts that solve({}, {a:''}, {a:''}) keeps
// a with the value ''.
// Object.hasOwn also keeps inherited names out of the answer. The test feeds a
// record parsed from '{"__proto__":"data","constructor":"ok"}', where both of
// those are ordinary own data keys and must be merged like any other.
// The rule per key, in the prompt's order: if the two sides agree, take that;
// otherwise whichever side still matches base is the one that did not change,
// so the other side's value wins; otherwise both moved and it is a conflict,
// where local is kept (including a local deletion) and the key is recorded.
// Keys are visited in sorted order, so `conflicts` is lexicographically sorted
// without a second sort.
// Entries are collected into an array and handed to Object.fromEntries, which
// defines each one as an own data property, so a key of '__proto__' becomes
// data in the result rather than a prototype assignment. A selected value of
// `missing` means the key is deleted and is simply not emitted.
// Nothing is written to any input, so the frozen records in the test are safe.
function solve(base, local, remote) {
  const missing = Symbol('missing');
  const read = (record, key) => (Object.hasOwn(record, key) ? record[key] : missing);
  const allKeys = new Set([
    ...Object.keys(base),
    ...Object.keys(local),
    ...Object.keys(remote),
  ]);
  const entries = [];
  const conflicts = [];
  for (const key of [...allKeys].sort()) {
    const baseValue = read(base, key);
    const localValue = read(local, key);
    const remoteValue = read(remote, key);
    let selected;
    if (localValue === remoteValue) {
      selected = localValue;
    } else if (localValue === baseValue) {
      selected = remoteValue;
    } else if (remoteValue === baseValue) {
      selected = localValue;
    } else {
      conflicts.push(key);
      selected = localValue;
    }
    if (selected !== missing) {
      entries.push([key, selected]);
    }
  }
  return { value: Object.fromEntries(entries), conflicts };
}
module.exports=solve;

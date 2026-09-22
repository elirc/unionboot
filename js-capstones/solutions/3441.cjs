'use strict';
// Why this works:
// A recursive walk over two JSON values that emits a JSON Pointer operation
// wherever they differ.
// `isPlainObject` separates the one case that is compared field by field from
// everything else. Arrays are atomic under the prompt's rule, so an array is
// never descended into: if it differs at all, a single replace is emitted for
// the whole array.
// `equal` is a structural comparison rather than ===. For objects it compares
// own keys irrespective of insertion order, which is why
// solve([{a:1,b:2}],[{b:2,a:1}]) emits nothing even though the two arrays hold
// distinct objects whose keys were written in a different order.
// visit returns immediately when the two sides are structurally equal, so an
// unchanged subtree costs nothing. When both sides are plain objects it walks
// the sorted union of their own keys, which makes the order of the emitted
// operations deterministic and independent of insertion order. A key present
// only in `before` is a remove, and the remove object is built without a
// `value` property at all rather than with an undefined one; a key present
// only in `after` is an add; a key in both recurses. Anything else — a scalar,
// a change of type, an array difference, or the root itself — becomes a
// replace at the current pointer.
// Pointer segments escape '~' as '~0' first and '/' as '~1' second. The order
// matters: escaping '/' first produces a '~1' whose tilde the second pass
// would then escape again into '~01'.
// Every emitted value passes through clone, so no operation aliases either
// input. The test proves this by pushing onto out[0].value.v and then
// asserting that after.n.v is still [1].
// Object.hasOwn is used for the membership tests so that an own key named
// '__proto__' or 'constructor' counts as data and an inherited name is never
// mistaken for a present key. Neither input is written to, so the frozen
// objects in the test are safe.
function solve(before, after) {
  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
  function equal(a, b) {
    if (a === b) {
      return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((item, index) => equal(item, b[index]));
    }
    if (isPlainObject(a) && isPlainObject(b)) {
      const keys = Object.keys(a);
      if (keys.length !== Object.keys(b).length) {
        return false;
      }
      return keys.every((key) => Object.hasOwn(b, key) && equal(a[key], b[key]));
    }
    return false;
  }
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function escapeSegment(key) {
    return key.replace(/~/g, '~0').replace(/\//g, '~1');
  }
  const ops = [];
  function visit(a, b, pointer) {
    if (equal(a, b)) {
      return;
    }
    if (!isPlainObject(a) || !isPlainObject(b)) {
      ops.push({ op: 'replace', path: pointer, value: clone(b) });
      return;
    }
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of [...allKeys].sort()) {
      const childPointer = pointer + '/' + escapeSegment(key);
      if (!Object.hasOwn(b, key)) {
        ops.push({ op: 'remove', path: childPointer });
      } else if (!Object.hasOwn(a, key)) {
        ops.push({ op: 'add', path: childPointer, value: clone(b[key]) });
      } else {
        visit(a[key], b[key], childPointer);
      }
    }
  }
  visit(before, after, '');
  return ops;
}
module.exports=solve;

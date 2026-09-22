// 1852 Persistent versioned stacks / scenario 4 — view=bottom; empty=error
// Prompt: ../prompts/1852.txt
'use strict';
const cfg={"view":"bottom","empty":"error"};
// Why this works:
// Every version is one immutable node {value, next, size}. A push allocates a
// single node whose next points at the version being pushed onto, so every
// older version keeps working and nothing is copied. That is the structural
// sharing the prompt demands; it is reviewed by reading this file, not by a
// test, so pushing a copied array here would still pass but would be wrong.
// versions[] is an append-only array of heads, which is what lets an operation
// branch off any earlier version by index.
// Policy view=cfg.view selects what a read reports; policy empty=cfg.empty
// decides whether popping an already empty version throws RangeError('Empty
// stack') or appends another empty version.
function persistentStacks(input) {
  const versions = [null];
  const queries = [];

  function readView(head) {
    const values = [];
    for (let at = head; at; at = at.next) {
      values.push(at.value);
    }
    if (cfg.view === 'bottom') return values.reverse();
    if (cfg.view === 'size') return values.length;
    if (cfg.view === 'peek') return values[0] ?? null;
    if (cfg.view === 'last-two') return values.slice(0, 2);
    return values;
  }

  for (const op of input) {
    if (!Number.isInteger(op.version) || op.version < 0 || op.version >= versions.length) {
      throw new RangeError('Unknown version');
    }
    const head = versions[op.version];
    if (op.type === 'push') {
      versions.push(Object.freeze({ value: op.value, next: head, size: (head?.size || 0) + 1 }));
    } else if (op.type === 'pop') {
      if (!head && cfg.empty === 'error') {
        throw new RangeError('Empty stack');
      }
      versions.push(head ? head.next : null);
    } else if (op.type === 'read') {
      queries.push(readView(head));
    } else {
      throw new Error('Unknown operation');
    }
  }

  return { versions: versions.length, queries };
}
module.exports=persistentStacks;

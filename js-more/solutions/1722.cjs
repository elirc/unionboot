// 1722 LFU cache eviction / scenario 4 — capacity=3; tie=newest
// Prompt: ../prompts/1722.txt
'use strict';
const cfg={"capacity":3,"tie":"newest"};
// Why this works:
// One Map holds key -> {value, frequency, touched}. A Map is used because the
// keys are arbitrary strings and the test stores a key named '__proto__', which
// a plain object would treat as a prototype reference rather than as data.
// frequency is the LFU ordering key. touched is a serial number bumped on every
// successful access, so it records the order of last successful access without
// needing a clock.
// cfg.capacity decides when an insert must evict; cfg.tie decides which of the
// equally infrequent entries is the victim: 'oldest' takes the smallest touched,
// 'newest' the largest.
// A get miss pushes null and changes nothing, so it raises no frequency and does
// not advance the serial. The returned entries are sorted by code-unit key, which
// is independent of both insertion order and eviction order.
function lfu(input) {
  const entries = new Map();
  const reads = [];
  let serial = 0;
  for (const op of input.ops) {
    if (op.type === 'get') {
      const item = entries.get(op.key);
      reads.push(item ? item.value : null);
      if (item) {
        item.frequency++;
        item.touched = serial++;
      }
    } else if (op.type === 'put') {
      if (entries.has(op.key)) {
        // Replacing an existing key counts as an access, not as an insert.
        const item = entries.get(op.key);
        item.value = op.value;
        item.frequency++;
        item.touched = serial++;
      } else {
        if (entries.size === cfg.capacity) {
          const ranked = [...entries].sort((left, right) =>
            left[1].frequency - right[1].frequency ||
            (cfg.tie === 'oldest'
              ? left[1].touched - right[1].touched
              : right[1].touched - left[1].touched));
          const victim = ranked[0];
          entries.delete(victim[0]);
        }
        entries.set(op.key, {value: op.value, frequency: 1, touched: serial++});
      }
    } else {
      throw new Error('Unknown operation');
    }
  }
  const sortedEntries = [...entries]
    .sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0))
    .map(([key, item]) => [key, item.value, item.frequency]);
  return {reads, entries: sortedEntries};
}
module.exports=lfu;

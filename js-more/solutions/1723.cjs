// 1723 LFU cache eviction / scenario 5 — capacity=4; tie=oldest
// Prompt: ../prompts/1723.txt
'use strict';
const cfg={"capacity":4,"tie":"oldest"};
function lfu(input) {
  const entries = new Map(); let serial = 0; const reads = [];
  for (const op of input.ops) {
    if (op.type === 'get') {
      const item = entries.get(op.key);
      reads.push(item ? item.value : null);
      if (item) { item.frequency++; item.touched = serial++; }
    } else if (op.type === 'put') {
      if (entries.has(op.key)) {
        const item = entries.get(op.key); item.value = op.value;
        item.frequency++; item.touched = serial++;
      } else {
        if (entries.size === cfg.capacity) {
          const victim = [...entries].sort((a,b) => a[1].frequency-b[1].frequency ||
            (cfg.tie === 'oldest' ? a[1].touched-b[1].touched : b[1].touched-a[1].touched))[0];
          entries.delete(victim[0]);
        }
        entries.set(op.key, {value:op.value, frequency:1, touched:serial++});
      }
    } else throw new Error('Unknown operation');
  }
  return {reads, entries:[...entries].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0).map(([key,v])=>[key,v.value,v.frequency])};
}
module.exports=lfu;

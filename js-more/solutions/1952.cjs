// 1952 Elementary cellular automata / scenario 4 — rule=54; wrap=true
// Prompt: ../prompts/1952.txt
'use strict';
const cfg={"rule":54,"wrap":true};
// Why this works:
// An elementary cellular automaton names each cell's next state after the
// three cells above it. left*4 + self*2 + right is a number 0..7, and bit
// number of cfg.rule at that position is the new value - which is what
// (cfg.rule >> code) & 1 reads.
// The update is synchronous: cells.map reads the old row for every cell and
// only then is the new row assigned, so no cell ever sees a neighbour that has
// already moved on.
// get() is what makes the boundary policy explicit. Policy wrap=false reads 0
// outside the array; policy wrap=true reads round the other edge, which turns
// the row into a circle.
// history is seeded with a copy of the initial row and gains one copy per
// step, so the result is steps+1 rows and never aliases input.cells.
function automaton(input) {
  if (!Number.isInteger(input.steps) || input.steps < 0) {
    throw new RangeError('Steps');
  }
  let cells = [...input.cells];
  const history = [[...cells]];
  for (let step = 0; step < input.steps; step++) {
    const get = i => (cfg.wrap ? cells[(i + cells.length) % cells.length] : (cells[i] || 0));
    cells = cells.map((value, i) => (cfg.rule >> (get(i - 1) * 4 + value * 2 + get(i + 1))) & 1);
    history.push([...cells]);
  }
  return history;
}
module.exports=automaton;

// 1956 Elementary cellular automata / scenario 8 — rule=110; wrap=true
// Prompt: ../prompts/1956.txt
'use strict';
const cfg={"rule":110,"wrap":true};
function automaton(input) {
  let cells=[...input.cells];const history=[[...cells]];
  if(!Number.isInteger(input.steps)||input.steps<0)throw new RangeError('Steps');
  for(let step=0;step<input.steps;step++){
    const get=i=>cfg.wrap?cells[(i+cells.length)%cells.length]:(cells[i]||0);
    cells=cells.map((value,i)=>(cfg.rule>>(get(i-1)*4+value*2+get(i+1)))&1);history.push([...cells]);
  }
  return history;
}
module.exports=automaton;

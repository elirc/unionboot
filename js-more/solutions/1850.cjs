// 1850 Persistent versioned stacks / scenario 2 — view=top; empty=error
// Prompt: ../prompts/1850.txt
'use strict';
const cfg={"view":"top","empty":"error"};
function persistentStacks(input) {
  const versions=[null],queries=[];
  for(const op of input){
    if(!Number.isInteger(op.version)||op.version<0||op.version>=versions.length)throw new RangeError('Unknown version');
    const node=versions[op.version];
    if(op.type==='push')versions.push(Object.freeze({value:op.value,next:node,size:(node?.size||0)+1}));
    else if(op.type==='pop'){
      if(!node&&cfg.empty==='error')throw new RangeError('Empty stack');
      versions.push(node?node.next:null);
    }else if(op.type==='read'){
      const values=[];for(let at=node;at;at=at.next)values.push(at.value);
      queries.push(cfg.view==='bottom'?values.reverse():cfg.view==='size'?values.length:cfg.view==='peek'?(values[0]??null):cfg.view==='last-two'?values.slice(0,2):values);
    }else throw new Error('Unknown operation');
  }
  return {versions:versions.length,queries};
}
module.exports=persistentStacks;

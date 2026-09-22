// 1809 JSON wildcard selection / scenario 1 — order=forward; missing=skip; output=all
// Prompt: ../prompts/1809.txt
'use strict';
const cfg={"order":"forward","missing":"skip","output":"all"};
function jsonSelection(input) {
  let nodes=[input.value];
  for(const token of input.path){const next=[];
    for(const value of nodes){
      if(token==='*'){
        if(value&&typeof value==='object'){
          let keys=Object.keys(value);if(cfg.order==='reverse')keys.reverse();
          for(const key of keys)next.push(value[key]);
        }
      }else if(value!==null&&typeof value==='object'&&Object.prototype.hasOwnProperty.call(value,token))next.push(value[token]);
      else if(cfg.missing==='null')next.push(null);
      else if(cfg.missing==='error')throw new Error('Missing path');
    }
    nodes=next;
  }
  if(cfg.output==='count')return nodes.length;
  if(cfg.output==='first')return nodes.length?nodes[0]:null;
  return nodes;
}
module.exports=jsonSelection;

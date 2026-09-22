// 1783 KMP substring matches / scenario 5 — output=first; fold=false
// Prompt: ../prompts/1783.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"output":"first","fold":false};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
function oracle(input){const t=cfg.fold?input.text.toLowerCase():input.text,p=cfg.fold?input.pattern.toLowerCase():input.pattern,h=[];for(let i=0;i<=t.length-p.length;i++){if(t.slice(i,i+p.length)===p){h.push(i);if(cfg.output==='disjoint'&&p.length)i+=p.length-1;}}return cfg.output==='first'?(h[0]??-1):cfg.output==='last'?(h.at(-1)??-1):cfg.output==='count'?h.length:h;}
 for(const input of [{text:'',pattern:''},{text:'abc',pattern:''},{text:'ABabaBa',pattern:'aba'},{text:'aaaaa',pattern:'aa'},{text:'ababcababd',pattern:'ababd'},{text:'a',pattern:'long'},{text:'abc',pattern:'z'}])check(input,oracle(input));
};
